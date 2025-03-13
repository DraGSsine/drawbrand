import React from 'react';

interface StrokeWidthControlProps {
  strokeWidth: number;
  onChange: (width: number) => void;
}

const StrokeWidthControl: React.FC<StrokeWidthControlProps> = ({
  strokeWidth,
  onChange
}) => {
  return (
    <div className="flex items-center gap-3 pl-2">
      <div className="flex h-7 items-center rounded-full bg-tool px-3">
        <span className="text-xs font-medium text-gray-600 mr-2">Size</span>
        <input
          type="range"
          min="1"
          max="20"
          value={strokeWidth}
          onChange={(e) => onChange(Number(e.target.value))}
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
  );
};

export default StrokeWidthControl;