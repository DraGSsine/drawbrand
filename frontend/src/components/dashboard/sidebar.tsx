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
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { HexColorPicker } from "react-colorful";
import {
  Palette,
  Rotate,
} from "../../../public/icons/SvgIcons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";

// Improved AnythingBadge with better contrast and padding
const AnythingBadge = () => (
  <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200">
    Anything
  </span>
);

// Updated LogoSettings interface with palette structure
export interface LogoSettings {
  styles: {
    type: "2d" | "3d" | "anything";  
    style: string;      
  };
  colors: {
    type: "solid" | "palette" | "anything"; // Support both solid and palette types, plus "anything"
    color: string | string[] | "anything"; // Can be a single color or array of colors
  };
  controls: {
    creativity: number | "anything";
    detail: number | "anything";
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

// Define predefined color palettes with better colors
const colorPalettes: ColorPaletteType = {
  vibrant: {
    name: "Vibrant",
    description: "Bright and energetic colors",
    colors: ["#EF4444", "#F59E0B", "#06B6D4"]
  },
  pastel: {
    name: "Pastel",
    description: "Soft and soothing colors",
    colors: ["#FDBA74", "#BAE6FD", "#C4B5FD"]
  },
  earthy: {
    name: "Earthy",
    description: "Natural earth tones",
    colors: ["#A8A29E", "#78716C", "#57534E"]
  },
  monochrome: {
    name: "Monochrome",
    description: "Shades of a single color",
    colors: ["#1E40AF", "#3B82F6", "#93C5FD"]
  }
};

const Style2D = [
  { value: "none", label: "None", image: "/logoStyles/none.png" },
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
  { value: "none", label: "None", image: "/logoStyles/none.png" },
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

// Updated default settings with palette as default color type
const defaultSettings: LogoSettings = {
  styles: {
    type: "2d",
    style: "none", // Default 2D style
  },
  colors: {
    type: "anything",  // Changed from "solid" to "palette"
    color: "anything"
  },
  controls: {
    creativity: 100,
    detail: 100,
  }
};

// Color options
const colorOptions = [
  { value: "#4F46E5", label: "Indigo", group: "primary" },
  { value: "#0EA5E9", label: "Sky Blue", group: "primary" },
  { value: "#10B981", label: "Emerald", group: "primary" },
];

const STORAGE_KEY = "logo-generator-settings";

const LogoSidebar = () => {
  const [settings, setSettings] = useState<LogoSettings>(defaultSettings);
  const [activeControl, setActiveControl] = useState<"creativity" | "detail">("creativity");
  const [isCustomColorSelected, setIsCustomColorSelected] = useState<boolean>(false);
  const [enabledSections, setEnabledSections] = useState({
    styles: true,
    colors: false,
    controls: true
  });
  const [previousValues, setPreviousValues] = useState({
    styles: { ...settings.styles },
    colors: { ...settings.colors },
    controls: { ...settings.controls }
  });

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

  // Updated handlePaletteChange function to fix custom palette handling
  const handlePaletteChange = (paletteId: string) => {
    let selectedColors: string[];
    
    if (paletteId in colorPalettes) {
      selectedColors = [...colorPalettes[paletteId].colors];
    } else {
      // Default colors if palette not found
      selectedColors = ["#F97316", "#FBBF24", "#DC2626"];
    }
    
    // Always set to palette type and update colors
    setSettings({
      ...settings,
      colors: {
        type: "palette",
        color: selectedColors
      }
    });
  };

  // Updated updateCustomPaletteColor function
  const updateCustomPaletteColor = (index: number, color: string) => {
    // Ensure we have an array
    const currentColors = Array.isArray(settings.colors.color) ? 
      [...settings.colors.color] : 
      ["#F97316", "#FBBF24", "#DC2626"];
    
    currentColors[index] = color;
    
    setSettings({
      ...settings,
      colors: {
        type: "palette",
        color: currentColors
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

  // Helper function to toggle sections - updated for simpler color structure
  const toggleSection = (section: 'styles' | 'colors' | 'controls') => {
    if (enabledSections[section]) {
      // Disabling section - store current values first
      setPreviousValues({
        ...previousValues,
        [section]: { ...settings[section] }
      });
      
      // Update settings with "Anything"
      if (section === 'styles') {
        setSettings({
          ...settings,
          styles: { type: "anything", style: "anything" }
        });
      } else if (section === 'colors') {
        setSettings({
          ...settings,
          colors: { type: "anything", color: "anything" }
        });
      } else if (section === 'controls') {
        setSettings({
          ...settings,
          controls: { creativity: "anything", detail: "anything" }
        });
      }
    } else {
      // Enabling section - restore previous values
      setSettings({
        ...settings,
        [section]: previousValues[section]
      });
    }
    
    // Toggle the enabled state
    setEnabledSections({
      ...enabledSections,
      [section]: !enabledSections[section]
    });
  };

  return (
    <div className="w-full h-full flex flex-col overflow-auto bg-white border border-blue-100 xl:rounded-2xl">
      <div className="p-6  flex-grow pb-20 space-y-14">
        {/* Styles Section */}
        <div className="space-y-4">
          <div className="mb-4 flex items-center justify-between">
            <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2.5 py-1 rounded">
              Styles
            </span>
            <div className="flex items-center gap-2">
              {!enabledSections.styles && <AnythingBadge />}
              <Switch
                checked={enabledSections.styles}
                onCheckedChange={() => toggleSection('styles')}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>
          </div>
          
          {/* Always show content, but apply disabled styling when toggled off */}
          <div className={cn(
            "transition-all duration-300 space-y-4",
            !enabledSections.styles && "opacity-50 pointer-events-none saturate-50"
          )}>
            <ToggleGroup
              type="single"
              value={settings.styles.type}
              onValueChange={(value) => {
                if (value && enabledSections.styles) handleStyleTypeChange(value as "2d" | "3d");
              }}
              className="flex bg-slate-50 p-1 rounded-lg border border-slate-200"
            >
              <ToggleGroupItem
                value="2d"
                className={cn(
                  "flex-1 rounded-md py-2.5 text-sm font-medium transition-all",
                  settings.styles.type === "2d" && enabledSections.styles 
                    ? "!bg-blue-600 !text-white shadow-md" 
                    : "hover:bg-slate-100"
                )}
              >
                2D Style
              </ToggleGroupItem>
              <ToggleGroupItem
                value="3d"
                className={cn(
                  "flex-1 rounded-md py-2.5 text-sm font-medium transition-all",
                  settings.styles.type === "3d" && enabledSections.styles 
                    ? "!bg-blue-600 !text-white shadow-md" 
                    : "hover:bg-slate-100"
                )}
              >
                3D Style
              </ToggleGroupItem>
            </ToggleGroup>

            {/* Style Select with improved visuals */}
            <Select
              value={settings.styles.style}
              onValueChange={handleStyleChange}
              disabled={!enabledSections.styles}
            >
              {/* Better select trigger with improved spacing and visual cues */}
              <SelectTrigger className="w-full bg-white border border-slate-200 hover:border-blue-300 focus:ring-blue-300 transition-all">
                <div className="flex items-center gap-3">
                  {/* Get the currently selected style */}
                  {(() => {
                    const selectedStyle = getStyleOptions().find(
                      (style) => style.value === settings.styles.style
                    );

                    return (
                      <>
                        {selectedStyle?.image ? (
                          <div className="w-8 h-8 rounded-md overflow-hidden border border-slate-200 bg-white flex-shrink-0 shadow-sm">
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

              <SelectContent className="w-[340px] p-3 max-h-[450px]">
                <div className="grid grid-cols-3 gap-3">
                  {getStyleOptions().map((style) =>
                      <SelectItem
                        key={style.value}
                        value={style.value}
                        className="p-0 m-0 rounded-md border border-slate-200 hover:border-blue-200 hover:bg-blue-50 data-[state=checked]:bg-blue-50 data-[state=checked]:border-blue-300 transition-all"
                      >
                        <div className="flex flex-col items-center p-2 w-full">
                          <div className="w-full aspect-square rounded-md overflow-hidden bg-white mb-2 border border-slate-100 hover:shadow-md transition-all">
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
                    
                  )}
                </div>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Colors Section - Improved section header */}
        <div className="space-y-4">
          <div className="mb-4 flex items-center justify-between">
            <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2.5 py-1 rounded">
              Colors
            </span>
            <div className="flex items-center gap-2">
              {!enabledSections.colors && <AnythingBadge />}
              <Switch
                checked={enabledSections.colors}
                onCheckedChange={() => toggleSection('colors')}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>
          </div>
          
          {/* Color type toggle - Always visible but with reduced opacity when disabled */}
          <div className="space-y-3">
            <ToggleGroup
              type="single"
              value={enabledSections.colors ? settings.colors.type : undefined}
              onValueChange={(value) => {
                if (value && enabledSections.colors) handleColorTypeChange(value as "solid" | "palette");
              }}
              className={cn(
                "flex bg-slate-50 p-1 rounded-lg border border-slate-200 mb-3",
                !enabledSections.colors && "opacity-50 pointer-events-none"
              )}
            >
              <ToggleGroupItem
                value="solid"
                className={cn(
                  "flex-1 rounded-md py-2.5 text-sm font-medium transition-all",
                  settings.colors.type === "solid" && enabledSections.colors 
                    ? "!bg-blue-600 !text-white shadow-md" 
                    : "hover:bg-slate-100"
                )}
              >
                Solid Color
              </ToggleGroupItem>
              <ToggleGroupItem
                value="palette"
                className={cn(
                  "flex-1 rounded-md py-2.5 text-sm font-medium transition-all",
                  settings.colors.type === "palette" && enabledSections.colors 
                    ? "!bg-blue-600 !text-white shadow-md" 
                    : "hover:bg-slate-100"
                )}
              >
                Color Palette
              </ToggleGroupItem>
            </ToggleGroup>

            {/* Solid Color Selection - Visible even when disabled */}
            {(settings.colors.type === "solid" || 
              (settings.colors.type === 'anything' && previousValues.colors?.type === 'solid')) && (
              <div className={cn(
                "space-y-3",
                !enabledSections.colors && "opacity-50 pointer-events-none saturate-50"
              )}>
                <div className="grid grid-cols-4 gap-2">
                  {colorOptions.map((preset) => (
                    <button
                      key={preset.value}
                      className={cn(
                        "h-16 rounded-lg transition-all duration-200 relative group overflow-hidden",
                        (settings.colors.type === "solid" && settings.colors.color === preset.value) ||
                        (settings.colors.type === 'anything' && previousValues.colors?.type === 'solid' && 
                         previousValues.colors?.color === preset.value)
                          ? "ring-2 ring-offset-2 ring-blue-600 scale-105 shadow-md z-10"
                          : "ring-1 ring-slate-200 hover:ring-blue-300 hover:scale-105 hover:shadow-sm"
                      )}
                      style={{ backgroundColor: preset.value }}
                      onClick={() => enabledSections.colors && handleSolidColorChange(preset.value)}
                      aria-label={`Select ${preset.label} color`}
                      disabled={!enabledSections.colors}
                    >
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 to-black/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </button>
                  ))}

                  <Popover>
                    <PopoverTrigger asChild disabled={!enabledSections.colors}>
                      <button
                        className={cn(
                          "h-16 rounded-lg transition-all duration-200 relative overflow-hidden group",
                          (settings.colors.type === "solid" && isCustomColorSelected) ||
                          (settings.colors.type === 'anything' && previousValues.colors?.type === 'solid' && 
                            typeof previousValues.colors?.color === 'string' && 
                            !colorOptions.some(o => o.value === previousValues.colors?.color))
                            ? "ring-2 ring-offset-2 ring-blue-600 scale-105 shadow-md z-10"
                            : "ring-1 ring-slate-200 hover:ring-blue-300 hover:scale-105 hover:shadow-sm"
                        )}
                        style={{ 
                          backgroundColor: 
                            settings.colors.type === "solid" && isCustomColorSelected && typeof settings.colors.color === 'string'
                              ? settings.colors.color 
                              : settings.colors.type === 'anything' && 
                                typeof previousValues.colors?.color === 'string' && 
                                !colorOptions.some(o => o.value === previousValues.colors?.color)
                                ? previousValues.colors?.color
                                : undefined
                        }}
                        aria-label="Select custom color"
                        disabled={!enabledSections.colors}
                      >
                        <div
                          className={cn(
                            "w-full h-full flex items-center justify-center absolute inset-0",
                            (settings.colors.type === "solid" && !isCustomColorSelected) ||
                            (settings.colors.type === 'anything' && previousValues.colors?.type === 'solid' && 
                              typeof previousValues.colors?.color === 'string' && 
                              colorOptions.some(o => o.value === previousValues.colors?.color)) 
                              ? "bg-gradient-to-br from-blue-600 via-purple-500 to-pink-500" : ""
                          )}
                        >
                          {((settings.colors.type === "solid" && !isCustomColorSelected) ||
                            (settings.colors.type === 'anything' && previousValues.colors?.type === 'solid' && 
                              typeof previousValues.colors?.color === 'string' && 
                              colorOptions.some(o => o.value === previousValues.colors?.color))) && (
                            <div className="bg-white/70 backdrop-blur-[3px] rounded-full p-2.5 shadow-sm z-10">
                              <Palette className="w-5 h-5 text-blue-700 drop-shadow-sm" />
                            </div>
                          )}
                        </div>
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 to-black/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-4 bg-white rounded-lg border border-slate-200 shadow-lg">
                      <div className="space-y-4">
                        <HexColorPicker
                          color={isCustomColorSelected && typeof settings.colors.color === 'string' ? 
                            settings.colors.color : "#FF0000"}
                          onChange={(color) => {
                            handleSolidColorChange(color);
                            setIsCustomColorSelected(true);
                          }}
                          className="w-48 !h-48"
                        />
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <div className="h-8 w-12 rounded-md border border-slate-200 shadow-sm" 
                               style={{ backgroundColor: isCustomColorSelected && typeof settings.colors.color === 'string' ? 
                                 settings.colors.color : "#FF0000" }} />
                          <span className="text-sm font-medium text-slate-700">
                            {isCustomColorSelected && typeof settings.colors.color === 'string' ? 
                              settings.colors.color.toUpperCase() : "#FF0000"}
                          </span>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}

            {/* Palette Selection - Visible even when disabled */}
            {(settings.colors.type === "palette" || 
              settings.colors.type === 'anything' && 
              (previousValues.colors?.type === 'palette' || !previousValues.colors?.type)) && (
              <div className={cn(
                "space-y-2",
                !enabledSections.colors && "opacity-50 pointer-events-none saturate-50"
              )}>
                <div className="grid grid-cols-4 gap-2">
                  {/* Predefined palettes (first 3 columns) */}
                  {Object.entries(colorPalettes).slice(0, 3).map(([id, palette]) => (
                    <button
                      key={id}
                      className={cn(
                        "h-16 rounded-lg transition-all duration-200 relative group overflow-hidden",
                        (settings.colors.type === "palette" && Array.isArray(settings.colors.color) && 
                         JSON.stringify(settings.colors.color) === JSON.stringify(palette.colors)) ||
                        (settings.colors.type === 'anything' && previousValues.colors?.type === 'palette' && 
                         Array.isArray(previousValues.colors?.color) && 
                         JSON.stringify(previousValues.colors?.color) === JSON.stringify(palette.colors))
                          ? "ring-2 ring-offset-2 ring-blue-600 scale-105 shadow-md z-10"
                          : "ring-1 ring-slate-200 hover:ring-blue-300 hover:scale-105 hover:shadow-sm"
                      )}
                      onClick={() => enabledSections.colors && handlePaletteChange(id)}
                      disabled={!enabledSections.colors}
                    >
                      <div className="flex h-full overflow-hidden rounded-md">
                        {palette.colors.map((color, index) => (
                          <div
                            key={index}
                            className="h-full flex-1"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-[2px] px-2 py-0.5 rounded text-[11px] font-medium text-slate-800 shadow-sm transition-all group-hover:scale-110 group-hover:bottom-2.5">
                        {palette.name}
                      </span>
                    </button>
                  ))}

                  {/* Custom palette editor in the 4th column */}
                  <Popover>
                    <PopoverTrigger asChild disabled={!enabledSections.colors}>
                      <button
                        className={cn(
                          "h-16 rounded-lg transition-all duration-200 relative group overflow-hidden",
                          (settings.colors.type === "palette" && Array.isArray(settings.colors.color) && 
                           !Object.entries(colorPalettes).some(([, p]) => 
                            JSON.stringify(p.colors) === JSON.stringify(settings.colors.color))) ||
                          (settings.colors.type === 'anything' && previousValues.colors?.type === 'palette' && 
                           Array.isArray(previousValues.colors?.color) && 
                           !Object.entries(colorPalettes).some(([, p]) => 
                            JSON.stringify(p.colors) === JSON.stringify(previousValues.colors?.color)))
                            ? "ring-2 ring-offset-2 ring-blue-600 scale-105 shadow-md z-10"
                            : "ring-1 ring-slate-200 hover:ring-blue-300 hover:scale-105 hover:shadow-sm"
                        )}
                        disabled={!enabledSections.colors}
                      >
                        <div className="flex h-full overflow-hidden rounded-md">
                          {Array.isArray(settings.colors.color) && settings.colors.type === "palette" ? 
                            settings.colors.color.slice(0, 3).map((color, index) => (
                              <div
                                key={index}
                                className="h-full flex-1"
                                style={{ backgroundColor: color }}
                              />
                            )) : 
                            settings.colors.type === 'anything' && previousValues.colors?.type === 'palette' && 
                            Array.isArray(previousValues.colors?.color) ?
                            previousValues.colors.color.slice(0, 3).map((color, index) => (
                              <div
                                key={index}
                                className="h-full flex-1"
                                style={{ backgroundColor: color }}
                              />
                            )) :
                            <div className="h-full w-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500" />
                          }
                        </div>
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-[2px] px-2 py-0.5 rounded text-[11px] font-medium text-slate-800 shadow-sm transition-all group-hover:scale-110 group-hover:bottom-2.5">
                          Custom
                        </span>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-4 bg-white rounded-lg border border-slate-200 shadow-lg">
                      <div className="space-y-3">
                        <h4 className="text-xs font-medium text-slate-700">Edit Custom Palette</h4>
                        
                        {/* Simplified UI with direct color pickers */}
                        <div className="flex gap-2 justify-between">
                          {Array.isArray(settings.colors.color) ? 
                            settings.colors.color.map((color, index) => (
                              <div key={index} className="flex-1">
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <button
                                      className="h-16 w-full rounded-md transition-all ring-1 ring-slate-200 hover:ring-blue-300 relative group overflow-hidden shadow-sm"
                                      style={{ backgroundColor: color }}
                                    >
                                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="bg-white/70 backdrop-blur-[2px] rounded-full p-1.5 shadow-sm">
                                          <Palette className="w-4 h-4 text-blue-700" />
                                        </div>
                                      </div>
                                    </button>
                                  </PopoverTrigger>
                                  <PopoverContent side="top" className="w-auto p-3">
                                    <div className="space-y-3">
                                      <HexColorPicker
                                        color={color}
                                        onChange={(newColor) => updateCustomPaletteColor(index, newColor)}
                                        className="w-48 !h-48"
                                      />
                                      <div className="pt-2 border-t border-slate-100 text-center">
                                        <span className="text-xs font-medium text-slate-600">{color.toUpperCase()}</span>
                                      </div>
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              </div>
                            )) : 
                            <div className="text-sm text-slate-500">No colors defined</div>
                          }
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Design Controls - Improved section */}
        <div className="space-y-4">
          <div className="mb-4 flex items-center justify-between">
            <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2.5 py-1 rounded">
              Design Controls
            </span>
            <div className="flex items-center gap-2">
              {!enabledSections.controls && <AnythingBadge />}
              <Switch
                checked={enabledSections.controls}
                onCheckedChange={() => toggleSection('controls')}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>
          </div>
          
          {/* Enhanced controls UI */}
          <div className={cn(
            "transition-all duration-300 space-y-5",
            !enabledSections.controls && "opacity-50 pointer-events-none saturate-50"
          )}>
            <ToggleGroup
              type="single"
              value={activeControl}
              onValueChange={(value) => {
                if (value && enabledSections.controls) setActiveControl(value as "creativity" | "detail");
              }}
              className="flex bg-slate-50 p-1 rounded-lg border border-slate-200 mb-2"
            >
              <ToggleGroupItem
                value="creativity"
                className={cn(
                  "flex-1 rounded-md py-2.5 text-sm font-medium transition-all",
                  activeControl === "creativity" && enabledSections.controls 
                    ? "!bg-blue-600 !text-white shadow-md" 
                    : "hover:bg-slate-100"
                )}
              >
                Creativity
              </ToggleGroupItem>
              <ToggleGroupItem
                value="detail"
                className={cn(
                  "flex-1 rounded-md py-2.5 text-sm font-medium transition-all",
                  activeControl === "detail" && enabledSections.controls 
                    ? "!bg-blue-600 !text-white shadow-md" 
                    : "hover:bg-slate-100"
                )}
              >
                Detail
              </ToggleGroupItem>
            </ToggleGroup>

            {/* Improved slider UI with better visual feedback */}
            {activeControl === "creativity" && (
              <div className="space-y-4 bg-gradient-to-br from-slate-50 to-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-slate-600 font-medium">Conservative</span>
                  </div>
                  <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200">
                    {typeof settings.controls.creativity === "number" ? `${settings.controls.creativity}%` : "Anything"}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-slate-600 font-medium">Creative</span>
                  </div>
                </div>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={[typeof settings.controls.creativity === "number" ? settings.controls.creativity : 100]}
                  onValueChange={(values) => handleControlChange("creativity", values[0])}
                  disabled={settings.controls.creativity === "anything"}
                  className="mt-2"
                />
              </div>
            )}
            
            {activeControl === "detail" && (
              <div className="space-y-4 bg-gradient-to-br from-slate-50 to-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-slate-600 font-medium">Minimal</span>
                  </div>
                  <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200">
                    {typeof settings.controls.detail === "number" ? `${settings.controls.detail}%` : "Anything"}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-slate-600 font-medium">Detailed</span>
                  </div>
                </div>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={[typeof settings.controls.detail === "number" ? settings.controls.detail : 100]}
                  onValueChange={(values) => handleControlChange("detail", values[0])}
                  disabled={settings.controls.detail === "anything"}
                  className="mt-2"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Improved fixed button container at bottom */}
      <div className="px-4 py-5 border-t border-slate-200 bg-gradient-to-b from-slate-50 to-white">
        <Button
          variant="outline"
          className="w-full border-slate-300 bg-white rounded-lg flex items-center gap-2 justify-center hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 text-slate-700 h-12 font-medium transition-all shadow-sm"
          onClick={resetToDefaults}
        >
          <Rotate className="h-5 w-5 mr-1" iconPrimary="#1E3050" iconSecondary="#1E305030" />
          Reset to defaults
        </Button>
      </div>
    </div>
  );
};

export default LogoSidebar;

