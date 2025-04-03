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

// Removed AnythingBadge as it's no longer needed

// Updated LogoSettings interface with enabled properties
export interface LogoSettings {
  styles: {
    enabled: boolean;
    type: "2d" | "3d";  
    style: string;
  };
  colors: {
    enabled: boolean;
    type: "solid" | "palette";
    color: string | string[]; 
  };
  controls: {
    enabled: boolean;
    creativity: number;
    detail: number;
  };
  text: {
    enabled: boolean;
    value: string;
    previousValue?: string;
  };
  tagline: {  
    enabled: boolean;
    value: string;
    previousValue?: string;
  };
  background: {  
    enabled: boolean;
    type: "solid" | "palette";
    color: string | string[];
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

// Replace the separate Style2D and Style3D arrays with a single unified array
const logoStyles = [
  { value: "pictorial", label: "Pictorial", image: "/logos_styles/pictorial.png" },
  { value: "mascot", label: "Mascot", image: "/logos_styles/mascot.png" },
  { value: "badgeCrest", label: "Badge Crest", image: "/logos_styles/badgeCrest.png" },
  { value: "cartoon", label: "Cartoon", image: "/logos_styles/cartoon.png" },
  { value: "abstract", label: "Abstract", image: "/logos_styles/abstract.png" },
  { value: "line", label: "Line", image: "/logos_styles/line.png" },
  { value: "pixel", label: "Pixel", image: "/logos_styles/pixel.png" },
  { value: "comic", label: "Comic", image: "/logos_styles/comic.png" },
  { value: "manga", label: "Realistic", image: "/logos_styles/manga.png" },
  { value: "watercolor", label: "Watercolor", image: "/logos_styles/watercolor.png" },
  { value: "pop", label: "Pop", image: "/logos_styles/pop.png" },
  { value: "illustration", label: "Illustration", image: "/logos_styles/illustration.png" }
];

// Updated default settings with enabled properties
const defaultSettings: LogoSettings = {
  styles: {
    enabled: true,
    type: "2d",
    style: "abstract",
  },
  colors: {
    enabled: false,
    type: "solid",
    color: "#4F46E5"
  },
  controls: {
    enabled: true,
    creativity: 10,
    detail: 10,
  },
  text: {
    enabled: false,
    value: "Your Logo Name"
  },
  tagline: {
    enabled: false,
    value: "Your Logo tagline"
  },
  background: {
    enabled: false,
    type: "solid",
    color: "#FFFFFF"
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
  const [isCustomBgColorSelected, setIsCustomBgColorSelected] = useState<boolean>(false);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem(STORAGE_KEY);
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings) as Partial<LogoSettings>;
        
        // Merge with defaults to ensure all properties exist
        const mergedSettings = {
          ...defaultSettings,
          ...parsedSettings,
          // Ensure nested objects don't get lost
          styles: { ...defaultSettings.styles, ...(parsedSettings.styles || {}) },
          colors: { ...defaultSettings.colors, ...(parsedSettings.colors || {}) },
          controls: { ...defaultSettings.controls, ...(parsedSettings.controls || {}) },
          text: { ...defaultSettings.text, ...(parsedSettings.text || {}) },
          tagline: { ...defaultSettings.tagline, ...(parsedSettings.tagline || {}) },
          background: { ...defaultSettings.background, ...(parsedSettings.background || {}) }
        };
        
        setSettings(mergedSettings);
        
        // Check if the color is custom
        if (mergedSettings.colors.type === "solid") {
          const color = mergedSettings.colors.color as string;
          setIsCustomColorSelected(!colorOptions.some(option => option.value === color));
        }
        
        // Check if background color is custom
        if (mergedSettings.background.type === "solid") {
          const bgColor = mergedSettings.background.color as string;
          setIsCustomBgColorSelected(!colorOptions.some(option => option.value === bgColor));
        }
        
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
    if (type === "2d" && !logoStyles.some(s => s.value === settings.styles.style)) {
      newStyle = "geometric"; // Default 2D style
    } else if (type === "3d" && !logoStyles.some(s => s.value === settings.styles.style)) {
      newStyle = "realistic_3d"; // Default 3D style
    }
    
    setSettings({
      ...settings,
      styles: {
        ...settings.styles,
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
          ...settings.colors,
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
          ...settings.colors,
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
        ...settings.colors,
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
    let selectedColors: string[];
    
    if (paletteId in colorPalettes) {
      selectedColors = [...colorPalettes[paletteId].colors];
    } else {
      // Default colors if palette not found
      selectedColors = ["#F97316", "#FBBF24", "#DC2626"];
    }
    
    setSettings({
      ...settings,
      colors: {
        ...settings.colors,
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
        ...settings.colors,
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
    setIsCustomColorSelected(false);
    setIsCustomBgColorSelected(false);
  };

  // Handle tagline change
  const handleTaglineChange = (value: string) => {
    setSettings({
      ...settings,
      tagline: {
        ...settings.tagline,
        value: value
      }
    });
  };
  
  // Handle background color change
  const handleBackgroundColorChange = (color: string) => {
    setSettings({
      ...settings,
      background: {
        ...settings.background,
        type: "solid",
        color: color
      }
    });
    
    // Determine if this is a custom color
    const isPredefined = colorOptions.some(option => option.value === color);
    setIsCustomBgColorSelected(!isPredefined);
  };

  // Handle background palette change
  const handleBackgroundPaletteChange = (paletteId: string) => {
    let selectedColors: string[];
    
    if (paletteId in colorPalettes) {
      selectedColors = [...colorPalettes[paletteId].colors];
    } else {
      // Default colors if palette not found
      selectedColors = ["#F97316", "#FBBF24", "#DC2626"];
    }
    
    setSettings({
      ...settings,
      background: {
        ...settings.background,
        type: "palette",
        color: selectedColors
      }
    });
  };

  // Update custom background palette color
  const updateCustomBackgroundColor = (index: number, color: string) => {
    // Ensure we have an array
    const currentColors = Array.isArray(settings.background.color) ? 
      [...settings.background.color] : 
      ["#F97316", "#FBBF24", "#DC2626"];
    
    currentColors[index] = color;
    
    setSettings({
      ...settings,
      background: {
        ...settings.background,
        type: "palette",
        color: currentColors
      }
    });
  };
  
  // Handle background type change
  const handleBackgroundTypeChange = (type: "solid" | "palette") => {
    if (type === "palette" && typeof settings.background.color === "string") {
      setSettings({
        ...settings,
        background: {
          ...settings.background,
          type,
          color: [settings.background.color, "#FBBF24", "#DC2626"]
        }
      });
    } else if (type === "solid" && Array.isArray(settings.background.color)) {
      setSettings({
        ...settings,
        background: {
          ...settings.background,
          type,
          color: settings.background.color[0]
        }
      });
    } else {
      setSettings({
        ...settings,
        background: {
          ...settings.background,
          type
        }
      });
    }
  };

  // Simplified toggleSection function - just toggles the enabled property
  const toggleSection = (section: 'styles' | 'colors' | 'controls' | 'text' | 'tagline' | 'background') => {
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        enabled: !settings[section].enabled,
      }
    });
  };

  // Handle text change - allow empty values
  const handleTextChange = (value: string) => {
    setSettings({
      ...settings,
      text: {
        ...settings.text,
        value: value // Allow empty string, no default
      }
    });
  };


  return (
    <div className="w-full h-full flex flex-col overflow-auto bg-white border border-blue-100 xl:rounded-2xl">
      <div className="p-6 flex-grow pb-20 space-y-10"> {/* Adjusted spacing between sections */}
        {/* Text Section - Now appears first */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2.5 py-1 rounded">
              Text
            </span>
            <div className="flex items-center gap-2">
              <Switch
                checked={settings.text.enabled}
                onCheckedChange={() => toggleSection('text')}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>
          </div>
          
          {/* Text input field */}
          <div className={cn(
            "transition-all duration-300 space-y-5",
            !settings.text.enabled && "opacity-40 saturate-[0.6] cursor-not-allowed"
          )}>
            <div className="relative">
              <input
                type="text"
                value={settings.text.value}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder="Enter logo text (default: My Logo Name)"
                disabled={!settings.text.enabled}
                className={cn(
                  "w-full p-3 bg-white border border-slate-200 rounded-lg text-sm transition-all",
                  settings.text.enabled ? "hover:border-blue-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100" : ""
                )}
              />
            </div>
            <div className="text-xs text-slate-500">
              {settings.text.enabled 
                ? `This text will appear on your logo${!settings.text.value ? " (using default if empty)" : ""}`
                : "Text is disabled"}
            </div>
          </div>
        </div>
        
        {/* Tagline Section - Appears after the text section */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2.5 py-1 rounded">
              Tagline
            </span>
            <div className="flex items-center gap-2">
              <Switch
                checked={settings.tagline.enabled}
                onCheckedChange={() => toggleSection('tagline')}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>
          </div>
          
          {/* Tagline input field */}
          <div className={cn(
            "transition-all duration-300 space-y-5",
            !settings.tagline.enabled && "opacity-40 saturate-[0.6] cursor-not-allowed"
          )}>
            <div className="relative">
              <input
                type="text"
                value={settings.tagline.value}
                onChange={(e) => handleTaglineChange(e.target.value)}
                placeholder="Enter tagline (e.g., Your brand tagline)"
                disabled={!settings.tagline.enabled}
                className={cn(
                  "w-full p-3 bg-white border border-slate-200 rounded-lg text-sm transition-all",
                  settings.tagline.enabled ? "hover:border-blue-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100" : ""
                )}
              />
            </div>
            <div className="text-xs text-slate-500">
              {settings.tagline.enabled 
                ? "This tagline will appear below your main logo text"
                : "Tagline is disabled"}
            </div>
          </div>
        </div>
        
        {/* Styles Section */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2.5 py-1 rounded">
              Styles
            </span>
            <div className="flex items-center gap-2">
              <Switch
                checked={settings.styles.enabled}
                onCheckedChange={() => toggleSection('styles')}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>
          </div>
          
          <div className={cn(
            "transition-all duration-300 space-y-5",
            !settings.styles.enabled && "opacity-40 saturate-[0.6] cursor-not-allowed"
          )}>
            <ToggleGroup
              type="single"
              value={settings.styles.type}
              onValueChange={(value) => {
                if (value && settings.styles.enabled) handleStyleTypeChange(value as "2d" | "3d");
              }}
              className="flex bg-slate-50 p-1 rounded-lg border border-slate-200"
            >
              <ToggleGroupItem
                value="2d"
                className={cn(
                  "flex-1 rounded-md py-2.5 text-sm font-medium transition-all",
                  settings.styles.type === "2d" && settings.styles.enabled 
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
                  settings.styles.type === "3d" && settings.styles.enabled 
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
              disabled={!settings.styles.enabled}
            >
              <SelectTrigger className="w-full bg-white border border-slate-200 hover:border-blue-300 focus:ring-blue-300 transition-all">
                <div className="flex items-center gap-3">
                  {(() => {
                    const selectedStyle = logoStyles.find(
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
                  {logoStyles.map((style) =>
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

        {/* Colors Section */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2.5 py-1 rounded">
              Colors
            </span>
            <div className="flex items-center gap-2">
              <Switch
                checked={settings.colors.enabled}
                onCheckedChange={() => toggleSection('colors')}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>
          </div>
          
          <div className={cn(
            "space-y-5",
            !settings.colors.enabled && "opacity-40 saturate-[0.6] cursor-not-allowed"
          )}>
            <ToggleGroup
              type="single"
              value={settings.colors.type}
              onValueChange={(value) => {
                if (value && settings.colors.enabled) handleColorTypeChange(value as "solid" | "palette");
              }}
              className="flex bg-slate-50 p-1 rounded-lg border border-slate-200"
            >
              <ToggleGroupItem
                value="solid"
                className={cn(
                  "flex-1 rounded-md py-2.5 text-sm font-medium transition-all",
                  settings.colors.type === "solid" && settings.colors.enabled 
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
                  settings.colors.type === "palette" && settings.colors.enabled 
                    ? "!bg-blue-600 !text-white shadow-md" 
                    : "hover:bg-slate-100"
                )}
              >
                Color Palette
              </ToggleGroupItem>
            </ToggleGroup>

            {/* Solid Color Selection */}
            {settings.colors.type === "solid" && (
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-3">
                  {colorOptions.map((preset) => (
                    <button
                      key={preset.value}
                      className={cn(
                        "h-16 rounded-lg transition-all duration-200 relative group overflow-hidden",
                        settings.colors.color === preset.value
                          ? "ring-2 ring-offset-2 ring-blue-600 scale-105 shadow-md z-10"
                          : "ring-1 ring-slate-200 hover:ring-blue-300 hover:scale-105 hover:shadow-sm"
                      )}
                      style={{ backgroundColor: preset.value }}
                      onClick={() => settings.colors.enabled && handleSolidColorChange(preset.value)}
                      aria-label={`Select ${preset.label} color`}
                      disabled={!settings.colors.enabled}
                    >
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 to-black/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </button>
                  ))}

                  <Popover>
                    <PopoverTrigger asChild disabled={!settings.colors.enabled}>
                      <button
                        className={cn(
                          "h-16 rounded-lg transition-all duration-200 relative overflow-hidden group",
                          isCustomColorSelected
                            ? "ring-2 ring-offset-2 ring-blue-600 scale-105 shadow-md z-10"
                            : "ring-1 ring-slate-200 hover:ring-blue-300 hover:scale-105 hover:shadow-sm"
                        )}
                        style={{ 
                          backgroundColor: isCustomColorSelected && typeof settings.colors.color === 'string'
                            ? settings.colors.color 
                            : undefined
                        }}
                        aria-label="Select custom color"
                        disabled={!settings.colors.enabled}
                      >
                        <div
                          className={cn(
                            "w-full h-full flex items-center justify-center absolute inset-0",
                            !isCustomColorSelected ? "bg-gradient-to-br from-blue-600 via-purple-500 to-pink-500" : ""
                          )}
                        >
                          {!isCustomColorSelected && (
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

            {/* Palette Selection */}
            {settings.colors.type === "palette" && (
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-3">
                  {Object.entries(colorPalettes).slice(0, 3).map(([id, palette]) => (
                    <button
                      key={id}
                      className={cn(
                        "h-16 rounded-lg transition-all duration-200 relative group overflow-hidden",
                        Array.isArray(settings.colors.color) && 
                         JSON.stringify(settings.colors.color) === JSON.stringify(palette.colors)
                          ? "ring-2 ring-offset-2 ring-blue-600 scale-105 shadow-md z-10"
                          : "ring-1 ring-slate-200 hover:ring-blue-300 hover:scale-105 hover:shadow-sm"
                      )}
                      onClick={() => settings.colors.enabled && handlePaletteChange(id)}
                      disabled={!settings.colors.enabled}
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

                  <Popover>
                    <PopoverTrigger asChild disabled={!settings.colors.enabled}>
                      <button
                        className={cn(
                          "h-16 rounded-lg transition-all duration-200 relative group overflow-hidden",
                          Array.isArray(settings.colors.color) && 
                           !Object.entries(colorPalettes).some(([, p]) => 
                            JSON.stringify(p.colors) === JSON.stringify(settings.colors.color))
                            ? "ring-2 ring-offset-2 ring-blue-600 scale-105 shadow-md z-10"
                            : "ring-1 ring-slate-200 hover:ring-blue-300 hover:scale-105 hover:shadow-sm"
                        )}
                        disabled={!settings.colors.enabled}
                      >
                        <div className="flex h-full overflow-hidden rounded-md">
                          {Array.isArray(settings.colors.color) ? 
                            settings.colors.color.slice(0, 3).map((color, index) => (
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

        {/* Background Section */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2.5 py-1 rounded">
              Background
            </span>
            <div className="flex items-center gap-2">
              <Switch
                checked={settings.background.enabled}
                onCheckedChange={() => toggleSection('background')}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>
          </div>
          
          <div className={cn(
            "space-y-5",
            !settings.background.enabled && "opacity-40 saturate-[0.6] cursor-not-allowed"
          )}>
            <ToggleGroup
              type="single"
              value={settings.background.type}
              onValueChange={(value) => {
                if (value && settings.background.enabled) handleBackgroundTypeChange(value as "solid" | "palette");
              }}
              className="flex bg-slate-50 p-1 rounded-lg border border-slate-200"
            >
              <ToggleGroupItem
                value="solid"
                className={cn(
                  "flex-1 rounded-md py-2.5 text-sm font-medium transition-all",
                  settings.background.type === "solid" && settings.background.enabled 
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
                  settings.background.type === "palette" && settings.background.enabled 
                    ? "!bg-blue-600 !text-white shadow-md" 
                    : "hover:bg-slate-100"
                )}
              >
                Color Palette
              </ToggleGroupItem>
            </ToggleGroup>

            {/* Solid Background Color Selection */}
            {settings.background.type === "solid" && (
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-3">
                  {colorOptions.map((preset) => (
                    <button
                      key={preset.value}
                      className={cn(
                        "h-16 rounded-lg transition-all duration-200 relative group overflow-hidden",
                        settings.background.color === preset.value
                          ? "ring-2 ring-offset-2 ring-blue-600 scale-105 shadow-md z-10"
                          : "ring-1 ring-slate-200 hover:ring-blue-300 hover:scale-105 hover:shadow-sm"
                      )}
                      style={{ backgroundColor: preset.value }}
                      onClick={() => settings.background.enabled && handleBackgroundColorChange(preset.value)}
                      aria-label={`Select ${preset.label} background color`}
                      disabled={!settings.background.enabled}
                    >
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 to-black/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </button>
                  ))}

                  <Popover>
                    <PopoverTrigger asChild disabled={!settings.background.enabled}>
                      <button
                        className={cn(
                          "h-16 rounded-lg transition-all duration-200 relative overflow-hidden group",
                          isCustomBgColorSelected && typeof settings.background.color === 'string'
                            ? "ring-2 ring-offset-2 ring-blue-600 scale-105 shadow-md z-10"
                            : "ring-1 ring-slate-200 hover:ring-blue-300 hover:scale-105 hover:shadow-sm"
                        )}
                        style={{ 
                          backgroundColor: isCustomBgColorSelected && typeof settings.background.color === 'string'
                            ? settings.background.color 
                            : undefined
                        }}
                        aria-label="Select custom background color"
                        disabled={!settings.background.enabled}
                      >
                        <div
                          className={cn(
                            "w-full h-full flex items-center justify-center absolute inset-0",
                            !isCustomBgColorSelected ? "bg-gradient-to-br from-blue-600 via-purple-500 to-pink-500" : ""
                          )}
                        >
                          {!isCustomBgColorSelected && (
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
                          color={isCustomBgColorSelected && typeof settings.background.color === 'string' ? 
                            settings.background.color : "#FFFFFF"}
                          onChange={(color) => {
                            handleBackgroundColorChange(color);
                            setIsCustomBgColorSelected(true);
                          }}
                          className="w-48 !h-48"
                        />
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <div className="h-8 w-12 rounded-md border border-slate-200 shadow-sm" 
                               style={{ backgroundColor: isCustomBgColorSelected && typeof settings.background.color === 'string' ? 
                                 settings.background.color : "#FFFFFF" }} />
                          <span className="text-sm font-medium text-slate-700">
                            {isCustomBgColorSelected && typeof settings.background.color === 'string' ? 
                              settings.background.color.toUpperCase() : "#FFFFFF"}
                          </span>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}

            {/* Background Palette Selection */}
            {settings.background.type === "palette" && (
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-3">
                  {Object.entries(colorPalettes).slice(0, 3).map(([id, palette]) => (
                    <button
                      key={id}
                      className={cn(
                        "h-16 rounded-lg transition-all duration-200 relative group overflow-hidden",
                        Array.isArray(settings.background.color) && 
                        JSON.stringify(settings.background.color) === JSON.stringify(palette.colors)
                          ? "ring-2 ring-offset-2 ring-blue-600 scale-105 shadow-md z-10"
                          : "ring-1 ring-slate-200 hover:ring-blue-300 hover:scale-105 hover:shadow-sm"
                      )}
                      onClick={() => settings.background.enabled && handleBackgroundPaletteChange(id)}
                      disabled={!settings.background.enabled}
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

                  <Popover>
                    <PopoverTrigger asChild disabled={!settings.background.enabled}>
                      <button
                        className={cn(
                          "h-16 rounded-lg transition-all duration-200 relative group overflow-hidden",
                          Array.isArray(settings.background.color) && 
                          !Object.entries(colorPalettes).some(([, p]) => 
                            JSON.stringify(p.colors) === JSON.stringify(settings.background.color))
                            ? "ring-2 ring-offset-2 ring-blue-600 scale-105 shadow-md z-10"
                            : "ring-1 ring-slate-200 hover:ring-blue-300 hover:scale-105 hover:shadow-sm"
                        )}
                        disabled={!settings.background.enabled}
                      >
                        <div className="flex h-full overflow-hidden rounded-md">
                          {Array.isArray(settings.background.color) ? 
                            settings.background.color.slice(0, 3).map((color, index) => (
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
                        <h4 className="text-xs font-medium text-slate-700">Edit Background Palette</h4>
                        
                        <div className="flex gap-2 justify-between">
                          {Array.isArray(settings.background.color) ? 
                            settings.background.color.map((color, index) => (
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
                                        onChange={(newColor) => updateCustomBackgroundColor(index, newColor)}
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
            
            <div className="text-xs text-slate-500">
              {settings.background.enabled 
                ? "Choose a background color or gradient for your logo"
                : "Background is disabled (transparent)"}
            </div>
          </div>
        </div>

        {/* Design Controls */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2.5 py-1 rounded">
              Design Controls
            </span>
            <div className="flex items-center gap-2">
              <Switch
                checked={settings.controls.enabled}
                onCheckedChange={() => toggleSection('controls')}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>
          </div>
          
          <div className={cn(
            "transition-all duration-300 space-y-5",
            !settings.controls.enabled && "opacity-40 saturate-[0.6] cursor-not-allowed"
          )}>
            <ToggleGroup
              type="single"
              value={activeControl}
              onValueChange={(value) => {
                if (value && settings.controls.enabled) setActiveControl(value as "creativity" | "detail");
              }}
              className="flex bg-slate-50 p-1 rounded-lg border border-slate-200 mb-3"
            >
              <ToggleGroupItem
                value="creativity"
                className={cn(
                  "flex-1 rounded-md py-2.5 text-sm font-medium transition-all",
                  activeControl === "creativity" && settings.controls.enabled 
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
                  activeControl === "detail" && settings.controls.enabled 
                    ? "!bg-blue-600 !text-white shadow-md" 
                    : "hover:bg-slate-100"
                )}
              >
                Detail
              </ToggleGroupItem>
            </ToggleGroup>

            <div className={cn(
              activeControl === "creativity" ? "block" : "hidden",
              "space-y-4 bg-gradient-to-br from-slate-50 to-white p-5 rounded-lg border border-slate-200 shadow-sm"
            )}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-xs text-slate-600 font-medium">Conservative</span>
                </div>
                <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200">
                  {settings.controls.creativity}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-slate-600 font-medium">Creative</span>
                </div>
              </div>
              <Slider
                min={0}
                max={10}
                step={1}
                value={[settings.controls.creativity]}
                onValueChange={(values) => handleControlChange("creativity", values[0])}
                disabled={!settings.controls.enabled}
                className="mt-2"
              />
            </div>
            
            <div className={cn(
              activeControl === "detail" ? "block" : "hidden",
              "space-y-4 bg-gradient-to-br from-slate-50 to-white p-5 rounded-lg border border-slate-200 shadow-sm"
            )}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-xs text-slate-600 font-medium">Minimal</span>
                </div>
                <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200">
                  {settings.controls.detail}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-slate-600 font-medium">Detailed</span>
                </div>
              </div>
              <Slider
                min={0}
                max={10}
                step={1}
                value={[settings.controls.detail]}
                onValueChange={(values) => handleControlChange("detail", values[0])}
                disabled={!settings.controls.enabled}
                className="mt-2"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 border-t border-slate-200 bg-gradient-to-b from-slate-50 to-white">
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
