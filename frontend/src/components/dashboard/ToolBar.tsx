import React, { useState } from "react";
import { ShapeType } from "@/utils/drawing/ShapeTool";
import IconPicker from "./IconPicker";
import ShapeSelector from "./ShapeSelector";
import StrokeWidthPicker from "./StrokeWidthPicker";
import {
  Gear,
  Eraser,
  HandPointer,
  Icons,
  Image,
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
  selectedShape,
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
      <div className="flex items-center justify-center mb-2">
        {/* Main toolbar container */}
        <div className="flex items-center bg-white dark:bg-gray-900 rounded-xl border border-blue-100 p-2 gap-2 shadow-sm">
          {/* Drawing tools section */}
          <div className="flex items-center gap-2 border-r border-gray-100 pr-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <ToolButton
                    isActive={activeTool === "pencil"}
                    onClick={() => handleToolChange("pencil")}
                    icon={<Pencil className="w-4 h-4" />}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="font-medium text-xs">
                Pencil Tool
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <ToolButton
                    isActive={activeTool === "line"}
                    onClick={() => handleToolChange("line")}
                    icon={<PenNib className="w-4 h-4" />}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="font-medium text-xs">
                Line Tool
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <ToolButton
                    isActive={activeTool === "select"}
                    onClick={() => handleToolChange("select")}
                    icon={<HandPointer className="w-4 h-4" />}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="font-medium text-xs">
                Select Tool
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <ToolButton
                    isActive={activeTool === "eraser"}
                    onClick={() => handleToolChange("eraser")}
                    icon={<Eraser className="w-4 h-4" />}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="font-medium text-xs">
                Eraser Tool
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Shape and Icon section */}
          <div className="flex items-center gap-2 border-r border-gray-100 pr-2">
            <Popover open={showShapeOptions} onOpenChange={setShowShapeOptions}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <PopoverTrigger asChild>
                      <div>
                        <ToolButton
                          isActive={activeTool === "shape"}
                          onClick={toggleShapeOptions}
                          icon={<Shapes className="w-4 h-4" />}
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
                  selectedShape={selectedShape}
                />
              </PopoverContent>
            </Popover>

            <Popover open={showIconOptions} onOpenChange={setShowIconOptions}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <PopoverTrigger asChild>
                      <div>
                        <ToolButton
                          isActive={activeTool === "icon"}
                          onClick={toggleIconOptions}
                          icon={<Icons className="w-4 h-4" />}
                        />
                      </div>
                    </PopoverTrigger>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="font-medium text-xs">
                  Icon Tool
                </TooltipContent>
              </Tooltip>
              <PopoverContent side="bottom" className="p-1 w-auto" sideOffset={10}>
                <IconPicker onSelectIcon={handleIconSelectAndClose} />
              </PopoverContent>
            </Popover>

            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <ToolButton
                    isActive={activeTool === "image"}
                    onClick={() => handleToolChange("image")}
                    icon={<Image className="w-4 h-4" />}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="font-medium text-xs">
                Image Tool
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Settings section */}
          <div className="flex items-center gap-2">
            <Popover open={showStrokeOptions} onOpenChange={setShowStrokeOptions}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <PopoverTrigger asChild>
                      <div>
                        <ToolButton
                          isActive={showStrokeOptions}
                          onClick={toggleStrokeOptions}
                          icon={<Palette className="w-4 h-4" />}
                        />
                      </div>
                    </PopoverTrigger>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="font-medium text-xs">
                  Stroke Settings
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
        </div>

        {/* Actions toolbar */}
        <div className="flex items-center bg-white dark:bg-gray-900 rounded-xl border border-blue-100 p-2 gap-2 shadow-sm">
          {onUndoAction && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={onUndoAction}
                    className="w-8 h-8 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  >
                    <RotateLeft className="w-4 h-4" />
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="font-medium text-xs">
                Undo
              </TooltipContent>
            </Tooltip>
          )}

          {onClearCanvas && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={onClearCanvas}
                    className="w-8 h-8 rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="font-medium text-xs">
                Clear Canvas
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Toolbar;
