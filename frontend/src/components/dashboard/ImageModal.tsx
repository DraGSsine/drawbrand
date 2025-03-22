import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X, Download, PenNib, Pen } from "../../../public/icons/SvgIcons";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string | null;
}

const ImageModal = ({ isOpen, onClose, imageSrc }: ImageModalProps) => {
  if (!imageSrc) return null;

  // Download image function
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imageSrc;
    link.download = `logo-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 border-none max-w-3xl bg-transparent shadow-none">
        <DialogTitle className="sr-only">Logo Preview</DialogTitle>
        <div className="relative rounded-lg overflow-hidden bg-white shadow-xl">
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-2 right-2 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md"
          >
            <X className="h-5 w-5 text-gray-700" />
          </button>
          
          {/* Action buttons */}
          <div className="absolute top-2 left-2 z-10 flex space-x-2">
            {/* Customize button */}
            <button
              className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center hover:bg-white"
              title="Customize Logo"
            >
              <PenNib className="h-5 w-5 text-blue-600" />
            </button>
            
            {/* Download button */}
            <button
              onClick={handleDownload}
              className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center hover:bg-white"
              title="Download Logo"
            >
              <Download className="h-5 w-5 text-green-600" />
            </button>
          </div>
          
          {/* Image container with proper sizing and centering */}
          <div className="bg-white p-6 flex items-center justify-center" style={{ minHeight: "400px" }}>
            <img 
              src={imageSrc} 
              alt="Logo preview" 
              className="max-w-full max-h-[80vh] object-contain"
              style={{ display: "block" }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;
