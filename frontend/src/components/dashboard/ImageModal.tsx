import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X, Download, PenNib, Share } from "../../../public/icons/SvgIcons";
import { motion } from "framer-motion";

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

  // Share image function
  const handleShare = async () => {
    try {
      // Convert the data URL to a blob
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      
      // If Web Share API is available
      if (navigator.share) {
        const file = new File([blob], `logo-${Date.now()}.png`, { type: 'image/png' });
        await navigator.share({
          title: 'My Generated Logo',
          text: 'Check out this logo I created with AI',
          files: [file]
        });
      } else {
        // Fallback for browsers without Web Share API
        handleDownload();
      }
    } catch (error) {
      console.error('Error sharing the image', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 border-none max-w-3xl bg-transparent shadow-none">
        <DialogTitle className="sr-only">Logo Preview</DialogTitle>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative rounded-xl overflow-hidden bg-white shadow-xl"
        >
          {/* Close button */}
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-3 right-3 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
          >
            <X className="h-5 w-5 text-gray-700" />
          </motion.button>
          
          {/* Action buttons */}
          <div className="absolute top-3 left-3 z-10 flex space-x-2">
            {/* Customize button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center hover:bg-white transition-colors"
              title="Customize Logo"
            >
              <PenNib className="h-5 w-5 text-blue-600" />
            </motion.button>
            
            {/* Download button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleDownload}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center hover:bg-white transition-colors"
              title="Download Logo"
            >
              <Download className="h-5 w-5 text-green-600" />
            </motion.button>

            {/* Share button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleShare}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center hover:bg-white transition-colors"
              title="Share Logo"
            >
              <Share className="h-5 w-5 text-purple-600" />
            </motion.button>
          </div>
          
          {/* Image container with proper sizing and centering */}
          <div className="bg-[#f8f9fa] flex items-center justify-center p-6" style={{ minHeight: "400px" }}>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="relative max-w-full max-h-[70vh] rounded-lg overflow-hidden shadow-lg bg-white p-4"
            >
              <img 
                src={imageSrc} 
                alt="Logo preview" 
                className="max-w-full max-h-[calc(70vh-32px)] object-contain"
                style={{ display: "block" }}
              />
              <div className="absolute bottom-0 left-0 right-0 h-8 flex items-center justify-center bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
            </motion.div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;
