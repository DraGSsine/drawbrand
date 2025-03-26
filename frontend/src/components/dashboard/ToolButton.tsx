import React, { ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ToolButtonProps {
  isActive: boolean;
  onClick: () => void;
  icon: ReactNode;
  className?: string;
}

const ToolButton: React.FC<ToolButtonProps> = ({
  isActive,
  onClick,
  icon,
  className,
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
    <button
      type="button"
      onClick={onClick}
      className={cn(
        `${isMobile ? 'p-1' : 'p-[6px]'} rounded-lg flex items-center justify-center transition-all`,
        isActive
          ? "bg-blue-600/20 text-white"
          : "bg-white text-gray-600 hover:bg-blue-600/20 hover:text-blue-600",
        className
      )}
    >
      <span>{icon}</span>
    </button>
  );
};

export default ToolButton;