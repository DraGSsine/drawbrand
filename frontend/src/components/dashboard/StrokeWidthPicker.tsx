import React from 'react';
import { cn } from '@/lib/utils';

interface StrokeWidthPickerProps {
  width: number;
  onChange: (width: number) => void;
}

export function StrokeWidthPicker({ width, onChange }: StrokeWidthPickerProps) {
  // Define our 4 preset stroke width options
  const strokeOptions = [4, 6, 8, 10];

  return (
    <div className="absolute top-[60%] left-[130%]">
      <div className="flex flex-col items-center gap-4 rounded-lg bg-white/90 shadow-sm border border-gray-100 px-3 py-4">
        <span className="text-xs font-medium text-gray-700">Size</span>
        
        <div className="flex flex-col justify-center items-center gap-5">
          {strokeOptions.map((size) => (
            <div
              key={size}
              onClick={() => onChange(size)}
              className={cn(
                "cursor-pointer rounded-full transition-all duration-200",
                width === size ? "bg-primary" : "bg-zinc-400 hover:bg-zinc-500"
              )}
              style={{ 
                width: `${size * 2}px`,
                height: `${size * 2}px`,
              }}
              aria-label={`Set stroke width to ${size}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default StrokeWidthPicker;