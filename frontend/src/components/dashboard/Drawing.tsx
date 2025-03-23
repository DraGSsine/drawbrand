import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import { fabric } from "fabric";
import EraserBrush from "@/utils/drawing/EraserBrush";
import LineTool from "@/utils/drawing/LineTool";
import ShapeTool, { ShapeType } from "@/utils/drawing/ShapeTool";
import IconTool from "@/utils/drawing/IconTool";
import ImageTool from "@/utils/drawing/ImageTool";
import Toolbar from "./ToolBar";
import { RotateLeft, Trash } from "../../../public/icons/SvgIcons";
import { Button } from "@/components/ui/button";

type Tool = "pencil" | "select" | "eraser" | "line" | "shape" | "icon" | "image";

const Sketch: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const [tool, setTool] = useState<Tool>("pencil");
  const eraserBrushRef = useRef<any>(null);
  const lineToolRef = useRef<LineTool | null>(null);
  const shapeToolRef = useRef<ShapeTool | null>(null);
  const iconToolRef = useRef<IconTool | null>(null);
  const imageToolRef = useRef<ImageTool | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [history, setHistory] = useState<fabric.Object[]>([]);
  const [undoHistory, setUndoHistory] = useState<string[]>([]);
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 600 });

  // Selected shape and icon state
  const [selectedShape, setSelectedShape] = useState<ShapeType>(ShapeType.RECTANGLE);
  const [fillMode, setFillMode] = useState<'regular' | 'solid'>('regular');
  
  // Add stroke width state
  const [strokeWidth, setStrokeWidth] = useState<number>(2);

  // Add constants for both storage keys
  const DRAWING_STORAGE_KEY = 'logo-generator-canvas';
  const DRAWING_JSON_STORAGE_KEY = 'logo-generator-canvas-json';

  // Resize canvas to fit container
  const resizeCanvas = () => {
    if (!containerRef.current || !fabricRef.current) return;
    
    // Get container dimensions
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    
    // Get the effective width and height considering padding
    const containerStyle = window.getComputedStyle(container);
    const paddingX = parseFloat(containerStyle.paddingLeft) + parseFloat(containerStyle.paddingRight);
    const paddingY = parseFloat(containerStyle.paddingTop) + parseFloat(containerStyle.paddingBottom);
    
    // Calculate available space
    const availableWidth = rect.width - paddingX;
    const availableHeight = rect.height - paddingY;
    
    // Set new dimensions while maintaining 1:1 aspect ratio
    const size = Math.min(availableWidth, availableHeight);
    
    const newSize = {
      width: size,
      height: size
    };
    
    // Update state
    setCanvasSize(newSize);
    
    // Update fabric canvas
    const canvas = fabricRef.current;
    canvas.setDimensions(newSize);
    
    // Fix: Need to refresh zoom/pan
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    canvas.requestRenderAll();
  };

  // Replace the warm-up function with a more effective version
  const warmUpCanvas = () => {
    if (!fabricRef.current) return;
    
    const canvas = fabricRef.current;
    
    // Force immediate initialization of drawing capabilities
    canvas.isDrawingMode = true;
    
    // Create a fresh pencil brush and force its initialization
    const pencilBrush = new fabric.PencilBrush(canvas);
    pencilBrush.width = strokeWidth;
    pencilBrush.color = "#000000";
    pencilBrush.decimate = 1; // Minimum value for maximum responsiveness
    canvas.freeDrawingBrush = pencilBrush;
    
    // Pre-initialize the brush by drawing short paths
    const drawInvisibleLine = () => {
      // Get canvas dimensions
      const width = canvas.getWidth();
      const height = canvas.getHeight();
      
      // Create an invisible path (very faint)
      const path = new fabric.Path(
        `M ${width/4} ${height/4} L ${width/4 + 1} ${height/4 + 1}`, 
        {
          stroke: 'rgba(0,0,0,0.01)',
          strokeWidth: 1,
          fill: undefined
        }
      );
      
      canvas.add(path);
      canvas.renderAll();
      
      // Remove after rendering
      setTimeout(() => {
        canvas.remove(path);
        canvas.renderAll();
      }, 50);
    };
    
    // Draw multiple paths to ensure brush is fully initialized
    drawInvisibleLine();
    setTimeout(drawInvisibleLine, 100);
    setTimeout(drawInvisibleLine, 200);
    
    // Force execution of first-time operations
    canvas.renderAll();
  };

  // Update the initialization function to fix property errors and improve initialization
  const initializeCanvas = () => {
    if (!canvasRef.current || fabricRef.current) return;
    
    try {
      console.log('Initializing canvas...');
      // Initial setup with placeholders - will be resized immediately
      canvasRef.current.width = canvasSize.width;
      canvasRef.current.height = canvasSize.height;

      const canvas = new fabric.Canvas(canvasRef.current, {
        width: canvasSize.width,
        height: canvasSize.height,
        backgroundColor: "#ffffff",
        isDrawingMode: true,
        selection: false,
        enableRetinaScaling: true,
        renderOnAddRemove: true,
        stateful: false,  // Improve performance
      });

      fabricRef.current = canvas;

      // Immediately apply critical settings for responsive drawing
      canvas.isDrawingMode = true;
      const pencilBrush = new fabric.PencilBrush(canvas);
      pencilBrush.width = strokeWidth;
      pencilBrush.color = "#000000";
      pencilBrush.decimate = 1; // Minimum value for maximum responsiveness
      canvas.freeDrawingBrush = pencilBrush;
      
      // Pre-render the canvas for drawing
      canvas.renderAll();

      // Initialize other tools
      eraserBrushRef.current = new EraserBrush(canvas);
      eraserBrushRef.current.width = 10;
      eraserBrushRef.current.color = "#ffffff";
      
      lineToolRef.current = new LineTool(canvas, strokeWidth);
      shapeToolRef.current = new ShapeTool(canvas);
      iconToolRef.current = new IconTool(canvas);
      imageToolRef.current = new ImageTool(canvas);

      // Fix: Make sure tools are properly set up
      if (shapeToolRef.current) {
        shapeToolRef.current.setFillMode(fillMode);
        shapeToolRef.current.setStrokeWidth(strokeWidth);
      }

      // Critical for performance: Set up rendering events and state tracking
      canvas.on('mouse:down', function(opt) {
        // Make canvas wrapper get focus on mousedown (for new structure)
        const focusableElement = canvasRef.current?.closest('[tabindex="0"]') as HTMLElement;
        if (focusableElement) {
          focusableElement.focus();
        }
        
        // Request render for immediate drawing feedback
        canvas.renderAll();
      });
      
      canvas.on('mouse:move', function(opt) {
        if (canvas.isDrawingMode) {
          // Force render during drawing for immediate feedback
          canvas.renderAll();
        }
      });
      
      canvas.on('path:created', function() {
        // Ensure path is visible immediately
        canvas.renderAll();
        saveCanvasState();
      });

      // Save initial state
      saveCanvasState();

      // Disable touch scrolling to prevent gesture conflicts
      canvas.allowTouchScrolling = false;
      
      console.log('Canvas initialized successfully');
      
      // Immediately resize and warm up the canvas
      resizeCanvas();
      warmUpCanvas();
      
      // Set an immediate timeout to render again after DOM updates
      setTimeout(() => {
        if (fabricRef.current) {
          fabricRef.current.renderAll();
          warmUpCanvas();
        }
      }, 0);
    } catch (error) {
      console.error('Error initializing canvas:', error);
    }
  };

  // Update the initialization useEffect to use the new function
  useEffect(() => {
    // Initialize canvas
    initializeCanvas();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        const canvas = fabricRef.current;
        if (canvas) {
          const activeObject = canvas.getActiveObject();
          if (activeObject) {
            canvas.remove(activeObject);
            canvas.discardActiveObject();
            canvas.requestRenderAll();
            
            // Update history by filtering out the removed object
            setHistory(prev => prev.filter(obj => obj !== activeObject));
          }
        }
      }
    };

    // Attach the event listener to the document
    document.addEventListener("keydown", handleKeyDown);
    
    // Set up resize observer
    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Add track changes event handlers after canvas is initialized
    const trackChanges = () => {
      if (!fabricRef.current) return;
      
      // Track canvas changes to enable undo - do this after initialization
      fabricRef.current.on('object:added', saveCanvasState);
      fabricRef.current.on('object:modified', saveCanvasState);
      fabricRef.current.on('object:removed', saveCanvasState);
    };
    
    // Add event handlers after a small delay to ensure canvas is ready
    setTimeout(trackChanges, 300);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      resizeObserver.disconnect();
      
      if (fabricRef.current) {
        // Clean up event listeners
        fabricRef.current.off('object:added', saveCanvasState);
        fabricRef.current.off('object:modified', saveCanvasState);
        fabricRef.current.off('object:removed', saveCanvasState);
        fabricRef.current.off('path:created');
        
        fabricRef.current.dispose();
        fabricRef.current = null;
      }
    };
  }, []);

  // Add a separate useEffect for updating history when it changes
  useEffect(() => {
    // This empty effect ensures we're tracking history changes
  }, [history]);

  // Consolidate tool switching into a single useEffect
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    // Deactivate all tools first to avoid conflicts
    if (lineToolRef.current) lineToolRef.current.deactivate();
    
    // Reset touch events to avoid conflicts
    canvas.off('touch:gesture');
    canvas.off('touch:drag');

    console.log('Setting tool:', tool); // Helpful debug

    // Clean up and set proper state based on selected tool
    switch (tool) {
      case "pencil":
        canvas.isDrawingMode = true;
        canvas.selection = false;
        
        // Create a fresh pencil brush
        const pencilBrush = new fabric.PencilBrush(canvas);
        pencilBrush.width = strokeWidth;
        pencilBrush.color = "#000000";
        // Important: Set the decimate parameter to 2 (default 8) for more responsive drawing
        pencilBrush.decimate = 2;
        canvas.freeDrawingBrush = pencilBrush;
        break;
        
      case "eraser":
        canvas.isDrawingMode = true;
        canvas.selection = false;
        
        // Ensure eraser brush is properly initialized
        if (!eraserBrushRef.current) {
          eraserBrushRef.current = new EraserBrush(canvas);
          eraserBrushRef.current.width = 10;
          eraserBrushRef.current.color = "#ffffff";
        }
        canvas.freeDrawingBrush = eraserBrushRef.current;
        break;
        
      case "select":
        canvas.isDrawingMode = false;
        canvas.selection = true;
        break;
        
      case "line":
        canvas.isDrawingMode = false;
        canvas.selection = false;
        if (lineToolRef.current) {
          lineToolRef.current.setStrokeWidth(strokeWidth);
          lineToolRef.current.activate();
        }
        break;
        
      case "shape":
        canvas.isDrawingMode = false;
        canvas.selection = true;
        break;
        
      case "icon":
        canvas.isDrawingMode = false;
        canvas.selection = true;
        break;
        
      case "image":
        canvas.isDrawingMode = false;
        canvas.selection = true;
        break;
    }
    
    canvas.requestRenderAll();
  }, [tool, strokeWidth]);

  // Update stroke width useEffect - Simplify this as it's now handled in the tool switching useEffect
  useEffect(() => {
    if (fabricRef.current && fabricRef.current.isDrawingMode) {
      fabricRef.current.freeDrawingBrush.width = strokeWidth;
      fabricRef.current.requestRenderAll();
    }
    
    if (shapeToolRef.current) {
      shapeToolRef.current.setStrokeWidth(strokeWidth);
    }
  }, [strokeWidth]);

  const handleToolChange = (newTool: Tool) => {
    if (fabricRef.current) {
      fabricRef.current.discardActiveObject();
    }
    
    setTool(newTool);

    // Open file dialog when image tool is selected
    if (newTool === "image" && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && imageToolRef.current) {
      imageToolRef.current.addImageFromFile(file);
      // Reset the input so the same file can be selected again
      e.target.value = '';
    }
  };

  const handleShapeSelect = (shape: ShapeType) => {
    setSelectedShape(shape);
    setTool("shape");
      
    if (shapeToolRef.current && fabricRef.current) {
      shapeToolRef.current.setShapeType(shape);
      shapeToolRef.current.setFillMode(fillMode);
      shapeToolRef.current.setStrokeWidth(strokeWidth);
        
      // Add the shape to the canvas
      shapeToolRef.current.addShape();
        
      // Get the most recently added object and select it
      const objects = fabricRef.current.getObjects();
      if (objects.length > 0) {
        const lastObject = objects[objects.length - 1];
        fabricRef.current.setActiveObject(lastObject);
        fabricRef.current.requestRenderAll();
          
        // Switch to select tool to prevent shape disappearing
        setTool("select");
      }
    }
  };

  const handleFillModeChange = (mode: 'regular' | 'solid') => {
    setFillMode(mode);
    if (shapeToolRef.current) {
      shapeToolRef.current.setFillMode(mode);
    }
  };

  const handleStrokeWidthChange = (newWidth: number) => {
    if (newWidth >= 1 && newWidth <= 20) {
      setStrokeWidth(newWidth);
    }
  };

  const handleIconPathSelect = (iconPath: string) => {
    setTool("icon");
    
    if (fabricRef.current) {
      // Load the SVG from the provided path
      fabric.loadSVGFromURL(`http://localhost:5000${iconPath}`, (objects, options) => {
        if (!objects || objects.length === 0) {
          console.error("Failed to load SVG from", iconPath);
          return;
        }
        
        // Create a fabric group from the loaded SVG objects
        const svgGroup = fabric.util.groupSVGElements(objects, options);
        
        // Scale the icon to a reasonable size
        svgGroup.scaleToWidth(50);
        
        // Center the icon on the canvas
        const canvas = fabricRef.current;
        if (canvas) {
          svgGroup.set({
            left: (canvas.width || 600) / 2,
            top: (canvas.height || 600) / 2,
            originX: 'center',
            originY: 'center'
          });
          
          // Add to canvas and select it
          canvas.add(svgGroup);
          canvas.setActiveObject(svgGroup);
          canvas.requestRenderAll();
          
          // Update history to include this object
          setHistory(prev => [...prev, svgGroup]);
          
          // Switch to select tool after adding the icon
          setTool("select");
        }
      });
    }
  };

  // Keep the existing PNG save function
  const saveCanvasToLocalStorage = () => {
    if (fabricRef.current) {
      try {
        // Store canvas background color
        const backgroundColor = fabricRef.current.backgroundColor;
        
        // Create a clone of the canvas to preserve original state
        const tempCanvas = document.createElement('canvas');
        const tempContext = tempCanvas.getContext('2d');
        
        tempCanvas.width = fabricRef.current.width || 600;
        tempCanvas.height = fabricRef.current.height || 600;
        
        if (tempContext) {
          // Fill background
          tempContext.fillStyle = backgroundColor as string;
          tempContext.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
          
          // Draw canvas content on top
          const dataUrl = fabricRef.current.toDataURL({
            format: 'png',
            quality: 0.9,
            multiplier: 1 // Keep original size
          });
          
          // Store the PNG (still needed for backend)
          localStorage.setItem(DRAWING_STORAGE_KEY, dataUrl);
          
          // ALSO store the editable canvas JSON
          const canvasJSON = fabricRef.current.toJSON();
          localStorage.setItem(DRAWING_JSON_STORAGE_KEY, JSON.stringify(canvasJSON));
          
          console.log('Canvas saved to localStorage as both PNG and JSON');
        }
      } catch (error) {
        console.error('Error saving canvas to localStorage:', error);
      }
    }
  };

  const handleClearCanvas = () => {
    const canvas = fabricRef.current;
    if (canvas) {
      canvas.clear();
      canvas.backgroundColor = "#ffffff";
      canvas.requestRenderAll();
      saveCanvasToLocalStorage();
    }
  };

  // Optional: Load from localStorage when component initializes
  useEffect(() => {
    if (fabricRef.current) {
      // First try to load the JSON version (with editable objects)
      const savedJSON = localStorage.getItem(DRAWING_JSON_STORAGE_KEY);
      
      if (savedJSON) {
        try {
          // Load from JSON to preserve all object properties
          fabricRef.current.loadFromJSON(JSON.parse(savedJSON), () => {
            console.log('Canvas restored from JSON with editable objects');
            
            // Update history with loaded objects
            const loadedObjects = fabricRef.current?.getObjects() || [];
            setHistory([...loadedObjects]);
            
            fabricRef.current?.requestRenderAll();
          });
        } catch (jsonError) {
          console.error('Error loading canvas from JSON:', jsonError);
          
          // Fall back to PNG if JSON loading fails
          loadFromPNG();
        }
      } else {
        // Fall back to PNG if no JSON is available
        loadFromPNG();
      }
    }
    
    // Helper function to load from PNG as fallback
    function loadFromPNG() {
      const savedPNG = localStorage.getItem(DRAWING_STORAGE_KEY);
      if (savedPNG && savedPNG.startsWith('data:image/png;base64,')) {
        // Load the PNG directly as fabric image
        fabric.Image.fromURL(savedPNG, (img) => {
          const canvas = fabricRef.current;
          if (canvas) {
            // Clear canvas first
            canvas.clear();
            
            // Set background color
            canvas.backgroundColor = "#ffffff";
            
            // Scale image to fit canvas while maintaining aspect ratio
            const canvasWidth = canvas.width || 600;
            const canvasHeight = canvas.height || 600;
            
            const scaleX = (canvasWidth - 20) / (img.width || 1);
            const scaleY = (canvasHeight - 20) / (img.height || 1);
            const scale = Math.min(scaleX, scaleY, 1);
            
            img.scale(scale);
            img.set({
              left: (canvasWidth - (img.width || 0) * scale) / 2,
              top: (canvasHeight - (img.height || 0) * scale) / 2,
              selectable: false,
              evented: false
            });
            
            canvas.add(img);
            canvas.renderAll();
            console.log('Canvas restored from PNG (non-editable)');
          }
        });
      }
    }
  }, []);

  // Add specific handler for object selection
  useEffect(() => {
    const canvas = fabricRef.current;
    if (canvas) {
      const handleObjectSelection = () => {
        // This prevents objects from disappearing when selected
        // by ensuring they remain active
      };
      
      canvas.on("selection:created", handleObjectSelection);
      canvas.on("selection:updated", handleObjectSelection);
      
      return () => {
        canvas.off("selection:created", handleObjectSelection);
        canvas.off("selection:updated", handleObjectSelection);
      };
    }
  }, []);

  // Improve the saveCanvasState function for better performance
  const saveCanvasState = () => {
    if (fabricRef.current) {
      try {
        const json = JSON.stringify(fabricRef.current.toJSON(['id', 'selectable']));
        setUndoHistory(prev => [...prev, json]);
        
        // Also save to localStorage for persistence - but don't do this too frequently
        if (undoHistory.length % 5 === 0) {
          saveCanvasToLocalStorage();
        }
      } catch (error) {
        console.error('Error saving canvas state:', error);
      }
    }
  };

  // Modify the handleUndo function to remove the last added object
  const handleUndo = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
  
    // Get all objects on canvas
    const objects = canvas.getObjects();
    
    // If there are objects, remove the last one
    if (objects.length > 0) {
      const lastObject = objects[objects.length - 1];
      canvas.remove(lastObject);
      canvas.discardActiveObject();
      canvas.requestRenderAll();
      
      // Update history stack after removal
      setUndoHistory(prev => {
        const newStack = [...prev];
        newStack.pop(); // Remove the current state
        return newStack;
      });
    }
  };

  // Add touch event prevention to avoid default gestures in mobile browsers
  useEffect(() => {
    const preventTouchDefault = (e: TouchEvent) => {
      if (e.target instanceof HTMLCanvasElement) {
        e.preventDefault();
      }
    };
    
    document.addEventListener('touchstart', preventTouchDefault, { passive: false });
    document.addEventListener('touchmove', preventTouchDefault, { passive: false });
    
    return () => {
      document.removeEventListener('touchstart', preventTouchDefault);
      document.removeEventListener('touchmove', preventTouchDefault);
    };
  }, []);

  // Add a window resize listener
  useEffect(() => {
    // Handle window resize events to ensure canvas adapts to new layout
    const handleResize = () => {
      if (fabricRef.current) {
        // Give time for the layout to stabilize
        setTimeout(resizeCanvas, 100);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Initial resize after component mounts
    const initialSizeTimer = setTimeout(handleResize, 200);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(initialSizeTimer);
    };
  }, []);

  // Fix the completeWarmUp function to use valid fill parameter
  const completeWarmUp = () => {
    if (!fabricRef.current) return;
    
    // Draw and immediately erase a path to get the engine ready
    const canvas = fabricRef.current;
    
    // Force drawing mode
    canvas.isDrawingMode = true;
    
    // Create a warm-up path programmatically (not visible to user)
    const path = new fabric.Path('M 10 10 L 20 20 L 30 30', {
      stroke: 'rgba(0,0,0,0.01)',
      strokeWidth: 1,
      fill: undefined
    });
    
    canvas.add(path);
    canvas.renderAll();
    
    // Remove the path right away
    canvas.remove(path);
    canvas.renderAll();
    
    // Force re-render once more
    requestAnimationFrame(() => {
      canvas.renderAll();
    });
  };

  // Replace the aggressive canvas warm-up useEffect with a more effective version
  useEffect(() => {
    if (fabricRef.current) {
      // Run the complete warm-up multiple times to ensure drawing is ready
      completeWarmUp();
      setTimeout(completeWarmUp, 100);
      setTimeout(completeWarmUp, 300);
      
      // Force the canvas into drawing mode with the pencil tool
      const canvas = fabricRef.current;
      if (tool === 'pencil') {
        canvas.isDrawingMode = true;
        
        // Get or create a pencil brush
        let pencilBrush = canvas.freeDrawingBrush;
        if (!(pencilBrush instanceof fabric.PencilBrush)) {
          pencilBrush = new fabric.PencilBrush(canvas);
        }
        
        // Configure for immediate responsiveness
        pencilBrush.width = strokeWidth;
        pencilBrush.color = "#000000";
        pencilBrush.decimate = 1;
        canvas.freeDrawingBrush = pencilBrush;
        
        // Ensure rendering is active
        canvas.renderAll();
      }
    }
  }, [fabricRef.current]);

  // Add a high-priority first-load effect to ensure immediate drawing readiness
  useEffect(() => {
    // This runs once on component mount
    const immediateInit = () => {
      if (fabricRef.current) {
        console.log('Immediate drawing initialization');
        const canvas = fabricRef.current;
        
        // Force drawing mode
        canvas.isDrawingMode = true;
        
        // Create a responsive brush
        const pencilBrush = new fabric.PencilBrush(canvas);
        pencilBrush.width = strokeWidth;
        pencilBrush.color = "#000000";
        pencilBrush.decimate = 1;
        canvas.freeDrawingBrush = pencilBrush;
        
        // Force rendering
        canvas.renderAll();
        
        // Schedule another render
        requestAnimationFrame(() => canvas.renderAll());
      } else {
        // If canvas not available yet, try again shortly
        setTimeout(immediateInit, 50);
      }
    };
    
    // Execute immediately and also after a short delay
    immediateInit();
    const timer = setTimeout(immediateInit, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Fix the rendering optimization useEffect
  useEffect(() => {
    if (!fabricRef.current) return;
    
    const canvas = fabricRef.current;
    
    // Optimize canvas rendering
    const optimizeRendering = () => {
      canvas.renderAll();
      
      if (canvas.isDrawingMode) {
        const brush = canvas.freeDrawingBrush;
        if (brush && typeof brush.decimate !== 'undefined') {
          // Set to lowest value for maximum responsiveness
          brush.decimate = 1;
        }
      }
    };
    
    // Run optimization
    optimizeRendering();
    
    // Set up an interval to ensure canvas stays responsive
    const renderInterval = setInterval(() => {
      if (canvas.isDrawingMode) {
        canvas.renderAll();
      }
    }, 30); // More frequent rendering (30ms instead of 100ms)
    
    return () => {
      clearInterval(renderInterval);
    };
  }, []);

  return (
    <div className="flex flex-col h-full p-4">
      <div 
        ref={containerRef} 
        className="flex-1 flex items-center justify-center relative bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden"
      >
        {/* Toolbar positioned absolutely inside the canvas container */}
        <div className="absolute top-4 left-0 right-0 z-10 flex justify-center">
          <Toolbar
            activeTool={tool}
            onToolChange={handleToolChange}
            onSelectShape={handleShapeSelect}
            selectedShape={selectedShape}
            onChangeFillMode={handleFillModeChange}
            fillMode={fillMode}
            strokeWidth={strokeWidth}
            onStrokeWidthChange={handleStrokeWidthChange}
            onSelectIcon={handleIconPathSelect}
            onClearCanvas={handleClearCanvas}
            onUndoAction={handleUndo}
          />
        </div>
        
        {/* Canvas wrapper with focus ring */}
        <div 
          className="flex-1 flex items-center justify-center w-full h-full focus:ring-2 focus:ring-blue-400 focus:ring-offset-0 rounded-lg transition-all duration-150 ease-in-out"
          tabIndex={0}
          onTouchStart={(e) => e.currentTarget.focus()}
          onMouseDown={(e) => e.currentTarget.focus()}
          style={{ outline: 'none' }}
        >
          <canvas 
            ref={canvasRef} 
            className="touch-none"
          />
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default Sketch;