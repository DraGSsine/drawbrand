import React from 'react';
import { Pencil, MousePointer, Eraser, PenLineIcon, Image } from 'lucide-react';
import { ShapeType } from '@/utils/drawing/ShapeTool';
import IconPicker from './IconPicker';
import ShapeToolButton from './ShapeToolButton';
import ShapeSelector from './ShapeSelector'; // Import the React component for shape selection

// Import the Tool type from a shared location
type Tool = "pencil" | "select" | "eraser" | "line" | "shape" | "icon" | "image";

interface ToolbarProps {
  activeTool: Tool; // Use the Tool type instead of string
  onToolChange: (tool: Tool) => void; // Use the Tool type instead of string
  strokeWidth: number;
  onStrokeWidthChange: (width: number) => void;
  showShapeOptions: boolean;
  toggleShapeOptions: () => void;
  onSelectShape: (shape: ShapeType) => void;
  onChangeFillMode: (mode: 'regular' | 'solid') => void;
  fillMode: 'regular' | 'solid';
  showIconOptions: boolean;
  toggleIconOptions: () => void;
  onSelectIcon: (iconPath: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  activeTool,
  onToolChange,
  strokeWidth,
  onStrokeWidthChange,
  showShapeOptions,
  toggleShapeOptions,
  onSelectShape,
  onChangeFillMode,
  fillMode,
  showIconOptions,
  toggleIconOptions,
  onSelectIcon
}) => {
  return (
    <div className="mb-6 w-full max-w-3xl animate-toolbar-slide absolute z-50 ">
      <div className="bg-tool-surface rounded-xl shadow-toolbar backdrop-blur-sm p-4 flex flex-wrap items-center justify-center md:justify-between gap-3">
        {/* Basic tools */}
        <div className="flex items-center gap-2">
          <button
            className={`tool-button ${activeTool === "pencil" ? "active" : ""}`}
            onClick={() => onToolChange("pencil")}
            aria-label="Pencil tool"
          >
            <Pencil size={22} className={activeTool === "pencil" ? "text-white" : "text-tool-text"} />
            <span className="sr-only">Pencil</span>
          </button>
          
          <button
            className={`tool-button ${activeTool === "select" ? "active" : ""}`}
            onClick={() => onToolChange("select")}
            aria-label="Select tool"
          >
            <MousePointer size={22} className={activeTool === "select" ? "text-white" : "text-tool-text"} />
            <span className="sr-only">Select</span>
          </button>
          
          <button
            className={`tool-button ${activeTool === "eraser" ? "active" : ""}`}
            onClick={() => onToolChange("eraser")}
            aria-label="Eraser tool"
          >
            <Eraser size={22} className={activeTool === "eraser" ? "text-white" : "text-tool-text"} />
            <span className="sr-only">Eraser</span>
          </button>
          
          <div className="w-px h-8 bg-tool-border mx-1"></div>
          
          <button
            className={`tool-button ${activeTool === "line" ? "active" : ""}`}
            onClick={() => onToolChange("line")}
            aria-label="Line tool"
          >
            <PenLineIcon size={22} className={activeTool === "line" ? "text-white" : "text-tool-text"} />
            <span className="sr-only">Line</span>
          </button>

          {/* Shape tool with dropdown */}
          <div className="relative">
            <button
              className={`tool-button ${activeTool === "shape" ? "active" : ""}`}
              onClick={toggleShapeOptions}
              aria-label="Shape tool"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={activeTool === "shape" ? "text-white" : "text-tool-text"}>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              </svg>
              <span className="sr-only">Shape</span>
            </button>
              <div className="absolute top-full left-0 mt-2 animate-shape-slide">
                <ShapeSelector onSelectShape={onSelectShape} onChangeFillMode={onChangeFillMode} fillMode={fillMode} />
              </div>
              </div>
          {/* Icon tool with dropdown */}
          <div className="relative" style={{ zIndex: 100 }}>
            <button
              className={`tool-button ${activeTool === "icon" ? "active" : ""}`}
              onClick={toggleIconOptions}
              aria-label="Icon tool"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={activeTool === "icon" ? "text-white" : "text-tool-text"}>
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              <span className="sr-only">Icon</span>
            </button>
            
            {showIconOptions && (
              <div className="absolute top-full left-0 mt-2 animate-shape-slide">
                <IconPicker/>
              </div>
            )}
          </div>

          <button
            className={`tool-button ${activeTool === "image" ? "active" : ""}`}
            onClick={() => onToolChange("image")}
            aria-label="Image tool"
          >
            <Image size={22} className={activeTool === "image" ? "text-white" : "text-tool-text"} />
            <span className="sr-only">Image</span>
          </button>
        </div>

        {/* Stroke width control */}
        <div className="flex items-center gap-3 pl-2">
          <div className="flex h-7 items-center rounded-full bg-tool px-3">
            <span className="text-xs font-medium text-gray-600 mr-2">Size</span>
            <input
              type="range"
              min="1"
              max="20"
              value={strokeWidth}
              onChange={(e) => onStrokeWidthChange(Number(e.target.value))}
              className="w-24 md:w-32"
              aria-label="Stroke width"
            />
          </div>
          <div className="flex items-center justify-center w-7 h-7">
            <div 
              className="bg-tool-text rounded-full" 
              style={{ 
                width: `${Math.min(strokeWidth * 0.8, 14)}px`,
                height: `${Math.min(strokeWidth * 0.8, 14)}px`,
              }}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;