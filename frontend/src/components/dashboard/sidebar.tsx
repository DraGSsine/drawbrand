"use client";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Switch } from "@/components/ui/switch";
import { HexColorPicker } from "react-colorful";
import { Palette, Rotate, Cube, CircleXmark } from "../../../public/icons/SvgIcons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";

export interface LogoSettings {
  creativityStrength: number;
  colorType: "solid" | "palette";
  colorPalette: string;
  customColors: string[]; // This will be the currently active colors
  customPaletteColors: string[]; // This will store the custom palette separately
  styleType: string;
  illustrationStyle: string;
  logoStyle: string;
  detailLevel: number;
  primaryColor: string;
  customSolidColor: string;
}

// Define color palettes with strong typing
type ColorPaletteType = {
  [key: string]: {
    name: string;
    description: string;
    colors: string[];
  };
};

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

// Illustration styles
const illustrationStyles = [
  { value: "geometric", label: "Geometric" },
  { value: "abstract", label: "Abstract" },
  { value: "minimalist", label: "Minimalist" },
  { value: "handdrawn", label: "Hand-drawn" },
  { value: "gradient", label: "Gradient" },
  { value: "outline", label: "Outline" },
];

// Logo styles
const logoStyles = [
  { value: "modern", label: "Modern" },
  { value: "vintage", label: "Vintage" },
  { value: "playful", label: "Playful" },
  { value: "corporate", label: "Corporate" },
  { value: "tech", label: "Tech" },
];

const CUSTOM_PALETTE_ID = "custom";

const defaultSettings: LogoSettings = {
  creativityStrength: 65,
  colorType: "palette",
  colorPalette: "sunset",
  customColors: ["#F97316", "#FBBF24", "#DC2626"],
  customPaletteColors: ["#F97316", "#FBBF24", "#DC2626"], // Initialize with same colors
  styleType: "2d",
  illustrationStyle: "geometric",
  logoStyle: "modern",
  detailLevel: 65,
  primaryColor: "#6E59A5",
  customSolidColor: "#6E59A5",
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
  const [styleType, setStyleType] = useState<"2d" | "3d">("2d");
  const [activeControl, setActiveControl] = useState<"creativity" | "detail">(
    "creativity"
  );
  const [isCustomColorSelected, setIsCustomColorSelected] =
    useState<boolean>(false);

  // Fix the useEffect for loading saved settings
  useEffect(() => {
    const savedSettings = localStorage.getItem(STORAGE_KEY);
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(
          savedSettings
        ) as Partial<LogoSettings>;

        // Ensure customPaletteColors exists (for backward compatibility)
        if (
          !parsedSettings.customPaletteColors &&
          parsedSettings.customColors
        ) {
          parsedSettings.customPaletteColors = [...parsedSettings.customColors];
        }

        // Ensure customSolidColor exists (for backward compatibility)
        if (!parsedSettings.customSolidColor && parsedSettings.primaryColor) {
          parsedSettings.customSolidColor = parsedSettings.primaryColor;
        }

        // Merge with defaults to ensure all properties exist
        setSettings({
          ...defaultSettings,
          ...(parsedSettings as LogoSettings),
        });
      } catch (error) {
        console.error("Error parsing saved settings:", error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Handle setting changes with improved type safety
  const handleChange = (field: keyof LogoSettings, value: any) => {
    const updatedSettings = { ...settings, [field]: value };

    // Handle color palette changes
    if (field === "colorPalette") {
      if (value === CUSTOM_PALETTE_ID) {
        // Restore the saved custom palette colors
        updatedSettings.customColors = [...settings.customPaletteColors];
        updatedSettings.primaryColor = settings.customPaletteColors[0];
      } else if (value in colorPalettes) {
        // Use predefined palette colors
        const selectedPalette =
          colorPalettes[value as keyof typeof colorPalettes];
        updatedSettings.customColors = [...selectedPalette.colors];
        updatedSettings.primaryColor = selectedPalette.colors[0];
      }
    }

    // Set default palette when switching to palette mode
    if (field === "colorType" && value === "palette") {
      if (
        !settings.colorPalette ||
        (!(settings.colorPalette in colorPalettes) &&
          settings.colorPalette !== CUSTOM_PALETTE_ID)
      ) {
        updatedSettings.colorPalette = "sunset";
        updatedSettings.customColors = [...colorPalettes.sunset.colors];
        updatedSettings.primaryColor = colorPalettes.sunset.colors[0];
      }
    }

    // Special handling for primary color
    if (field === "primaryColor") {
      // Check if this is a predefined color
      const isPredefined = colorOptions.some(
        (option) => option.value === value
      );

      if (!isPredefined) {
        // This is a custom color, save it separately
        updatedSettings.customSolidColor = value;
        setIsCustomColorSelected(true);
      } else {
        // This is a predefined color
        setIsCustomColorSelected(false);
      }
    }

    // Save to localStorage and update state
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSettings));
    setSettings(updatedSettings);
  };

  // Reset settings to defaults
  const resetToDefaults = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSettings));
    setSettings({ ...defaultSettings });
  };

  // Update a specific color in the custom colors array
  const updateCustomColor = (index: number, color: string) => {
    const updatedColors = [...settings.customColors];
    updatedColors[index] = color;

    // Store in both current colors and the custom palette storage
    const updatedSettings = {
      ...settings,
      customColors: updatedColors,
      customPaletteColors: updatedColors, // Save to custom palette storage
      colorPalette: CUSTOM_PALETTE_ID,
    };

    // Update primary color if changing the first color
    if (index === 0) {
      updatedSettings.primaryColor = color;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSettings));
    setSettings(updatedSettings);
  };

  const handleCreativityChange = (value: number) => {
    handleChange("creativityStrength", value);
  };

  const handleDetailChange = (value: number) => {
    handleChange("detailLevel", value);
  };

  // Add a function specifically for selecting custom color
  const selectCustomColor = () => {
    // Re-select the saved custom color
    handleChange("primaryColor", settings.customSolidColor);
    setIsCustomColorSelected(true);
  };

  // Add a function to get the correct array of styles based on current settings
  const getStyleOptions = () => {
    return styleType === "2d" ? Style2D : Style3D;
  };

  return (
    <div className="flex rounded-2xl flex-col w-[330px] bg-white border-r h-full border border-blue-100 flex-shrink-0 overflow-hidden z-10">
      {/* Scrollable content section */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-4">
        {/* Styles Section */}
        <div className="space-y-3">
          <Label className="text-slate-800 font-medium inline-flex items-center">
            Styles
          </Label>
          <ToggleGroup
            type="single"
            value={styleType}
            onValueChange={(value) => {
              if (value) setStyleType(value as "2d" | "3d");
            }}
            className="flex bg-slate-100 p-1 rounded-lg"
          >
            <ToggleGroupItem
              value="2d"
              className={cn(
                "flex-1 rounded-md py-2 text-sm font-medium",
                styleType === "2d" && "!bg-blue-500 !text-white"
              )}
            >
              2D Style
            </ToggleGroupItem>
            <ToggleGroupItem
              value="3d"
              className={cn(
                "flex-1 rounded-md py-2 text-sm font-medium",
                styleType === "3d" && "!bg-blue-500 !text-white"
              )}
            >
              3D Style
            </ToggleGroupItem>
          </ToggleGroup>

          {/* Style Select with Images */}
          <Select
            value={styleType === "2d" ? settings.illustrationStyle : settings.logoStyle}
            onValueChange={(value) =>
              handleChange(styleType === "2d" ? "illustrationStyle" : "logoStyle", value)
            }
          >
            {/* Modified select trigger */}
            <SelectTrigger className="w-full">
              <div className="flex items-center gap-2">
                {/* Get the currently selected style */}
                {(() => {
                  const selectedStyle = getStyleOptions().find(
                    (style) => style.value === (styleType === "2d" ? settings.illustrationStyle : settings.logoStyle)
                  );
                  
                  return (
                    <>
                      {selectedStyle?.value === "none" ? (
                        // Show "None" icon for selected option
                        <div className="w-6 h-6 rounded-sm overflow-hidden border border-slate-200 flex items-center justify-center bg-slate-100">
                          <CircleXmark size={18} />
                        </div>
                      ) : selectedStyle?.image ? (
                        // Show image thumbnail for other options
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
                      {/* Style name instead of SelectValue */}
                      <span className="flex-1 text-sm text-left">{selectedStyle?.label || `Select ${styleType} style`}</span>
                    </>
                  );
                })()}
              </div>
            </SelectTrigger>
            
            <SelectContent className="w-[340px] p-2 max-h-[450px]">
              <div className="grid grid-cols-3 gap-2">
                {getStyleOptions().map((style) => (
                  style.value === "none" ? (
                    <SelectItem
                      key={style.value}
                      value={style.value}
                      className="p-0 m-0 rounded-md border border-slate-200 hover:border-slate-300 hover:bg-slate-50 data-[state=checked]:bg-blue-50 data-[state=checked]:border-blue-300"
                    >
                      <div className="flex flex-col items-center p-2 w-full">
                        <div className="w-full aspect-square rounded-md overflow-hidden border border-slate-200 flex items-center justify-center bg-slate-100 mb-1">
                          <CircleXmark size={80} />
                        </div>
                        <span className="text-xs font-medium text-center truncate w-full py-1">{style.label}</span>
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
                        <span className="text-xs font-medium text-center truncate w-full py-1">{style.label}</span>
                      </div>
                    </SelectItem>
                  )
                ))}
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
            value={settings.colorType}
            onValueChange={(value) => {
              if (value)
                handleChange("colorType", value as "solid" | "palette");
            }}
            className="flex bg-slate-100 p-1 rounded-lg"
          >
            <ToggleGroupItem
              value="solid"
              className={cn(
                "flex-1 rounded-md py-2 text-sm font-medium",
                settings.colorType === "solid" && "!bg-blue-500 !text-white"
              )}
            >
              Solid
            </ToggleGroupItem>
            <ToggleGroupItem
              value="palette"
              className={cn(
                "flex-1 rounded-md py-2 text-sm font-medium",
                settings.colorType === "palette" && "!bg-blue-500 !text-white"
              )}
            >
              Palette
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Solid Color Selection */}
        {settings.colorType === "solid" && (
          <div className="space-y-2">
            <div className="grid grid-cols-4 gap-2">
              {colorOptions.map((preset) => (
                <button
                  key={preset.value}
                  className={cn(
                    "h-12 w-12 rounded-lg",
                    settings.primaryColor === preset.value
                      ? "ring-2 ring-offset-1 ring-slate-400 "
                      : "ring-1 ring-slate-200"
                  )}
                  style={{ backgroundColor: preset.value }}
                  onClick={() => handleChange("primaryColor", preset.value)}
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
                    style={{ backgroundColor: settings.customSolidColor }}
                    onClick={selectCustomColor}
                    aria-label="Select custom color"
                  >
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        background:
                          "linear-gradient(135deg, #FF0000, #FF8000, #FFFF00, #00FF00, #0080FF, #8000FF)",
                        borderRadius: "inherit",
                        boxShadow: "inset 0 0 5px rgba(0,0,0,0.2)",
                      }}
                    >
                      <Palette
                        size={26}
                        primaryFillColor="#fff"
                        secondaryFillColor="#444"
                      />
                    </div>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-3 bg-white rounded-lg  border border-slate-200">
                  <HexColorPicker
                    color={settings.customSolidColor}
                    onChange={(color) => {
                      handleChange("primaryColor", color);
                      handleChange("customSolidColor", color);
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
        {settings.colorType === "palette" && (
          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-2">
              {/* The 3 predefined palettes */}
              {Object.entries(colorPalettes).map(([id, palette]) => (
                <button
                  key={id}
                  className={cn(
                    "h-12 w-12 rounded-lg transition-all hover:scale-105 flex items-center justify-center",
                    settings.colorPalette === id
                      ? "ring-2 ring-offset-1 ring-blue-600  bg-blue-50"
                      : "ring-1 ring-gray-300 hover:ring-gray-400"
                  )}
                  onClick={() => handleChange("colorPalette", id)}
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

              {/* The custom palette button */}
              <button
                onClick={() => handleChange("colorPalette", CUSTOM_PALETTE_ID)}
                className={cn(
                  "h-12 w-12 rounded-lg transition-all hover:scale-105 flex items-center justify-center",
                  settings.colorPalette === CUSTOM_PALETTE_ID
                    ? "ring-2 ring-offset-1 ring-blue-400 "
                    : "ring-1 ring-gray-300 hover:ring-gray-400"
                )}
                style={{
                  backgroundColor:
                    settings.colorPalette === CUSTOM_PALETTE_ID
                      ? undefined
                      : "#111",
                }}
              >
                {settings.colorPalette === CUSTOM_PALETTE_ID ? (
                  // Show the actual custom colors when selected
                  <div className="flex">
                    {(settings.customPaletteColors || []).map(
                      (color, index) => (
                        <div
                          key={index}
                          className="w-4 h-4 rounded-full border border-white shadow-sm"
                          style={{
                            backgroundColor: color,
                            marginLeft: index > 0 ? "-4px" : "0",
                            zIndex: 3 - index,
                          }}
                        />
                      )
                    )}
                  </div>
                ) : (
                  // Show palette icon on black background when not selected
                  <div
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, #FF0000, #FF8000, #FFFF00, #00FF00, #0080FF, #8000FF)",
                    borderRadius: "inherit",
                    boxShadow: "inset 0 0 5px rgba(0,0,0,0.2)",
                  }}
                >
                  <Palette
                    size={26}
                    primaryFillColor="#fff"
                    secondaryFillColor="#444"
                  />
                </div>
                )}
              </button>
            </div>

            {/* Color editor for custom palette */}
            {settings.colorPalette === CUSTOM_PALETTE_ID && (
              <div className="p-3 bg-white rounded-lg  border border-gray-200 animate-in fade-in-50">
                <div className="flex gap-2">
                  {settings.customColors.map((color, index) => (
                    <div key={index} className="flex-1 relative">
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            className="h-6 w-full rounded-md shadow-sm overflow-hidden"
                            style={{ backgroundColor: color }}
                          />
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-3 bg-white rounded-lg  border border-gray-200">
                          <HexColorPicker
                            color={color}
                            onChange={(newColor) =>
                              updateCustomColor(index, newColor)
                            }
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

        {/* Creativity & Detail Toggle */}
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
                  {settings.creativityStrength}%
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-slate-500">Creative</span>
                </div>
              </div>
              <Slider
                min={0}
                max={100}
                step={1}
                value={[settings.creativityStrength]}
                onValueChange={(values) => handleCreativityChange(values[0])}
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
                  {settings.detailLevel}%
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-slate-500">Detailed</span>
                </div>
              </div>
              <Slider
                min={0}
                max={100}
                step={1}
                value={[settings.detailLevel]}
                onValueChange={(values) => handleDetailChange(values[0])}
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
          <Rotate size={14} />
          Reset to defaults
        </Button>
      </div>
    </div>
  );
};

export default LogoSidebar;

// First, update the style data with image paths
// First, update the style data with image paths
const Style2D = [
  { value: "none", label: "None", image: null }, // No image, will show icon
  { value: "minimalist", label: "Minimalist", image: "/logoStyles/owl_logos_2d/owl_logo_1_minimalist.png" },
  { value: "geometric", label: "Geometric", image: "/logoStyles/owl_logos_2d/owl_logo_2_geometric.png" },
  { value: "abstract", label: "Abstract", image: "/logoStyles/owl_logos_2d/owl_logo_3_abstract.png" },
  { value: "vintage", label: "Vintage", image: "/logoStyles/owl_logos_2d/owl_logo_4_vintage.png" },
  { value: "flat_design", label: "Flat Design", image: "/logoStyles/owl_logos_2d/owl_logo_5_flat_design.png" },
  { value: "line_art", label: "Line Art", image: "/logoStyles/owl_logos_2d/owl_logo_6_line_art.png" },
  { value: "hand_drawn", label: "Hand-drawn", image: "/logoStyles/owl_logos_2d/owl_logo_7_hand_drawn.png" },
  { value: "watercolor", label: "Watercolor", image: "/logoStyles/owl_logos_2d/owl_logo_8_watercolor.png" },
  { value: "tribal", label: "Tribal", image: "/logoStyles/owl_logos_2d/owl_logo_9_tribal.png" },
  { value: "emblem", label: "Emblem", image: "/logoStyles/owl_logos_2d/owl_logo_10_emblem.png" },
];

const Style3D = [
  { value: "none", label: "None", image: null }, // No image, will show icon
  { value: "realistic_3d", label: "Realistic", image: "/logoStyles/owl_logos_3d/owl_logo_1_realistic_3d.png" },
  { value: "neon_3d", label: "Neon", image: "/logoStyles/owl_logos_3d/owl_logo_2_neon_3d.png" },
  { value: "metallic_3d", label: "Metallic", image: "/logoStyles/owl_logos_3d/owl_logo_3_metallic_3d.png" },
  { value: "crystal_3d", label: "Crystal", image: "/logoStyles/owl_logos_3d/owl_logo_4_crystal_3d.png" },
  { value: "steampunk_3d", label: "Steampunk", image: "/logoStyles/owl_logos_3d/owl_logo_5_steampunk_3d.png" },
  { value: "holographic_3d", label: "Holographic", image: "/logoStyles/owl_logos_3d/owl_logo_6_holographic_3d.png" },
  { value: "carved_wood_3d", label: "Carved Wood", image: "/logoStyles/owl_logos_3d/owl_logo_7_carved_wood_3d.png" },
  { value: "stone_3d", label: "Stone", image: "/logoStyles/owl_logos_3d/owl_logo_8_stone_3d.png" },
  { value: "cyberpunk_3d", label: "Cyberpunk", image: "/logoStyles/owl_logos_3d/owl_logo_9_cyberpunk_3d.png" },
  { value: "ice_3d", label: "Ice", image: "/logoStyles/owl_logos_3d/owl_logo_10_ice_3d.png" },
];