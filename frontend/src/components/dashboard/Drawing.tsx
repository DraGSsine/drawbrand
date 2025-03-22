import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import { fabric } from "fabric";
import EraserBrush from "@/utils/drawing/EraserBrush";
import LineTool from "@/utils/drawing/LineTool";
import ShapeTool, { ShapeType } from "@/utils/drawing/ShapeTool";
import IconTool from "@/utils/drawing/IconTool";
import ImageTool from "@/utils/drawing/ImageTool";
import Toolbar from "./ToolBar";
import { RotateLeft, Trash } from "../../../public/icons/SvgIcons";

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
    
    // Set new dimensions while maintaining aspect ratio if needed
    // For now, let's make it fill the container
    const newSize = {
      width: Math.max(availableWidth, 300),
      height: Math.max(availableHeight, 300)
    };
    
    // Update state
    setCanvasSize(newSize);
    
    // Update fabric canvas
    const canvas = fabricRef.current;
    canvas.setDimensions(newSize);
    canvas.requestRenderAll();
  };

  // Initialize canvas and tools useEffect
  useEffect(() => {
    if (canvasRef.current && !fabricRef.current) {
      // Initial setup with placeholders - will be resized immediately
      canvasRef.current.width = canvasSize.width;
      canvasRef.current.height = canvasSize.height;

      const canvas = new fabric.Canvas(canvasRef.current, {
        width: canvasSize.width,
        height: canvasSize.height,
        backgroundColor: "#ffffff",
        isDrawingMode: true,
      });

      fabricRef.current = canvas;

      // Initialize tools
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

      // Set up initial pencil brush settings
      canvas.freeDrawingBrush.width = strokeWidth;
      canvas.freeDrawingBrush.color = "#000000";

      // Save initial state
      saveCanvasState();

      // Track canvas changes to enable undo
      canvas.on('object:added', saveCanvasState);
      canvas.on('object:modified', saveCanvasState);
      canvas.on('object:removed', saveCanvasState);
      canvas.on('path:created', saveCanvasState);

      // Add event to focus canvas on object selection
      canvas.on('mouse:down', function() {
        // This ensures canvas wrapper gets focus
        canvasRef.current?.parentElement?.focus();
      });
      
      // Perform initial resize after canvas is set up
      setTimeout(resizeCanvas, 0);
    }

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
    
    // Set up window resize listener
    window.addEventListener('resize', resizeCanvas);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener('resize', resizeCanvas);
      resizeObserver.disconnect();
      
      if (fabricRef.current) {
        fabricRef.current.dispose();
        fabricRef.current = null;
      }
    };
  }, []);

  // Add a separate useEffect for updating history when it changes
  useEffect(() => {
    // This empty effect ensures we're tracking history changes
  }, [history]);

  // Update tools based on selected tool useEffect
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    // Deactivate all tools first
    if (lineToolRef.current) lineToolRef.current.deactivate();
    // No need to deactivate shape and icon tools since they don't use events anymore

    switch (tool) {
      case "pencil":
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        canvas.freeDrawingBrush.width = strokeWidth;
        canvas.freeDrawingBrush.color = "#000000";
        break;
      case "eraser":
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush = eraserBrushRef.current;
        break;
      case "select":
        canvas.isDrawingMode = false;
        canvas.selection = true;
        break;
      case "line":
        canvas.isDrawingMode = false;
        if (lineToolRef.current) lineToolRef.current.activate();
        break;
      case "shape":
        canvas.isDrawingMode = false;
        // Shape tool doesn't need canvas events anymore
        break;
      case "icon":
        canvas.isDrawingMode = false;
        // Icon tool doesn't need canvas events anymore
        break;
      case "image":
        canvas.isDrawingMode = false;
        // Image tool is activated by file input
        break;
    }
  }, [tool]);

  // Update stroke width useEffect
  useEffect(() => {
    if (fabricRef.current && fabricRef.current.isDrawingMode) {
      fabricRef.current.freeDrawingBrush.width = strokeWidth;
    }
    
    if (lineToolRef.current) {
      lineToolRef.current.setStrokeWidth(strokeWidth);
    }
  }, [strokeWidth]);

  const handleToolChange = (newTool: Tool) => {
    setTool(newTool);

    if (fabricRef.current) {
      fabricRef.current.discardActiveObject();
      fabricRef.current.requestRenderAll();
    }

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

  // Add this function to save canvas state
  const saveCanvasState = () => {
    if (fabricRef.current) {
      const json = JSON.stringify(fabricRef.current.toJSON());
      setUndoHistory(prev => [...prev, json]);
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

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      {/* Hidden file input for image upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      {/* Canvas with toolbar - make it responsive */}
      <div 
        ref={containerRef}
        className="animate-canvas-reveal relative w-full h-full flex items-center justify-center px-4"
      >
        {/* Buttons - top right */}
        <div className="absolute top-6 right-6 flex gap-2 z-10">
          {/* Undo button */}
          <button
            onClick={handleUndo}
            disabled={undoHistory.length <= 1}
            className={`bg-white hover:bg-gray-100 text-gray-800 font-medium py-1 px-3 border border-gray-300 rounded-md shadow-sm flex items-center gap-1 transition-colors ${undoHistory.length <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="Undo"
          >
            <RotateLeft className="h-6 w-6"/>
            Undo
          </button>
          
          {/* Clear button */}
          <button
            onClick={handleClearCanvas}
            className="bg-white hover:bg-gray-100 text-gray-800 font-medium py-1 px-3 border border-gray-300 rounded-md shadow-sm flex items-center gap-1 transition-colors"
            title="Clear canvas"
          >
            <Trash className="h-6 w-6"/>
            Clear
          </button>
        </div>
        
        <canvas 
          ref={canvasRef} 
          id="fabric-canvas"
          tabIndex={0}  // Make canvas focusable
          className="transition-all duration-300 rounded-2xl border object-contain"
          style={{
            width: `${canvasSize.width}px`,
            height: `${canvasSize.height}px`,
          }}
        />
        
        {/* Toolbar positioned inside the canvas */}
        <Toolbar
          activeTool={tool}
          onToolChange={handleToolChange}
          strokeWidth={strokeWidth}
          onStrokeWidthChange={handleStrokeWidthChange}
          onSelectShape={handleShapeSelect}
          onChangeFillMode={handleFillModeChange}
          fillMode={fillMode}
          onSelectIcon={handleIconPathSelect}
        />
      </div>
    </div>
  );
};

export default Sketch;