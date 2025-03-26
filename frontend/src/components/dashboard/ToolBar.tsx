import React, { useState, useEffect } from "react";
import { ShapeType } from "@/utils/drawing/ShapeTool";
import IconPicker from "./IconPicker";
import ShapeSelector from "./ShapeSelector";
import StrokeWidthPicker from "./StrokeWidthPicker";
import {
  Eraser,
  HandPointer,
  Icons,
  Image as ImageIcon,
  Pencil,
  PenNib,
  Shapes,
  Palette,
  Trash,
  RotateLeft,
} from "../../../public/icons/SvgIcons";
import ToolButton from "./ToolButton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Tool =
  | "pencil"
  | "select"
  | "eraser"
  | "line"
  | "shape"
  | "icon"
  | "image";

interface ToolbarProps {
  activeTool: Tool;
  onToolChange: (tool: Tool) => void;
  strokeWidth: number;
  onStrokeWidthChange: (width: number) => void;
  onSelectShape: (shape: ShapeType) => void;
  selectedShape?: ShapeType;
  onChangeFillMode: (mode: "regular" | "solid") => void;
  fillMode: "regular" | "solid";
  onSelectIcon: (iconPath: string) => void;
  onClearCanvas?: () => void;
  onUndoAction?: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  activeTool,
  onToolChange,
  strokeWidth,
  onStrokeWidthChange,
  onSelectShape,
  onChangeFillMode,
  fillMode,
  onSelectIcon,
  onClearCanvas,
  onUndoAction,
}) => {
  // Manage UI state locally in Toolbar
  const [showShapeOptions, setShowShapeOptions] = useState(false);
  const [showIconOptions, setShowIconOptions] = useState(false);
  const [showStrokeOptions, setShowStrokeOptions] = useState(false);
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

  // Local toggle functions
  const toggleShapeOptions = () => {
    setShowShapeOptions(!showShapeOptions);
    setShowIconOptions(false);
    setShowStrokeOptions(false);
    onToolChange("shape");
  };

  const toggleIconOptions = () => {
    setShowIconOptions(!showIconOptions);
    setShowShapeOptions(false);
    setShowStrokeOptions(false);
    onToolChange("icon");
  };

  const toggleStrokeOptions = () => {
    setShowStrokeOptions(!showStrokeOptions);
    setShowShapeOptions(false);
    setShowIconOptions(false);
  };

  // Hide options when selecting non-relevant tools
  const handleToolChange = (tool: Tool) => {
    if (tool !== "shape") setShowShapeOptions(false);
    if (tool !== "icon") setShowIconOptions(false);
    setShowStrokeOptions(false);
    onToolChange(tool);
  };

  // Wrap shape selection to close the panel after selection
  const handleShapeSelectAndClose = (shape: ShapeType) => {
    setShowShapeOptions(false);
    onSelectShape(shape);
  };

  // Wrap icon selection to close the panel after selection
  const handleIconSelectAndClose = (iconPath: string) => {
    setShowIconOptions(false);
    onSelectIcon(iconPath);
  };
  
  const activeStyle = "[&>*:nth-child(2)]:fill-[#3b82f6] [&>*:nth-child(1)]:fill-[#3b82f630]";
  
  return (
    <TooltipProvider>
      <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1 sm:mb-2">
        {/* Main toolbar container */}
        <div className={`flex items-center bg-white dark:bg-gray-900 rounded-lg border border-blue-100 ${isMobile ? 'p-1' : 'p-1.5'} gap-1 sm:gap-2 shadow-sm overflow-x-auto max-w-full`}>
          {/* Drawing tools section */}
          <div className={`flex items-center gap-0.5 sm:gap-1 border-r border-gray-200 ${isMobile ? 'pr-1' : 'pr-2'}`}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={`${isMobile ? 'w-7 h-7' : 'w-9 h-9'} flex items-center justify-center`}>
                  <ToolButton
                    isActive={activeTool === "pencil"}
                    onClick={() => handleToolChange("pencil")}
                    icon={<Pencil className={cn(`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`, activeTool === "pencil" ? activeStyle : "")} iconPrimary="#1E3050" iconSecondary="#1E305030"/>}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="font-medium text-xs">
                Pencil Tool
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div className={`${isMobile ? 'w-7 h-7' : 'w-9 h-9'} flex items-center justify-center`}>
                  <ToolButton
                    isActive={activeTool === "line"}
                    onClick={() => handleToolChange("line")}
                    icon={<PenNib className={cn(`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`, activeTool === "line" ? activeStyle : "")} iconPrimary="#1E3050" iconSecondary="#1E305030"/>}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="font-medium text-xs">
                Line Tool
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div className={`${isMobile ? 'w-7 h-7' : 'w-9 h-9'} flex items-center justify-center`}>
                  <ToolButton
                    isActive={activeTool === "select"}
                    onClick={() => handleToolChange("select")}
                    icon={<HandPointer className={cn(`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`, activeTool === "select" ? activeStyle : "")} iconPrimary="#1E3050" iconSecondary="#1E305030"/>}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="font-medium text-xs">
                Select Tool
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div className={`${isMobile ? 'w-7 h-7' : 'w-9 h-9'} flex items-center justify-center`}>
                  <ToolButton
                    isActive={activeTool === "eraser"}
                    onClick={() => handleToolChange("eraser")}
                    icon={<Eraser className={cn(`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`, activeTool === "eraser" ? activeStyle : "")} iconPrimary="#1E3050" iconSecondary="#1E305030"/>}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="font-medium text-xs">
                Eraser Tool
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Shape and Icon section */}
          <div className={`flex items-center gap-0.5 sm:gap-1 border-r border-gray-200 ${isMobile ? 'pr-1' : 'pr-2'}`}>
            <Popover open={showShapeOptions} onOpenChange={setShowShapeOptions}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={`${isMobile ? 'w-7 h-7' : 'w-9 h-9'} flex items-center justify-center`}>
                    <PopoverTrigger asChild>
                      <div>
                        <ToolButton
                          isActive={activeTool === "shape"}
                          onClick={toggleShapeOptions}
                          icon={<Shapes className={cn(`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`, activeTool === "shape" ? activeStyle : "")} iconPrimary="#1E3050" iconSecondary="#1E305030"/>}
                        />
                      </div>
                    </PopoverTrigger>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="font-medium text-xs">
                  Shape Tool
                </TooltipContent>
              </Tooltip>
              <PopoverContent side="bottom" className="p-1 w-auto" sideOffset={10}>
                <ShapeSelector
                  onSelectShape={handleShapeSelectAndClose}
                  onChangeFillMode={onChangeFillMode}
                  fillMode={fillMode}
                />
              </PopoverContent>
            </Popover>

            <Popover open={showIconOptions} onOpenChange={setShowIconOptions}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={`${isMobile ? 'w-7 h-7' : 'w-9 h-9'} flex items-center justify-center`}>
                    <PopoverTrigger asChild>
                      <div>
                        <ToolButton
                          isActive={activeTool === "icon"}
                          onClick={toggleIconOptions}
                          icon={<Icons className={cn(`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`, activeTool === "icon" ? activeStyle : "")} iconPrimary="#1E3050" iconSecondary="#1E305030"/>}
                        />
                      </div>
                    </PopoverTrigger>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="font-medium text-xs">
                  Icon Tool
                </TooltipContent>
              </Tooltip>
              <PopoverContent asChild side="right" sideOffset={5} className="p-0 w-auto">
                <div>
                  <IconPicker onSelectIcon={handleIconSelectAndClose} />
                </div>
              </PopoverContent>
            </Popover>

            <Tooltip>
              <TooltipTrigger asChild>
                <div className={`${isMobile ? 'w-7 h-7' : 'w-9 h-9'} flex items-center justify-center`}>
                  <ToolButton
                    isActive={activeTool === "image"}
                    onClick={() => handleToolChange("image")}
                    icon={<ImageIcon className={cn(`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`, activeTool === "image" ? activeStyle : "")} iconPrimary="#1E3050" iconSecondary="#1E305030"/>}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="font-medium text-xs">
                Image Tool
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Stroke Width section */}
          <div className={`flex items-center gap-0.5 sm:gap-1 border-r border-gray-200 ${isMobile ? 'pr-1' : 'pr-2'}`}>
            <Popover open={showStrokeOptions} onOpenChange={setShowStrokeOptions}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={`${isMobile ? 'w-7 h-7' : 'w-9 h-9'} flex items-center justify-center`}>
                    <PopoverTrigger asChild>
                      <div>
                        <ToolButton
                          isActive={false}
                          onClick={toggleStrokeOptions}
                          icon={<Palette className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} iconPrimary="#1E3050" iconSecondary="#1E305030"/>}
                        />
                      </div>
                    </PopoverTrigger>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="font-medium text-xs">
                  Stroke Width
                </TooltipContent>
              </Tooltip>
              <PopoverContent side="bottom" className="p-1 w-auto" sideOffset={10}>
                <StrokeWidthPicker
                  strokeWidth={strokeWidth}
                  onStrokeWidthChange={onStrokeWidthChange}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Action buttons section */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={`${isMobile ? 'w-7 h-7' : 'w-9 h-9'} flex items-center justify-center`}>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onUndoAction}
                    className={`rounded-lg bg-transparent hover:bg-gray-100 focus:outline-none ${isMobile ? 'h-6 w-6' : 'h-8 w-8'}`}
                  >
                    <RotateLeft className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`}  iconPrimary="#1E3050" iconSecondary="#1E305030" />
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="font-medium text-xs">
                Undo
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div className={`${isMobile ? 'w-7 h-7' : 'w-9 h-9'} flex items-center justify-center`}>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClearCanvas}
                    className={`rounded-lg bg-transparent hover:bg-gray-100 focus:outline-none ${isMobile ? 'h-6 w-6' : 'h-8 w-8'}`}
                  >
                    <Trash className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`}  iconPrimary="#1E3050" iconSecondary="#1E305030" />
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="font-medium text-xs">
                Clear Canvas
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Toolbar;
