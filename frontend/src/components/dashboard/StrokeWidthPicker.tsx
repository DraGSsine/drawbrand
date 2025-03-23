import React, { useState } from "react";
import { Slider } from "@/components/ui/slider";

interface StrokeWidthPickerProps {
  strokeWidth: number;
  onStrokeWidthChange: (width: number) => void;
}

const StrokeWidthPicker: React.FC<StrokeWidthPickerProps> = ({
  strokeWidth,
  onStrokeWidthChange,
}) => {
  // Preset width options
  const widthOptions = [1, 2, 4, 6, 8, 10];
  
  // Handle slider change
  const handleSliderChange = (values: number[]) => {
    onStrokeWidthChange(values[0]);
  };

  return (
    <div className="w-full space-y-4 p-3 w-[220px]">
      <h3 className="text-sm font-medium mb-2">Stroke Width</h3>
      
      {/* Slider for continuous adjustment */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">Thin</span>
          <span className="text-xs font-medium">{strokeWidth}px</span>
          <span className="text-xs text-gray-500">Thick</span>
        </div>
        <Slider
          defaultValue={[strokeWidth]}
          min={1}
          max={12}
          step={1}
          value={[strokeWidth]}
          onValueChange={handleSliderChange}
          className="w-full"
        />
      </div>
      
      {/* Preset width buttons */}
      <div className="flex items-center justify-between gap-2 mt-2">
        {widthOptions.map((width) => (
          <button
            key={width}
            type="button"
            onClick={() => onStrokeWidthChange(width)}
            className={`relative flex items-center justify-center p-1 h-8 w-8 rounded-md transition-all ${
              strokeWidth === width
                ? "bg-blue-100 ring-2 ring-blue-500"
                : "bg-gray-50 hover:bg-gray-100"
            }`}
          >
            <div
              className="bg-black rounded-full"
              style={{
                width: `${Math.min(width * 2, 16)}px`,
                height: `${Math.min(width * 2, 16)}px`,
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default StrokeWidthPicker;