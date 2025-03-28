import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import {
  Image as ImageIcon,
  RotateReverse,
  Sparkles,
} from "../../../public/icons/SvgIcons";
import { api } from "@/lib/axios";
import ImageModal from "./ImageModal";
import Image from "next/image";

// Constants for localStorage keys
const SETTINGS_STORAGE_KEY = "logo-generator-settings";
const DRAWING_STORAGE_KEY = "logo-generator-canvas";

type LogoSettings = {
  styles?: {
    type?: string;
    style?: string;
  };
  colors?: {
    color?: string;
  };
  controls?: {
    creativity?: number;
    detail?: number;
  };
  [key: string]: Record<string, unknown> | undefined
};

interface RightSideBarProps {
  onImageClick?: (imageSrc: string) => void;
}

const RightSideBar = ({ onImageClick }: RightSideBarProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [promptText, setPromptText] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);

  // Add these two lines for modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState<string | null>(null);


  // TanStack Query mutation with real API call
  const logoMutation = useMutation({
    mutationFn: async (generationData: {
      prompt: string;
      settings: LogoSettings | null;
      sketch: string | null;
      timestamp: string
    }) => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await api.post(`${apiUrl}/ai/generate`, generationData);
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Logo generation response:", data);

      // Handle different possible response formats
      if (Array.isArray(data) && data.length > 0) {
        // Response is directly an array of base64 images
        const processedImages = data.map((imageData: string) => {
          if (imageData.startsWith('data:image/')) {
            return imageData;
          }
          return `data:image/png;base64,${imageData}`;
        });
        setImages(processedImages);
        setHasGenerated(true);
      } else if (data.images && Array.isArray(data.images)) {
        // Response has an images property that is an array
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
      setIsGenerating(false);
    },
    onSettled: () => {
      setIsGenerating(false);
    },
  });

  // Handle prompt change
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

      // Get drawing canvas data from localStorage
      const sketchPng = localStorage.getItem(DRAWING_STORAGE_KEY);

      // Collect all data
      const generationData = {
        prompt: promptText,
        settings: settings,
        sketch: sketchPng,
        timestamp: new Date().toISOString(),
      };

      // Use TanStack Query mutation to send the data
      logoMutation.mutate(generationData);
    } catch (error) {
      console.error("Error preparing generation data:", error);
      setIsGenerating(false);
    }
  };

  // Handle image click if the callback is provided
  const handleImageClick = (image: string) => {
    // Set modal image and open the modal
    setModalImageSrc(image);
    setIsModalOpen(true);

    // Also call the external onImageClick if provided
    if (onImageClick) {
      onImageClick(image);
    }
  };

  return (
    <div className="w-full h-full bg-white rounded-2xl border border-blue-100 flex flex-col overflow-hidden shadow-sm">
      {/* Add ImageModal component */}
      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        imageSrc={modalImageSrc}
      />

      {/* Preview Section */}
      <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 flex-1 overflow-y-auto">
        <div className="mb-3 md:mb-4 flex items-center">
          <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-0.5 md:px-2.5 md:py-1 rounded">
            Preview
          </span>
        </div>

        {/* Loading state with blob animation */}
        {isGenerating && (
          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4">
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="relative aspect-square bg-blue-50 rounded-lg overflow-hidden">
                <Skeleton variant="blob" className="w-full h-full" />
              </div>
            ))}
          </div>
        )}

        {/* Results grid - 2x2 layout */}
        {!isGenerating && hasGenerated && (
          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4">
            {images.slice(0, 4).map((image, index) => (
              <div
                key={index}
                className={cn(
                  "group aspect-square bg-white rounded-lg overflow-hidden border transition-all cursor-pointer hover:shadow-md",
                  selectedImage === index
                    ? "ring-2 ring-blue-600 border-blue-600"
                    : "border-gray-200 hover:border-blue-200"
                )}
                onClick={() => {
                  setSelectedImage(index);
                  handleImageClick(image);
                }}
              >
                <div className="relative w-full h-full">
                  <Image
                    width={200}
                    height={200}
                    src={image}
                    alt={`Logo ${index + 1}`}
                    className="w-full h-full object-contain p-2"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-200"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isGenerating && !hasGenerated && (
          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4">
            {[1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className="aspect-square bg-blue-50 rounded-lg flex flex-col items-center justify-center p-2 sm:p-3 md:p-4 border border-dashed border-blue-200"
              >
                <ImageIcon className="w-6 h-6 md:w-8 md:h-8 text-blue-200 mb-1 md:mb-2" />
                <span className="text-[10px] sm:text-xs text-blue-300 text-center">
                  Generated logo will appear here
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Prompt Section */}
      <div className="p-3 sm:p-4 md:p-6 border-t border-blue-100 bg-gray-50">
        <div className="mb-3 md:mb-4 flex items-center">
          <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-0.5 md:px-2.5 md:py-1 rounded">
            Create
          </span>
        </div>

        <div className="space-y-3 md:space-y-4">
          <div className="relative">
            <Textarea
              value={promptText}
              onChange={handlePromptChange}
              placeholder="Describe the logo you want to generate..."
              className="min-h-[80px] md:min-h-[100px] text-sm md:text-base resize-none rounded-lg border-gray-200 bg-white focus:border-blue-400 focus:ring-blue-100 text-gray-800"
            />
            <div className="absolute bottom-2 md:bottom-3 right-2 md:right-3 text-[10px] md:text-xs text-gray-400 flex items-center">
              <Sparkles className="w-2.5 h-2.5 md:w-3 md:h-3 mr-1" />
              Be descriptive for best results
            </div>
          </div>

          <Button
            className={cn(
              "w-full font-medium py-1.5 md:py-2 rounded-lg transition-all flex items-center justify-center gap-1 md:gap-2 text-sm md:text-base",
              isGenerating || !promptText.trim()
                ? "bg-blue-400 hover:bg-blue-400 text-white/80 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            )}
            onClick={handleGenerate}
            disabled={isGenerating || !promptText.trim()}
          >
            {isGenerating ? (
              <>
                <RotateReverse className="w-4 h-4 md:w-5 md:h-5 animate-spin" /> Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 md:w-5 md:h-5" /> Generate Logos
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

const Skeleton = ({
  variant,
  className,
}: {
  variant: "blob";
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
        variant === "blob" && "aspect-square rounded-lg bg-blue-100",
        className
      )}
    />
  );
};

export default RightSideBar;
