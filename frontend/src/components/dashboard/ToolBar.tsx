import React, { useState } from "react";
import { ShapeType } from "@/utils/drawing/ShapeTool";
import IconPicker from "./IconPicker";
import ShapeSelector from "./ShapeSelector";
import StrokeWidthPicker from "./StrokeWidthPicker";
import ToolButton from "./ToolButton";
import {
  Eraser,
  HandPointer,
  Icons,
  Image,
  Pencil,
  PenNib,
  Shapes,
} from "../../../public/icons/SvgIcons";

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
  onChangeFillMode: (mode: "regular" | "solid") => void;
  fillMode: "regular" | "solid";
  onSelectIcon: (iconPath: string) => void;
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
  const activeStyle = "[&>*:nth-child(2)]:fill-blue-700 [&>*:nth-child(1)]:fill-black";
  return (
    <div className="absolute border border-blue-900/20 left-[25px] top-1/2 -translate-y-1/2 flex flex-col items-center bg-white dark:bg-gray-900 rounded-xl  p-2 gap-2 z-10">
      {/* Drawing tools section */}
      <div className="flex flex-col gap-2">
        <ToolButton
          isActive={activeTool === "pencil"}
          onClick={() => handleToolChange("pencil")}
          ariaLabel="Pencil tool"
        >
          <Pencil className={activeTool === "pencil" ? activeStyle : ""} />
        </ToolButton>

        <ToolButton
          isActive={activeTool === "select"}
          onClick={() => handleToolChange("select")}
          ariaLabel="Select tool"
        >
          <HandPointer className={activeTool === "select" ? activeStyle : ""}  />
        </ToolButton>

        <ToolButton
          isActive={activeTool === "eraser"}
          onClick={() => handleToolChange("eraser")}
          ariaLabel="Eraser tool"
        >
          <Eraser className={activeTool === "eraser" ? activeStyle : ""}  />
        </ToolButton>
      </div>

      <div className="w-full h-px bg-gray-200 dark:bg-gray-700 my-1" />

      {/* Creation tools section */}
      <div className="flex flex-col gap-2">
        <ToolButton
          isActive={activeTool === "line"}
          onClick={() => handleToolChange("line")}
          ariaLabel="Line tool"
        >
          <PenNib className={activeTool === "line" ? activeStyle : ""}  />
        </ToolButton>

        <ToolButton
          isActive={activeTool === "shape"}
          onClick={toggleShapeOptions}
          ariaLabel="Shape tool"
          hasDropdown={true}
          dropdownContent={showShapeOptions && (
            <ShapeSelector
              onSelectShape={handleShapeSelectAndClose}
              onChangeFillMode={onChangeFillMode}
              fillMode={fillMode}
            />
          )}
        >
          <Shapes />
        </ToolButton>

        <ToolButton
          isActive={activeTool === "icon"}
          onClick={toggleIconOptions}
          ariaLabel="Icon tool"
          hasDropdown={true}
          dropdownContent={showIconOptions && (
            <IconPicker onSelectIcon={handleIconSelectAndClose} />
          )}
        >
          <Icons />
        </ToolButton>

        <ToolButton
          isActive={activeTool === "image"}
          onClick={() => handleToolChange("image")}
          ariaLabel="Image tool"
        >
          <Image />
        </ToolButton>
      </div>

      <div className="w-full h-px bg-gray-200 dark:bg-gray-700 my-1" />

      {/* Stroke width picker */}
      <ToolButton
        isActive={showStrokeOptions}
        onClick={toggleStrokeOptions}
        ariaLabel="Adjust stroke width"
        hasDropdown={true}
        dropdownContent={showStrokeOptions && (
          <StrokeWidthPicker
            width={strokeWidth}
            onChange={onStrokeWidthChange}
          />
        )}
      >
        <div className="flex flex-col items-center justify-center gap-1">
          <div className="w-5 h-1 bg-current rounded-full" />
          <div className="w-3 h-1 bg-current rounded-full" />
        </div>
      </ToolButton>
    </div>
  );
};

export default Toolbar;
