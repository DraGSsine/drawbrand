import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import EraserBrush from "@/utils/drawing/EraserBrush";
import LineTool from "@/utils/drawing/LineTool";
import ShapeTool, { ShapeType } from "@/utils/drawing/ShapeTool";
import IconTool, { IconType } from "@/utils/drawing/IconTool";
import ImageTool from "@/utils/drawing/ImageTool";
import Toolbar from "./ToolBar";

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

  // Initialize canvas and tools useEffect
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

  const handleStrokeWidthChange = (newWidth: number) => {
    if (newWidth >= 1 && newWidth <= 20) {
      setStrokeWidth(newWidth);
    }
  };

  const handleIconPathSelect = (iconPath: string) => {
    setTool("icon");
    setShowIconOptions(false);
    
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
            left: (canvas.width || 800) / 2,
            top: (canvas.height || 600) / 2,
            originX: 'center',
            originY: 'center'
          });
          
          // Add to canvas and select it
          canvas.add(svgGroup);
          canvas.setActiveObject(svgGroup);
          canvas.requestRenderAll();
        }
      });
    }
  };

  const toggleShapeOptions = () => {
    setShowShapeOptions(!showShapeOptions);
    setShowIconOptions(false);
  };

  const toggleIconOptions = () => {
    setShowIconOptions(!showIconOptions);
    setShowShapeOptions(false);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Hidden file input for image upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      {/* Toolbar */}
      <Toolbar
        activeTool={tool}
        onToolChange={handleToolChange}
        strokeWidth={strokeWidth}
        onStrokeWidthChange={handleStrokeWidthChange}
        showShapeOptions={showShapeOptions}
        toggleShapeOptions={toggleShapeOptions}
        onSelectShape={handleShapeSelect}
        onChangeFillMode={handleFillModeChange}
        fillMode={fillMode}
        showIconOptions={showIconOptions}
        toggleIconOptions={toggleIconOptions}
        onSelectIcon={handleIconPathSelect}
      />

      {/* Canvas */}
      <div className="animate-canvas-reveal">
        <canvas 
          width={500}
          height={500}
          ref={canvasRef} 
          id="fabric-canvas" 
          className="transition-all duration-300"
        />
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500 italic">
            Tip: Use the select tool to move and resize objects on the canvas.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sketch;