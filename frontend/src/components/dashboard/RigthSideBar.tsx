import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  Image as ImageIcon,
  ArrowsRotate,
} from "../../../public/icons/SvgIcons";
import { cn } from "@/lib/utils";
import { LogoSettings } from "./sidebar";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";

// Constants for localStorage keys
const SETTINGS_STORAGE_KEY = "logo-generator-settings";
const DRAWING_STORAGE_KEY = "logo-generator-canvas";

const RightSideBar = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [promptText, setPromptText] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);

  // TanStack Query mutation
  const logoMutation = useMutation({
    mutationFn: async (generationData: any) => {
      const response = await api.post(
        `${process.env.NEXT_PUBLIC_API_URL}/ai/generate`,
        generationData
      );
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Logo generated successfully:", data);

      // Process the received base64 images
      if (Array.isArray(data) && data.length > 0) {
        // Ensure we're getting data URLs or convert plain base64 to data URLs
        const processedImages = data.map((imageData: string) => {
          // Check if it's already a complete data URL
          if (imageData.startsWith('data:image/')) {
            return imageData;
          }
          // Otherwise, it might be a raw base64 string, so add the correct prefix
          return `data:image/png;base64,${imageData}`;
        });
        
        setImages(processedImages);
        setHasGenerated(true);
      } else if (data.images && Array.isArray(data.images)) {
        // Alternative format - if the API returns {images: [...]}} structure
        const processedImages = data.images.map((imageData: string) => {
          if (imageData.startsWith('data:image/')) {
            return imageData;
          }
          return `data:image/png;base64,${imageData}`;
        });
        
        setImages(processedImages);
        setHasGenerated(true);
      } else {
        console.error("Unexpected data format received:", data);
      }
    },
    onError: (error) => {
      console.error("Error generating logo:", error);
    },
    onSettled: () => {
      setIsGenerating(false);
    },
  });

  // Handle prompt change without saving to localStorage
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPromptText(e.target.value);
  };

  // Function to collect all data and send it to the API
  const handleGenerate = async () => {
    setIsGenerating(true);

    try {
      // Get settings from localStorage
      const settingsJson = localStorage.getItem(SETTINGS_STORAGE_KEY);
      const settings: LogoSettings | null = settingsJson
        ? JSON.parse(settingsJson)
        : null;

      // Get drawing canvas data from localStorage - it's directly a PNG data URL
      const sketchPng = localStorage.getItem(DRAWING_STORAGE_KEY);

      // Collect all data
      const generationData = {
        prompt: promptText,
        settings: settings,
        sketch: sketchPng, // Send the PNG data URL directly
        timestamp: new Date().toISOString(),
      };

      // Use TanStack Query mutation to send the data
      logoMutation.mutate(generationData);
    } catch (error) {
      console.error("Error preparing generation data:", error);
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-[400px] rounded-2xl bg-white/90 backdrop-blur-sm border border-gray-100 shadow-xl h-full flex-shrink-0 flex flex-col py-6 overflow-y-auto transition-all duration-300 ease-in-out">
      {/* Section 1: Logo Viewer */}
      <div className="px-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-800 flex items-center">
            <span className="bg-blue-50 text-blue-600 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
              Preview
            </span>
            Logo Viewer
          </h3>
        </div>

        {/* Main image - now with smaller size */}
        <div className="mx-auto w-full h-[280px] relative aspect-square bg-gradient-to-br from-blue-50 to-white rounded-xl mb-5 overflow-hidden group shadow-md transition-all duration-300 hover:shadow-lg">
          {hasGenerated && images[selectedImage] ? (
            // When displaying base64 images, we need to use a different approach
            <div className="w-full h-full relative">
              <Image
                src={images[selectedImage]}
                alt="Generated logo preview"
                className="object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                fill
                sizes="400px"
                priority
                unoptimized={true} // Important for base64 images
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-blue-50">
              <div className="text-center">
                <ImageIcon className="w-16 h-16 text-blue-200 mx-auto" />
                <p className="text-blue-400 mt-3 text-sm">
                  {isGenerating
                    ? "Generating logos..."
                    : "Enter a prompt to generate logos"}
                </p>
              </div>
            </div>
          )}

          {/* Elegant overlay that appears on hover */}
          {hasGenerated && images[selectedImage] && (
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
              <span className="text-white text-sm font-medium backdrop-blur-sm bg-black/20 px-3 py-1 rounded-full">
                Logo Design {selectedImage + 1}
              </span>
            </div>
          )}
        </div>

        {/* Thumbnail images row with selection indicator */}
        {hasGenerated && images.length > 0 && (
          <div className="grid grid-cols-5 gap-2 w-full mx-auto">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={cn(
                  "aspect-square bg-gradient-to-br from-blue-50 to-white rounded-lg overflow-hidden transition-all duration-300 relative",
                  selectedImage === index
                    ? "ring-2 ring-blue-500 ring-offset-2 shadow-md"
                    : "hover:shadow-md"
                )}
              >
                <Image
                  src={image}
                  alt={`Logo ${index + 1}`}
                  className="object-cover"
                  fill
                  sizes="100px"
                  unoptimized={true} // Important for base64 images
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: Prompt Section with elegant styling */}
      <div className="px-6 mt-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-800 flex items-center">
            <span className="bg-blue-50 text-blue-600 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
              Create
            </span>
            Logo Generator
          </h3>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Textarea
              value={promptText}
              onChange={handlePromptChange}
              placeholder="Describe the logo you want to generate... (e.g., A minimalist tech logo with blue and green colors)"
              className="min-h-[120px] resize-none rounded-xl border-gray-200 bg-white/80 backdrop-blur-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-300"
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-400">
              Be descriptive for best results
            </div>
          </div>

          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            onClick={handleGenerate}
            disabled={isGenerating || !promptText.trim()}
          >
            {isGenerating ? (
              <>
                <ArrowsRotate className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                Generate Logo
                <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RightSideBar;
