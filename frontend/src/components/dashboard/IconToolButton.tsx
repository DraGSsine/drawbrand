import React from 'react';
import IconPicker from './IconPicker';

interface IconToolButtonProps {
  activeTool: string;
  showOptions: boolean;
  toggleOptions: () => void;
  onSelectIcon: (iconPath: string) => void;
}

const IconToolButton: React.FC<IconToolButtonProps> = ({
  activeTool,
  showOptions,
  toggleOptions,
  onSelectIcon
}) => {
  return (
    <div className="relative" style={{ zIndex: 100 }}>
      <button
        className={`tool-button ${activeTool === "icon" ? "active" : ""}`}
        onClick={toggleOptions}
        aria-label="Icon tool"
      >
        <img 
          src="/icons/duotone/star.svg" 
          alt="Icon"
          width={22}
          height={22}
          className={activeTool === "icon" ? "text-white" : "text-tool-text"} 
        />
        <span className="sr-only">Icon</span>
      </button>
      
      {showOptions && (
        <div className="absolute top-full left-0 mt-2 z-50 animate-shape-slide">
          <IconPicker onSelectIcon={onSelectIcon} />
        </div>
      )}
    </div>
  );
};

export default IconToolButton;