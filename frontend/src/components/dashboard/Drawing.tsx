import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import {
  Pencil,
  MousePointer,
  Eraser,
  PenLineIcon,
  Square,
  Image,
} from "lucide-react";
import EraserBrush from "@/utils/drawing/EraserBrush";
import LineTool from "@/utils/drawing/LineTool";
import ShapeTool, { ShapeType } from "@/utils/drawing/ShapeTool";
import IconTool, { IconType } from "@/utils/drawing/IconTool";
import ImageTool from "@/utils/drawing/ImageTool";
import ShapeSelector from "./ShapeSelector";

type Tool = "pencil" | "select" | "eraser" | "line" | "shape" | "icon" | "image";

const Sketch: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const [tool, setTool] = useState<Tool>("pencil");
  const eraserBrushRef = useRef<any>(null);
  const lineToolRef = useRef<LineTool | null>(null);
  const shapeToolRef = useRef<ShapeTool | null>(null);
  const iconToolRef = useRef<IconTool | null>(null);
  const imageToolRef = useRef<ImageTool | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Selected shape and icon state
  const [selectedShape, setSelectedShape] = useState<ShapeType>(ShapeType.RECTANGLE);
  const [selectedIcon, setSelectedIcon] = useState<IconType>(IconType.STAR);
  const [showShapeOptions, setShowShapeOptions] = useState(false);
  const [showIconOptions, setShowIconOptions] = useState(false);
  const [fillMode, setFillMode] = useState<'regular' | 'solid'>('regular');
  
  // Add stroke width state
  const [strokeWidth, setStrokeWidth] = useState<number>(2);

  // Initialize canvas and tools
  useEffect(() => {
    if (canvasRef.current && !fabricRef.current) {
      canvasRef.current.width = 800;
      canvasRef.current.height = 600;

      const canvas = new fabric.Canvas(canvasRef.current, {
        width: 800,
        height: 600,
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
    }

    return () => {
      if (fabricRef.current) {
        fabricRef.current.dispose();
        fabricRef.current = null;
      }
    };
  }, []);

  // Update tools based on selected tool
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

  // Update stroke width when it changes
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

    // Hide option menus when changing tools
    setShowShapeOptions(false);
    setShowIconOptions(false);

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

  const handleIconSelect = (icon: IconType) => {
    setSelectedIcon(icon);
    setTool("icon");
    
    if (iconToolRef.current) {
      iconToolRef.current.setSelectedIcon(icon);
      // Add the icon directly to the center of the canvas
      iconToolRef.current.addIcon();
    }
    
    setShowIconOptions(false);
  };

  const handleStrokeWidthChange = (newWidth: number) => {
    if (newWidth >= 1 && newWidth <= 20) {
      setStrokeWidth(newWidth);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap gap-4 p-4 bg-white rounded-lg shadow-md items-center">
        {/* Basic tools */}
        <div className="flex gap-2">
          <button
            className={`p-2 rounded ${
              tool === "pencil" ? "bg-blue-500 text-white" : "bg-gray-100"
            }`}
            onClick={() => handleToolChange("pencil")}
          >
            <Pencil size={24} />
          </button>
          <button
            className={`p-2 rounded ${
              tool === "select" ? "bg-blue-500 text-white" : "bg-gray-100"
            }`}
            onClick={() => handleToolChange("select")}
          >
            <MousePointer size={24} />
          </button>
          <button
            className={`p-2 rounded ${
              tool === "eraser" ? "bg-blue-500 text-white" : "bg-gray-100"
            }`}
            onClick={() => handleToolChange("eraser")}
          >
            <Eraser size={24} />
          </button>

          {/* Line tool */}
          <button
            className={`p-2 rounded ${
              tool === "line" ? "bg-blue-500 text-white" : "bg-gray-100"
            }`}
            onClick={() => handleToolChange("line")}
          >
            <PenLineIcon size={24} />
          </button>

          {/* Shape tools */}
          <div className="relative">
            <button
              className={`p-2 rounded ${
                tool === "shape" ? "bg-blue-500 text-white" : "bg-gray-100"
              }`}
              onClick={() => setShowShapeOptions(!showShapeOptions)}
            >
              <Square size={24} />
            </button>

            {showShapeOptions && (
              <div className="absolute top-full left-0 mt-1 z-10">
                <ShapeSelector 
                  onSelectShape={handleShapeSelect} 
                  onChangeFillMode={handleFillModeChange}
                  fillMode={fillMode}
                />
              </div>
            )}
          </div>

          {/* Image tool */}
          <button
            className={`p-2 rounded ${
              tool === "image" ? "bg-blue-500 text-white" : "bg-gray-100"
            }`}
            onClick={() => handleToolChange("image")}
          >
            <Image size={24} />
          </button>
        </div>

        {/* Stroke width control */}
        <div className="flex items-center gap-2 ml-4 border-l pl-4">
          <span className="text-sm font-medium">Size:</span>
          <input
            type="range"
            min="1"
            max="20"
            value={strokeWidth}
            onChange={(e) => handleStrokeWidthChange(Number(e.target.value))}
            className="w-32"
          />
          <div className="ml-2 flex items-center">
            <div 
              className="bg-black rounded-full" 
              style={{ 
                width: `${Math.min(strokeWidth * 2, 24)}px`,
                height: `${Math.min(strokeWidth * 2, 24)}px`,
              }}
            />
          </div>
        </div>
      </div>

      <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
        <canvas ref={canvasRef} id="fabric-canvas" />
      </div>
    </div>
  );
};

export default Sketch;
