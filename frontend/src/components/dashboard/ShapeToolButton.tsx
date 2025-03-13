import React from 'react';
import { Square } from 'lucide-react';
import { ShapeType } from '@/utils/drawing/ShapeTool';
import ShapeSelector from './ShapeSelector';

interface ShapeToolButtonProps {
  activeTool: string;
  showOptions: boolean;
  toggleOptions: () => void;
  onSelectShape: (shape: ShapeType) => void;
  onChangeFillMode: (mode: 'regular' | 'solid') => void;
  fillMode: 'regular' | 'solid';
}

const ShapeToolButton: React.FC<ShapeToolButtonProps> = ({
  activeTool,
  showOptions,
  toggleOptions,
  onSelectShape,
  onChangeFillMode,
  fillMode
}) => {
  return (
    <div className="relative">
      <button
        className={`tool-button ${activeTool === "shape" ? "active" : ""}`}
        onClick={toggleOptions}
        aria-label="Shape tool"
      >
        <Square size={22} className="transition-transform duration-200" />
        <span className="sr-only">Shape</span>
      </button>

      {showOptions && (
        <div className="absolute top-full left-0 mt-2 z-10 animate-shape-slide">
          <ShapeSelector 
            onSelectShape={onSelectShape} 
            onChangeFillMode={onChangeFillMode}
            fillMode={fillMode}
          />
        </div>
      )}
    </div>
  );
};

export default ShapeToolButton;