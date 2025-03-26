import React, { useState, useEffect } from 'react';
import IconPicker from './IconPicker';
import Image from 'next/image';

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

  return (
    <div className="relative" style={{ zIndex: 100 }}>
      <button
        className={`tool-button ${activeTool === "icon" ? "active" : ""}`}
        onClick={toggleOptions}
        aria-label="Icon tool"
      >
        <Image 
          src="/icons/duotone/star.svg" 
          alt="Icon"
          width={22}
          height={22}
          className={`${activeTool === "icon" ? "text-white" : "text-tool-text"} w-5 h-5 md:w-[22px] md:h-[22px]`} 
        />
        <span className="sr-only">Icon</span>
      </button>
      
      {showOptions && (
        <div className={`absolute ${isMobile ? 'top-full left-1/2 -translate-x-1/2' : 'top-full left-0'} mt-2 z-50 animate-shape-slide`}>
          <IconPicker onSelectIcon={onSelectIcon} />
        </div>
      )}
    </div>
  );
};

export default IconToolButton;