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
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 600 });

  // Selected shape and icon state
  const [selectedShape, setSelectedShape] = useState<ShapeType>(ShapeType.RECTANGLE);
  const [fillMode, setFillMode] = useState<'regular' | 'solid'>('regular');
  
  // Add stroke width state
  const [strokeWidth, setStrokeWidth] = useState<number>(2);

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

      // Set up initial pencil brush settings
      canvas.freeDrawingBrush.width = strokeWidth;
      canvas.freeDrawingBrush.color = "#000000";

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
    
    if (shapeToolRef.current) {
      shapeToolRef.current.setShapeType(shape);
      shapeToolRef.current.setFillMode(fillMode);
      shapeToolRef.current.setStrokeWidth(strokeWidth);
      // Add the shape directly to the center of the canvas
      shapeToolRef.current.addShape();
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
          
          // Switch to select tool after adding the icon
          setTool("select");
        }
      });
    }
  };

  const handleUndo = () => {
    const canvas = fabricRef.current;
    if (canvas && history.length > 0) {
      const lastObject = history.pop();
      if (lastObject) {
        canvas.remove(lastObject);
        canvas.requestRenderAll();
      }
      setHistory([...history]);
    }
  };

  const handleClearCanvas = () => {
    const canvas = fabricRef.current;
    if (canvas) {
      canvas.clear();
      canvas.backgroundColor = "#ffffff";
      canvas.requestRenderAll();
    }
  };

  const handleObjectAdded = (e: fabric.IEvent) => {
    setHistory([...history, e.target as fabric.Object]);
  };

  useEffect(() => {
    const canvas = fabricRef.current;
    if (canvas) {
      canvas.on("object:added", handleObjectAdded);
    }

    return () => {
      if (canvas) {
        canvas.off("object:added", handleObjectAdded);
      }
    };
  }, [history]);

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
        {/* Undo button - top left */}
        <button
          onClick={handleUndo}
          className="absolute top-6 left-6 bg-white hover:bg-gray-100 text-gray-800 font-medium py-1 px-3 border border-gray-300 rounded-md shadow-sm z-10 flex items-center gap-1 transition-colors"
          title="Undo last action"
        >
          <RotateLeft size={18}/>
          Undo
        </button>
        
        {/* Clear all button - top right */}
        <button
          onClick={handleClearCanvas}
          className="absolute top-6 right-6 bg-white hover:bg-gray-100 text-gray-800 font-medium py-1 px-3 border border-gray-300 rounded-md shadow-sm z-10 flex items-center gap-1 transition-colors"
          title="Clear canvas"
        >
          <Trash size={18}/>
          Clear
        </button>
        
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