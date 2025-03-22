"use client";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { HexColorPicker } from "react-colorful";
import {
  Palette,
  Rotate,
  CircleXmark,
} from "../../../public/icons/SvgIcons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";

// Updated LogoSettings interface with simpler colors structure
export interface LogoSettings {
  styles: {
    type: "2d" | "3d";  
    style: string;      
  };
  colors: {
    type: "solid" | "palette"; // Type determines how to interpret color values
    color: string | string[]; // Single string for solid, array for palette
  };
  controls: {
    creativity: number;
    detail: number;
  };
}

// Define color palettes with strong typing
type ColorPaletteType = {
  [key: string]: {
    name: string;
    description: string;
    colors: string[];
  };
};
const Style2D = [
  { value: "pictorial", label: "Pictorial", image: "/logoStyles/logos_2d/pictorial.png" },
  { value: "mascot", label: "Mascot", image: "/logoStyles/logos_2d/mascot.png" },
  { value: "badgeCrest", label: "Badge Crest", image: "/logoStyles/logos_2d/badgeCrest.png" },
  { value: "cartoon", label: "Cartoon", image: "/logoStyles/logos_2d/cartoon.png" },
  { value: "iconEmoji", label: "Icon Emoji", image: "/logoStyles/logos_2d/iconEmoji.png" },
  { value: "abstract", label: "Abstract", image: "/logoStyles/logos_2d/abstract.png" },
  { value: "line", label: "Line", image: "/logoStyles/logos_2d/line.png" },
  { value: "pixel", label: "Pixel", image: "/logoStyles/logos_2d/pixel.png" },
  { value: "comic", label: "Comic", image: "/logoStyles/logos_2d/comic.png" },
  { value: "flatGraphic", label: "Flat Graphic", image: "/logoStyles/logos_2d/flatGraphic.png" },
  { value: "manga", label: "Manga", image: "/logoStyles/logos_2d/manga.png" },
  { value: "kawaii", label: "Kawaii", image: "/logoStyles/logos_2d/kawaii.png" },
  { value: "watercolor", label: "Watercolor", image: "/logoStyles/logos_2d/watercolor.png" },
  { value: "pop", label: "Pop", image: "/logoStyles/logos_2d/pop.png" },
  { value: "illustration", label: "Illustration", image: "/logoStyles/logos_2d/illustration.png" }
];

const Style3D = [
  { value: "lowPoly", label: "Low Poly", image: "/logoStyles/owl_logos_3d/low_poly.png" },
  { value: "realistic", label: "Realistic", image: "/logoStyles/owl_logos_3d/realistic.png" },
  { value: "celShaded", label: "Cel Shaded", image: "/logoStyles/owl_logos_3d/cel_shaded.png" },
  { value: "sculpted", label: "Sculpted", image: "/logoStyles/owl_logos_3d/sculpted.png" },
  { value: "voxel", label: "Voxel", image: "/logoStyles/owl_logos_3d/voxel_art.png" },
  { value: "cyberpunk", label: "Cyberpunk", image: "/logoStyles/owl_logos_3d/cyberpunk.png" },
  { value: "fantasy", label: "Fantasy", image: "/logoStyles/owl_logos_3d/fantasy.png" },
  { value: "steampunk", label: "Steampunk", image: "/logoStyles/owl_logos_3d/steampunk.png" },
  { value: "sciFi", label: "Sci-Fi", image: "/logoStyles/owl_logos_3d/sci_fi.png" },
  { value: "surreal", label: "Surreal", image: "/logoStyles/owl_logos_3d/surreal.png" },
  { value: "toonStyle", label: "Toon Style", image: "/logoStyles/owl_logos_3d/toon_style.png" },
  { value: "claymation", label: "Claymation", image: "/logoStyles/owl_logos_3d/claymation.png" },
  { value: "metallic", label: "Metallic", image: "/logoStyles/owl_logos_3d/metallic.png" },
  { value: "abstract", label: "Abstract", image: "/logoStyles/owl_logos_3d/abstract.png" },
  { value: "organic", label: "Organic", image: "/logoStyles/owl_logos_3d/organic.png" }
];


const colorPalettes: ColorPaletteType = {
  sunset: {
    name: "Sunset",
    description: "Warm orange and red tones",
    colors: ["#F97316", "#FBBF24", "#DC2626"],
  },
  ocean: {
    name: "Ocean",
    description: "Cool blue tones",
    colors: ["#0EA5E9", "#0891B2", "#1E40AF"],
  },
  forest: {
    name: "Forest",
    description: "Natural green tones",
    colors: ["#10B981", "#059669", "#166534"],
  },
};

const CUSTOM_PALETTE_ID = "custom";

// Updated default settings with simplified color structure
const defaultSettings: LogoSettings = {
  styles: {
    type: "2d",
    style: "geometric", // Default 2D style
  },
  colors: {
    type: "solid",
    color: "#6E59A5", // Single color for solid type
  },
  controls: {
    creativity: 65,
    detail: 65,
  }
};

// Color options
const colorOptions = [
  { value: "#6366F1", label: "Indigo", group: "primary" },
  { value: "#3B82F6", label: "Blue", group: "primary" },
  { value: "#10B981", label: "Green", group: "primary" },
];

const STORAGE_KEY = "logo-generator-settings";

const LogoSidebar = () => {
  const [settings, setSettings] = useState<LogoSettings>(defaultSettings);
  const [activeControl, setActiveControl] = useState<"creativity" | "detail">("creativity");
  const [isCustomColorSelected, setIsCustomColorSelected] = useState<boolean>(false);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem(STORAGE_KEY);
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings) as Partial<LogoSettings>;
        
        // Merge with defaults to ensure all properties exist
        setSettings({
          ...defaultSettings,
          ...parsedSettings,
          // Ensure nested objects don't get lost
          styles: { ...defaultSettings.styles, ...(parsedSettings.styles || {}) },
          colors: { ...defaultSettings.colors, ...(parsedSettings.colors || {}) },
          controls: { ...defaultSettings.controls, ...(parsedSettings.controls || {}) },
        });
      } catch (error) {
        console.error("Error parsing saved settings:", error);
        localStorage.removeItem(STORAGE_KEY);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSettings));
      }
    } else {
      // Initialize localStorage with default settings
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSettings));
    }
  }, []);

  // Save to localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  // Handle style type change (2D/3D)
  const handleStyleTypeChange = (type: "2d" | "3d") => {
    // When changing type, provide a default style for the new type
    let newStyle = settings.styles.style;
    
    // If current style isn't applicable to new type, use a default
    if (type === "2d" && !Style2D.some(s => s.value === settings.styles.style)) {
      newStyle = "geometric"; // Default 2D style
    } else if (type === "3d" && !Style3D.some(s => s.value === settings.styles.style)) {
      newStyle = "realistic_3d"; // Default 3D style
    }
    
    setSettings({
      ...settings,
      styles: {
        type,
        style: newStyle
      }
    });
  };

  // Handle style change
  const handleStyleChange = (style: string) => {
    setSettings({
      ...settings,
      styles: {
        ...settings.styles,
        style
      }
    });
  };

  // Updated handleColorTypeChange function
  const handleColorTypeChange = (type: "solid" | "palette") => {
    // When switching to palette, convert single color to array if needed
    if (type === "palette" && typeof settings.colors.color === "string") {
      setSettings({
        ...settings,
        colors: {
          type,
          color: [settings.colors.color, "#FBBF24", "#DC2626"] // Convert to array with the current color
        }
      });
    } 
    // When switching to solid, take first color from palette if needed
    else if (type === "solid" && Array.isArray(settings.colors.color)) {
      setSettings({
        ...settings,
        colors: {
          type,
          color: settings.colors.color[0] // Use first color from array
        }
      });
    }
    // If same type, just update the type
    else {
      setSettings({
        ...settings,
        colors: {
          ...settings.colors,
          type
        }
      });
    }
  };

  // Updated handleSolidColorChange function
  const handleSolidColorChange = (color: string) => {
    setSettings({
      ...settings,
      colors: {
        type: "solid",
        color: color
      }
    });
    
    // Determine if this is a custom color
    const isPredefined = colorOptions.some(option => option.value === color);
    setIsCustomColorSelected(!isPredefined);
  };

  // Updated handlePaletteChange function
  const handlePaletteChange = (paletteId: string) => {
    let colors: string[];
    
    // If selecting a predefined palette
    if (paletteId !== CUSTOM_PALETTE_ID && paletteId in colorPalettes) {
      colors = [...colorPalettes[paletteId as keyof typeof colorPalettes].colors];
    } 
    // If it's a custom palette, use existing colors or defaults
    else {
      colors = Array.isArray(settings.colors.color) ? 
        settings.colors.color : 
        ["#F97316", "#FBBF24", "#DC2626"]; // Default colors
    }
    
    setSettings({
      ...settings,
      colors: {
        type: "palette",
        color: colors
      }
    });
  };

  // Updated updateCustomPaletteColor function
  const updateCustomPaletteColor = (index: number, color: string) => {
    // Ensure we have an array
    const colors = Array.isArray(settings.colors.color) ? 
      [...settings.colors.color] : 
      ["#F97316", "#FBBF24", "#DC2626"];
    
    colors[index] = color;
    
    setSettings({
      ...settings,
      colors: {
        type: "palette",
        color: colors
      }
    });
  };

  // Update control values
  const handleControlChange = (control: "creativity" | "detail", value: number) => {
    setSettings({
      ...settings,
      controls: {
        ...settings.controls,
        [control]: value
      }
    });
  };

  // Reset to defaults
  const resetToDefaults = () => {
    setSettings({ ...defaultSettings });
  };

  // Helper to get style options based on current type
  const getStyleOptions = () => {
    return settings.styles.type === "2d" ? Style2D : Style3D;
  };

  return (
    <div className="flex rounded-2xl flex-col w-[330px] bg-white border-r h-full border border-blue-100 flex-shrink-0 overflow-hidden z-10">
      {/* Scrollable content section */}
      <div className="flex-1 overflow-y-auto p-6 space-y-9 pb-4">
        {/* Styles Section */}
        <div className="space-y-3">
          <Label className="text-slate-800 font-medium inline-flex items-center">
            Styles
          </Label>
          <ToggleGroup
            type="single"
            value={settings.styles.type}
            onValueChange={(value) => {
              if (value) handleStyleTypeChange(value as "2d" | "3d");
            }}
            className="flex bg-slate-100 p-1 rounded-lg"
          >
            <ToggleGroupItem
              value="2d"
              className={cn(
                "flex-1 rounded-md py-2 text-sm font-medium",
                settings.styles.type === "2d" && "!bg-blue-500 !text-white"
              )}
            >
              2D Style
            </ToggleGroupItem>
            <ToggleGroupItem
              value="3d"
              className={cn(
                "flex-1 rounded-md py-2 text-sm font-medium",
                settings.styles.type === "3d" && "!bg-blue-500 !text-white"
              )}
            >
              3D Style
            </ToggleGroupItem>
          </ToggleGroup>

          {/* Style Select with Images */}
          <Select
            value={settings.styles.style}
            onValueChange={handleStyleChange}
          >
            {/* Modified select trigger */}
            <SelectTrigger className="w-full">
              <div className="flex items-center gap-2">
                {/* Get the currently selected style */}
                {(() => {
                  const selectedStyle = getStyleOptions().find(
                    (style) => style.value === settings.styles.style
                  );

                  return (
                    <>
                      {selectedStyle?.value === "none" ? (
                        <div className="w-6 h-6 rounded-sm overflow-hidden border border-slate-200 flex items-center justify-center bg-slate-100">
                          <CircleXmark />
                        </div>
                      ) : selectedStyle?.image ? (
                        <div className="w-6 h-6 rounded-sm overflow-hidden border border-slate-200">
                          <Image
                            width={50}
                            height={50}
                            src={selectedStyle.image}
                            alt={selectedStyle.label}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : null}
                      <span className="flex-1 text-sm text-left">
                        {selectedStyle?.label || `Select ${settings.styles.type} style`}
                      </span>
                    </>
                  );
                })()}
              </div>
            </SelectTrigger>

            <SelectContent className="w-[340px] p-2 max-h-[450px]">
              <div className="grid grid-cols-3 gap-2">
                {getStyleOptions().map((style) =>
                  style.value === "none" ? (
                    <SelectItem
                      key={style.value}
                      value={style.value}
                      className="p-0 m-0 rounded-md border border-slate-200 hover:border-slate-300 hover:bg-slate-50 data-[state=checked]:bg-blue-50 data-[state=checked]:border-blue-300"
                    >
                      <div className="flex flex-col items-center p-2 w-full">
                        <div className="w-full aspect-square rounded-md overflow-hidden border border-slate-200 flex items-center justify-center bg-slate-100 mb-1">
                          <CircleXmark />
                        </div>
                        <span className="text-xs font-medium text-center truncate w-full py-1">
                          {style.label}
                        </span>
                      </div>
                    </SelectItem>
                  ) : (
                    <SelectItem
                      key={style.value}
                      value={style.value}
                      className="p-0 m-0 rounded-md border border-slate-200 hover:border-slate-300 hover:bg-slate-50 data-[state=checked]:bg-blue-50 data-[state=checked]:border-blue-300"
                    >
                      <div className="flex flex-col items-center p-2 w-full">
                        <div className="w-full aspect-square rounded-md overflow-hidden bg-gray-100 mb-1">
                          <Image
                            width={100}
                            height={100}
                            src={style.image || "/placeholder.png"}
                            alt={style.label || "Style thumbnail"}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <span className="text-xs font-medium text-center truncate w-full py-1">
                          {style.label}
                        </span>
                      </div>
                    </SelectItem>
                  )
                )}
              </div>
            </SelectContent>
          </Select>
        </div>

        {/* Colors */}
        <div className="space-y-2">
          <Label className="text-slate-800 font-medium inline-flex items-center">
            Colors
          </Label>
          <ToggleGroup
            type="single"
            value={settings.colors.type}
            onValueChange={(value) => {
              if (value) handleColorTypeChange(value as "solid" | "palette");
            }}
            className="flex bg-slate-100 p-1 rounded-lg"
          >
            <ToggleGroupItem
              value="solid"
              className={cn(
                "flex-1 rounded-md py-2 text-sm font-medium",
                settings.colors.type === "solid" && "!bg-blue-500 !text-white"
              )}
            >
              Solid
            </ToggleGroupItem>
            <ToggleGroupItem
              value="palette"
              className={cn(
                "flex-1 rounded-md py-2 text-sm font-medium",
                settings.colors.type === "palette" && "!bg-blue-500 !text-white"
              )}
            >
              Palette
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Solid Color Selection */}
        {settings.colors.type === "solid" && (
          <div className="space-y-2">
            <div className="grid grid-cols-4 gap-2">
              {colorOptions.map((preset) => (
                <button
                  key={preset.value}
                  className={cn(
                    "h-12 w-12 rounded-lg",
                    settings.colors.color === preset.value
                      ? "ring-2 ring-offset-1 ring-slate-400 "
                      : "ring-1 ring-slate-200"
                  )}
                  style={{ backgroundColor: preset.value }}
                  onClick={() => handleSolidColorChange(preset.value)}
                  aria-label={`Select ${preset.label} color`}
                />
              ))}

              <Popover>
                <PopoverTrigger asChild>
                  <button
                    className={cn(
                      "h-12 w-12 rounded-lg ring-1 ring-slate-200 flex items-center justify-center overflow-hidden",
                      isCustomColorSelected
                        ? "ring-2 ring-offset-1 ring-slate-400 "
                        : ""
                    )}
                    style={{ 
                      backgroundColor: isCustomColorSelected && typeof settings.colors.color === 'string' ? settings.colors.color : undefined 
                    }}
                    aria-label="Select custom color"
                  >
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        background: !isCustomColorSelected ? 
                          "linear-gradient(135deg, #FF0000, #FF8000, #FFFF00, #00FF00, #0080FF, #8000FF)" : 
                          undefined,
                        borderRadius: "inherit",
                        boxShadow: "inset 0 0 5px rgba(0,0,0,0.2)",
                      }}
                    >
                      {!isCustomColorSelected && <Palette />}
                    </div>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-3 bg-white rounded-lg border border-slate-200">
                  <HexColorPicker
                    color={isCustomColorSelected && typeof settings.colors.color === 'string' ? settings.colors.color : "#FF0000"}
                    onChange={(color) => {
                      handleSolidColorChange(color);
                      setIsCustomColorSelected(true);
                    }}
                    className="w-48 !h-40"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}

        {/* Palette Selection */}
        {settings.colors.type === "palette" && (
          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-2">
              {/* Predefined palettes */}
              {Object.entries(colorPalettes).map(([id, palette]) => (
                <button
                  key={id}
                  className={cn(
                    "h-12 w-12 rounded-lg transition-all hover:scale-105 flex items-center justify-center",
                    // Check if current palette colors match this predefined palette
                    JSON.stringify(settings.colors.color) === JSON.stringify(palette.colors)
                      ? "ring-2 ring-offset-1 ring-blue-600 bg-blue-50"
                      : "ring-1 ring-gray-300 hover:ring-gray-400"
                  )}
                  onClick={() => handlePaletteChange(id)}
                >
                  <div className="flex">
                    {palette.colors.map((color, index) => (
                      <div
                        key={index}
                        className="w-4 h-4 rounded-full border border-white shadow-sm"
                        style={{
                          backgroundColor: color,
                          marginLeft: index > 0 ? "-4px" : "0",
                          zIndex: 3 - index,
                        }}
                      />
                    ))}
                  </div>
                </button>
              ))}

              {/* Custom palette button - selected when colors don't match any predefined palette */}
              <button
                onClick={() => handlePaletteChange(CUSTOM_PALETTE_ID)}
                className={cn(
                  "h-12 w-12 rounded-lg transition-all hover:scale-105 flex items-center justify-center",
                  !Object.values(colorPalettes).some(palette => 
                    JSON.stringify(settings.colors.color) === JSON.stringify(palette.colors))
                    ? "ring-2 ring-offset-1 ring-blue-400"
                    : "ring-1 ring-gray-300 hover:ring-gray-400"
                )}
              >
                {Array.isArray(settings.colors.color) ? (
                  <div className="flex">
                    {settings.colors.color.map((color, index) => (
                      <div
                        key={index}
                        className="w-4 h-4 rounded-full border border-white shadow-sm"
                        style={{
                          backgroundColor: color,
                          marginLeft: index > 0 ? "-4px" : "0",
                          zIndex: 3 - index,
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  /* Fallback palette icon */
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, #FF0000, #FF8000, #FFFF00, #00FF00, #0080FF, #8000FF)",
                      borderRadius: "inherit",
                      boxShadow: "inset 0 0 5px rgba(0,0,0,0.2)",
                    }}
                  >
                    <Palette className="[&>*:nth-child(2)]:fill-[#3b82f6] [&>*:nth-child(1)]:fill-[#3b82f630]" />
                  </div>
                )}
              </button>
            </div>

            {/* Custom palette color editor - show when none of the predefined palettes match */}
            {!Object.values(colorPalettes).some(palette => 
              JSON.stringify(settings.colors.color) === JSON.stringify(palette.colors)) && (
              <div className="p-3 bg-white rounded-lg border border-gray-200 animate-in fade-in-50">
                <div className="flex gap-2">
                  {Array.isArray(settings.colors.color) && settings.colors.color.map((color, index) => (
                    <div key={index} className="flex-1 relative">
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            className="h-6 w-full rounded-md shadow-sm overflow-hidden"
                            style={{ backgroundColor: color }}
                          />
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-3 bg-white rounded-lg border border-gray-200">
                          <HexColorPicker
                            color={color}
                            onChange={(newColor) => updateCustomPaletteColor(index, newColor)}
                            className="w-48 !h-40"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Creativity & Detail Controls */}
        <div className="space-y-3">
          <Label className="text-slate-800 font-medium inline-flex items-center">
            Design Controls
          </Label>
          <ToggleGroup
            type="single"
            value={activeControl}
            onValueChange={(value) => {
              if (value) setActiveControl(value as "creativity" | "detail");
            }}
            className="flex bg-slate-100 p-1 rounded-lg"
          >
            <ToggleGroupItem
              value="creativity"
              className={cn(
                "flex-1 rounded-md py-2 text-sm font-medium",
                activeControl === "creativity" && "!bg-blue-500 !text-white"
              )}
            >
              Creativity
            </ToggleGroupItem>
            <ToggleGroupItem
              value="detail"
              className={cn(
                "flex-1 rounded-md py-2 text-sm font-medium",
                activeControl === "detail" && "!bg-blue-500 !text-white"
              )}
            >
              Detail
            </ToggleGroupItem>
          </ToggleGroup>

          {/* Creativity Controls */}
          {activeControl === "creativity" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-xs text-slate-500">Conservative</span>
                </div>
                <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">
                  {settings.controls.creativity}%
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-slate-500">Creative</span>
                </div>
              </div>
              <Slider
                min={0}
                max={100}
                step={1}
                value={[settings.controls.creativity]}
                onValueChange={(values) => handleControlChange("creativity", values[0])}
                className="mt-2"
              />
            </div>
          )}

          {/* Detail Controls */}
          {activeControl === "detail" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-xs text-slate-500">Minimal</span>
                </div>
                <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">
                  {settings.controls.detail}%
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-slate-500">Detailed</span>
                </div>
              </div>
              <Slider
                min={0}
                max={100}
                step={1}
                value={[settings.controls.detail]}
                onValueChange={(values) => handleControlChange("detail", values[0])}
                className="mt-2"
              />
            </div>
          )}
        </div>
      </div>

      {/* Fixed button container at bottom */}
      <div className="p-4 border-t border-slate-200">
        <Button
          variant="outline"
          className="w-full border-slate-300 bg-slate-50 rounded-lg flex items-center gap-2 justify-center hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 text-slate-700 h-11 font-medium"
          onClick={resetToDefaults}
        >
          <Rotate className="h-12" />
          Reset to defaults
        </Button>
      </div>
    </div>
  );
};

export default LogoSidebar;

