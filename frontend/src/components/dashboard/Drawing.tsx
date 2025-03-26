import React, { useEffect, useRef, useState, useCallback } from "react";
import { fabric } from "fabric";
import EraserBrush from "@/utils/drawing/EraserBrush";
import LineTool from "@/utils/drawing/LineTool";
import ShapeTool, { ShapeType } from "@/utils/drawing/ShapeTool";
import IconTool from "@/utils/drawing/IconTool";
import ImageTool from "@/utils/drawing/ImageTool";
import Toolbar from "./ToolBar";

type Tool = "pencil" | "select" | "eraser" | "line" | "shape" | "icon" | "image";
type FillMode = 'regular' | 'solid';

interface CanvasSize {
  width: number;
  height: number;
}

const Sketch: React.FC = (): React.ReactElement => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const [tool, setTool] = useState<Tool>("pencil");
  const eraserBrushRef = useRef<typeof EraserBrush | null>(null);
  const lineToolRef = useRef<LineTool | null>(null);
  const shapeToolRef = useRef<ShapeTool | null>(null);
  const iconToolRef = useRef<IconTool | null>(null);
  const imageToolRef = useRef<ImageTool | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [canvasSize, setCanvasSize] = useState<CanvasSize>({ width: 600, height: 600 });
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [selectedShape, setSelectedShape] = useState<ShapeType>(ShapeType.RECTANGLE);
  const [fillMode, setFillMode] = useState<FillMode>('regular');
  const [strokeWidth, setStrokeWidth] = useState<number>(2);
  
  // Used in handleIconPathSelect for tracking added objects
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [history, setHistory] = useState<fabric.Object[]>([]);

  // Add constants for both storage keys
  const DRAWING_STORAGE_KEY = 'logo-generator-canvas';
  const DRAWING_JSON_STORAGE_KEY = 'logo-generator-canvas-json';

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = (): void => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener for resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Resize canvas to fit container
  const resizeCanvas = useCallback((): void => {
    if (!containerRef.current || !fabricRef.current) return;
    
    // Get container dimensions
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    
    // Get the effective width and height considering padding
    const containerStyle = window.getComputedStyle(container);
    const paddingX = parseFloat(containerStyle.paddingLeft) + parseFloat(containerStyle.paddingRight);
    const paddingY = parseFloat(containerStyle.paddingTop) + parseFloat(containerStyle.paddingBottom);
    
    // Calculate available space - use full dimensions instead of forcing square
    const availableWidth = rect.width - paddingX;
    const availableHeight = rect.height - paddingY;
    
    // For mobile, ensure we don't create a canvas that's too tall
    const maxHeight = isMobile ? Math.min(availableHeight, window.innerHeight * 0.6) : availableHeight;
    
    const newSize: CanvasSize = {
      width: availableWidth,
      height: maxHeight
    };
    
    // Update state
    setCanvasSize(newSize);
    
    // Update fabric canvas
    const canvas = fabricRef.current;
    canvas.setDimensions(newSize);
    
    // Fix: Need to refresh zoom/pan
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    
    // Adjust rendering quality on mobile for better performance
    if (isMobile) {
      canvas.enableRetinaScaling = false;
    } else {
      canvas.enableRetinaScaling = true;
    }
    
    canvas.requestRenderAll();
  }, [isMobile]);

  // Add a debounced resize handler for smoother resizing
  const debouncedResize = useCallback((): void => {
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }
    
    resizeTimeoutRef.current = setTimeout(() => {
      resizeCanvas();
    }, 100); // 100ms debounce time
  }, [resizeCanvas]);

  // CRITICAL: Tool switching logic - controls canvas mode based on selected tool
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    // Deactivate all tools first to avoid conflicts
    if (lineToolRef.current) lineToolRef.current.deactivate();
    
    // Reset touch events to avoid conflicts
    canvas.off('touch:gesture');
    canvas.off('touch:drag');

    console.log('Setting tool:', tool);

    // Clean up and set proper state based on selected tool
    switch (tool) {
      case "pencil":
        canvas.isDrawingMode = true;
        canvas.selection = false;
        
        // Create a fresh pencil brush
        const pencilBrush = new fabric.PencilBrush(canvas);
        pencilBrush.width = strokeWidth;
        pencilBrush.color = "#000000";
        // Important: Decimate parameter for more responsive drawing
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

  // Update stroke width useEffect for active tools
  useEffect(() => {
    if (fabricRef.current && fabricRef.current.isDrawingMode) {
      fabricRef.current.freeDrawingBrush.width = strokeWidth;
      fabricRef.current.requestRenderAll();
    }
    
    if (shapeToolRef.current) {
      shapeToolRef.current.setStrokeWidth(strokeWidth);
    }
  }, [strokeWidth]);

  // Helper function to load from PNG as fallback
  const loadFromPNG = useCallback((): boolean => {
    try {
      const savedPNG = localStorage.getItem(DRAWING_STORAGE_KEY);
      if (savedPNG && savedPNG.startsWith('data:image/png;base64,') && savedPNG.length > 100) {
        console.log('Found PNG data, loading as fallback...');
        
        // Load the PNG directly as fabric image
        fabric.Image.fromURL(savedPNG, (img) => {
          try {
            const canvas = fabricRef.current;
            if (canvas) {
              // Clear canvas first
              canvas.clear();
              
              // Set background color
              canvas.backgroundColor = "#ffffff";
              
              // Scale image to fit canvas
              const canvasWidth = canvas.width || 600;
              const canvasHeight = canvas.height || 600;
              
              // Check if the image has valid dimensions
              if (img.width && img.height && img.width > 10 && img.height > 10) {
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
                return true;
              } else {
                console.error("Loaded image has invalid dimensions:", img.width, img.height);
              }
            }
          } catch (imgError) {
            console.error("Error adding PNG to canvas:", imgError);
          }
        });
        return true; // Successfully loading
      }
      console.log('No saved drawing found in localStorage');
      return false; // Nothing to load
    } catch (pngError) {
      console.error("Error in loadFromPNG:", pngError);
      return false;
    }
  }, []);

  // Improve the saveCanvasState function for better persistence
  const saveCanvasState = useCallback((): void => {
    if (fabricRef.current) {
      try {
        // Create a JSON representation with all necessary properties
        const json = JSON.stringify(fabricRef.current.toJSON([
          'id', 
          'selectable',
          'hasControls',
          'hasBorders',
          'lockMovementX',
          'lockMovementY',
          'lockRotation',
          'lockScalingX',
          'lockScalingY',
          'lockUniScaling',
          'evented'
        ]));
        
        // ALWAYS save to localStorage immediately - remove throttling
        localStorage.setItem(DRAWING_JSON_STORAGE_KEY, json);
        
        // Also save as PNG for compatibility
        const dataUrl = fabricRef.current.toDataURL({
          format: 'png',
          quality: 0.9,
          multiplier: 1
        });
        localStorage.setItem(DRAWING_STORAGE_KEY, dataUrl);
          
        console.log('Canvas saved to localStorage - both JSON and PNG');
        
        // Update history with current objects
        const currentObjects = fabricRef.current.getObjects();
        setHistory(currentObjects);
        
      } catch (error) {
        console.error('Error saving canvas state:', error);
      }
    }
  }, []);

  // Improve the loadSavedCanvas function to be more robust
  const loadSavedCanvas = useCallback((): boolean => {
    if (!fabricRef.current) return false;
    
    console.log("Loading saved drawing from localStorage...");
    
    try {
      // First try to load the JSON version (with editable objects)
      const savedJSON = localStorage.getItem(DRAWING_JSON_STORAGE_KEY);
      
      if (savedJSON && savedJSON.length > 10) { // Basic validation to ensure we have real JSON data
        console.log("Found saved JSON data:", savedJSON.substring(0, 50) + "...");
        try {
          // Load from JSON to preserve all object properties
          fabricRef.current.loadFromJSON(JSON.parse(savedJSON), () => {
            console.log('Canvas restored from JSON with editable objects');
            
            // Update history with loaded objects
            const loadedObjects = fabricRef.current?.getObjects() || [];
            console.log(`Loaded ${loadedObjects.length} objects from saved data`);
            
            setHistory(loadedObjects);
            
            fabricRef.current?.renderAll();
          });
          return true; // Successfully loaded
        } catch (jsonError) {
          console.error('Error loading canvas from JSON:', jsonError);
          
          // Fall back to PNG if JSON loading fails
          return loadFromPNG();
        }
      } else {
        console.log("No valid JSON data found, trying PNG...");
        // Fall back to PNG if no JSON is available
        return loadFromPNG();
      }
    } catch (error) {
      console.error("Error in loadSavedCanvas:", error);
      return false;
    }
  }, [loadFromPNG]);

  // Replace the warm-up function with a more effective version
  const warmUpCanvas = useCallback((): void => {
    if (!fabricRef.current) return;
    
    const canvas = fabricRef.current;
    
    // Force immediate initialization of drawing capabilities
    canvas.isDrawingMode = true;
    
    // Create a fresh pencil brush and force its initialization
    const pencilBrush = new fabric.PencilBrush(canvas);
    pencilBrush.width = strokeWidth;
    pencilBrush.color = "#000000";
    pencilBrush.decimate = isMobile ? 2 : 1; // Higher value for mobile for better performance
    canvas.freeDrawingBrush = pencilBrush;
    
    // Pre-initialize the brush by drawing short paths
    const drawInvisibleLine = (): void => {
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
  }, [isMobile, strokeWidth]);

  // Update the initialization function to fix property errors and improve initialization
  const initializeCanvas = useCallback((): void => {
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
        enableRetinaScaling: !isMobile, // Disable on mobile for better performance
        renderOnAddRemove: true,
        stateful: true,  // Changed to true for better state persistence
      });

      fabricRef.current = canvas;

      // Immediately apply critical settings for responsive drawing
      canvas.isDrawingMode = true;
      const pencilBrush = new fabric.PencilBrush(canvas);
      pencilBrush.width = strokeWidth;
      pencilBrush.color = "#000000";
      pencilBrush.decimate = isMobile ? 2 : 1; // Higher value for mobile for better performance
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
      canvas.on('mouse:down', function() {
        // Make canvas wrapper get focus on mousedown (for new structure)
        const focusableElement = canvasRef.current?.closest('[tabindex="0"]') as HTMLElement;
        if (focusableElement) {
          focusableElement.focus();
        }
        
        // Request render for immediate drawing feedback
        canvas.renderAll();
      });
      
      canvas.on('mouse:move', function() {
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

      // Setup touch events for mobile
      canvas.on('touch:gesture', function(opt: fabric.IEvent) {
        if ((opt.e as TouchEvent).touches && (opt.e as TouchEvent).touches.length > 1) {
          // Prevent default to avoid page scaling during touch drawing
          opt.e.preventDefault();
        }
      });

      // Setup complete - now check for saved canvas data
      console.log('Canvas initialized successfully, loading saved data...');
      
      // First resize the canvas
      resizeCanvas();
      
      // Now attempt to load saved canvas data
      const loadSuccess = loadSavedCanvas();
      
      if (!loadSuccess) {
        // Only if there was no saved data, save initial state
        console.log('No saved data found, saving initial blank state');
        saveCanvasState();
      }
      
      // Warm up canvas after loading (or not loading) data
      warmUpCanvas();
      
      // Set an immediate timeout to render again after DOM updates
      setTimeout(() => {
        if (fabricRef.current) {
          fabricRef.current.renderAll();
        }
      }, 0);
    } catch (error) {
      console.error('Error initializing canvas:', error);
    }
  }, [canvasSize.height, canvasSize.width, fillMode, isMobile, loadSavedCanvas, resizeCanvas, saveCanvasState, strokeWidth, warmUpCanvas]);

  // Update the initialization useEffect to use the new function
  useEffect(() => {
    // Initialize canvas
    initializeCanvas();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete") {
        const canvas = fabricRef.current;
        if (canvas) {
          const activeObject = canvas.getActiveObject();
          if (activeObject) {
            canvas.remove(activeObject);
            canvas.discardActiveObject();
            canvas.requestRenderAll();
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
  }, [initializeCanvas, resizeCanvas, saveCanvasState]);

  // Modify the window resize event listener to use debounced resize
  useEffect(() => {
    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [debouncedResize]);

  // Restore the handleClearCanvas function
  const handleClearCanvas = (): void => {
    const canvas = fabricRef.current;
    if (canvas) {
      canvas.clear();
      canvas.backgroundColor = "#ffffff";
      canvas.renderAll();
      saveCanvasState(); // Use the updated saveCanvasState
    }
  };

  // Restore the handleUndo function
  const handleUndo = (): void => {
    const canvas = fabricRef.current;
    if (!canvas) return;
  
    // Get all objects on canvas
    const objects = canvas.getObjects();
    
    // If there are objects, remove the last one
    if (objects.length > 0) {
      const lastObject = objects[objects.length - 1];
      canvas.remove(lastObject);
      canvas.discardActiveObject();
      canvas.renderAll();
      
      // Make sure to save the new state
      saveCanvasState();
    }
  };

  // Add event handlers for all drawing activities
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    
    // Save after any path is created (when drawing)
    const handlePathCreated = (): void => {
      console.log("Path created - saving canvas state");
      saveCanvasState();
    };
    
    // Save after mouse up (when finishing a drawing stroke)
    const handleMouseUp = (): void => {
      if (canvas.isDrawingMode) {
        console.log("Mouse up during drawing - saving canvas state");
        saveCanvasState();
      }
    };
    
    // Save after object modifications (resize, rotate, etc)
    const handleObjectModified = (): void => {
      console.log("Object modified - saving canvas state");
      saveCanvasState();
    };

    // Save after object added (shapes, icons, images)
    const handleObjectAdded = (e: fabric.IEvent): void => {
      // Don't save for paths as they trigger path:created
      if (e.target && !(e.target instanceof fabric.Path)) {
        console.log("Object added - saving canvas state");
        saveCanvasState();
      }
    };
    
    // Save after object removed
    const handleObjectRemoved = (): void => {
      console.log("Object removed - saving canvas state");
      saveCanvasState();
    };
    
    canvas.on('path:created', handlePathCreated);
    canvas.on('mouse:up', handleMouseUp);
    canvas.on('object:modified', handleObjectModified);
    canvas.on('object:added', handleObjectAdded);
    canvas.on('object:removed', handleObjectRemoved);
    
    return () => {
      canvas.off('path:created', handlePathCreated);
      canvas.off('mouse:up', handleMouseUp);
      canvas.off('object:modified', handleObjectModified);
      canvas.off('object:added', handleObjectAdded);
      canvas.off('object:removed', handleObjectRemoved);
    };
  }, [saveCanvasState]);
  
  // Add forced save function for debugging (removed forceLoadCanvas as it's unused)
  const forceSaveCanvas = (): boolean => {
    console.log("Forcing canvas save to localStorage...");
    if (fabricRef.current) {
      // Create a JSON representation with all necessary properties
      const json = JSON.stringify(fabricRef.current.toJSON([
        'id', 'selectable', 'hasControls', 'hasBorders',
        'lockMovementX', 'lockMovementY', 'lockRotation',
        'lockScalingX', 'lockScalingY', 'lockUniScaling', 'evented'
      ]));
      
      // Save directly to localStorage
      localStorage.setItem(DRAWING_JSON_STORAGE_KEY, json);
      
      // Also save as PNG for compatibility
      const dataUrl = fabricRef.current.toDataURL({
        format: 'png',
        quality: 0.9,
        multiplier: 1
      });
      localStorage.setItem(DRAWING_STORAGE_KEY, dataUrl);
      
      console.log('Emergency canvas save completed');
      return true;
    }
    return false;
  };

  const handleToolChange = (newTool: Tool): void => {
    if (fabricRef.current) {
      fabricRef.current.discardActiveObject();
    }
    
    setTool(newTool);

    // Open file dialog when image tool is selected
    if (newTool === "image" && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file && imageToolRef.current) {
      imageToolRef.current.addImageFromFile(file);
      // Reset the input so the same file can be selected again
      e.target.value = '';
    }
  };

  const handleShapeSelect = (shape: ShapeType): void => {
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

  const handleFillModeChange = (mode: FillMode): void => {
    setFillMode(mode);
    if (shapeToolRef.current) {
      shapeToolRef.current.setFillMode(mode);
    }
  };

  const handleStrokeWidthChange = (newWidth: number): void => {
    if (newWidth >= 1 && newWidth <= 20) {
      setStrokeWidth(newWidth);
    }
  };

  const handleIconPathSelect = (iconPath: string): void => {
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
          setHistory((prev: fabric.Object[]) => [...prev, svgGroup]);
          
          // Switch to select tool after adding the icon
          setTool("select");
        }
      });
    }
  };

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
        
        {/* Small debug save button */}
        <div className="absolute bottom-2 right-2 z-10">
          <button 
            onClick={forceSaveCanvas}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs py-1 px-2 rounded"
            title="Force Save to LocalStorage"
          >
            Save
          </button>
        </div>
        
        {/* Canvas wrapper with focus ring */}
        <div 
          className="flex-1 flex items-center justify-center w-full h-full focus:ring-2 focus:ring-blue-400 focus:ring-offset-0 rounded-lg transition-all duration-150 ease-in-out"
          tabIndex={0}
          onTouchStart={(e: React.TouchEvent<HTMLDivElement>) => e.currentTarget.focus()}
          onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => e.currentTarget.focus()}
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