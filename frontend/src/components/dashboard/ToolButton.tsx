import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ToolButtonProps {
  isActive: boolean;
  onClick: () => void;
  ariaLabel: string;
  children: ReactNode;
  className?: string;
  hasDropdown?: boolean;
  dropdownContent?: ReactNode;
}

const ToolButton: React.FC<ToolButtonProps> = ({
  isActive,
  onClick,
  ariaLabel,
  children,
  className,
  hasDropdown = false,
  dropdownContent,
}) => {
  return (
    <div className={hasDropdown ? "relative" : ""}>
      <button
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-lg transition-all",
          isActive
            ? "bg-blue-100 text-white"
            : "hover:bg-gray-100 dark:hover:bg-gray-800",
          className
        )}
        onClick={onClick}
        aria-label={ariaLabel}
      >
        {children}
      </button>
      {hasDropdown && dropdownContent && dropdownContent}
    </div>
  );
};

export default ToolButton;