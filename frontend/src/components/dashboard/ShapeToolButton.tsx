import React from 'react';
import { ShapeType } from '@/utils/drawing/ShapeTool';
import ShapeSelector from './ShapeSelector';
import Image from 'next/image'

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
       <Image src="/icons/square.svg" alt='square' width={40} height={40} />
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