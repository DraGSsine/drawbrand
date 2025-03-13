import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ToolButtonProps {
  tool: string;
  activeTool: string;
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}

const ToolButton: React.FC<ToolButtonProps> = ({ 
  tool, 
  activeTool, 
  icon: Icon, 
  label, 
  onClick 
}) => {
  return (
    <button
      className={`tool-button ${activeTool === tool ? "active" : ""}`}
      onClick={onClick}
      aria-label={`${label} tool`}
    >
      <Icon size={22} className={`transition-transform duration-200 ${activeTool === tool ? "text-white" : "text-tool-text"}`} />
      <span className="sr-only">{label}</span>
    </button>
  );
};

export default ToolButton;