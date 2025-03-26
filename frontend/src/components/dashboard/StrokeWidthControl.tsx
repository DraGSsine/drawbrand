import React from 'react';
import StrokeWidthPicker from './StrokeWidthPicker';

interface StrokeWidthControlProps {
  value: number;
  onChange: (width: number) => void;
}

const StrokeWidthControl: React.FC<StrokeWidthControlProps> = ({ 
  value, 
  onChange 
}) => {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-medium text-gray-700">Stroke Width</h3>
      <StrokeWidthPicker
        strokeWidth={value}
        onStrokeWidthChange={onChange}
      />
    </div>
  );
};

export default StrokeWidthControl;