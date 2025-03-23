import React, { ReactNode } from "react";
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
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
        isActive
          ? "bg-blue-500 text-white hover:bg-blue-600"
          : "bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600",
        className
      )}
    >
      <span className="w-4 h-4">{icon}</span>
    </button>
  );
};

export default ToolButton;