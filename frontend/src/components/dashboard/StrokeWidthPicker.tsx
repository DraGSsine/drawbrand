import React, { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";

interface StrokeWidthPickerProps {
  strokeWidth: number;
  onStrokeWidthChange: (width: number) => void;
}

const StrokeWidthPicker: React.FC<StrokeWidthPickerProps> = ({
  strokeWidth,
  onStrokeWidthChange,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  
  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener for resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Preset width options
  const widthOptions = [1, 2, 4, 6, 8, 10];
  
  // Handle slider change
  const handleSliderChange = (values: number[]) => {
    onStrokeWidthChange(values[0]);
  };

  return (
    <div className={`w-full space-y-3 sm:space-y-4 p-2 sm:p-3 ${isMobile ? 'w-[180px]' : 'w-[220px]'}`}>
      <h3 className="text-xs sm:text-sm font-medium mb-1 sm:mb-2">Stroke Width</h3>
      
      {/* Slider for continuous adjustment */}
      <div className="space-y-1 sm:space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-[10px] sm:text-xs text-gray-500">Thin</span>
          <span className="text-[10px] sm:text-xs font-medium">{strokeWidth}px</span>
          <span className="text-[10px] sm:text-xs text-gray-500">Thick</span>
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
      <div className="flex items-center justify-between gap-1 sm:gap-2 mt-1 sm:mt-2">
        {widthOptions.map((width) => (
          <button
            key={width}
            type="button"
            onClick={() => onStrokeWidthChange(width)}
            className={`relative flex items-center justify-center p-0.5 sm:p-1 h-6 w-6 sm:h-8 sm:w-8 rounded-md transition-all ${
              strokeWidth === width
                ? "bg-blue-100 ring-2 ring-blue-600"
                : "bg-gray-50 hover:bg-gray-100"
            }`}
          >
            <div
              className="bg-black rounded-full"
              style={{
                width: `${Math.min(width * (isMobile ? 1.5 : 2), isMobile ? 12 : 16)}px`,
                height: `${Math.min(width * (isMobile ? 1.5 : 2), isMobile ? 12 : 16)}px`,
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default StrokeWidthPicker;