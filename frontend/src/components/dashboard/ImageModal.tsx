import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X, Download } from "../../../public/icons/SvgIcons";
import { motion } from "framer-motion";
import Image from "next/image";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string | null;
}

const ImageModal = ({ isOpen, onClose, imageSrc }: ImageModalProps) => {
  const [isMobile, setIsMobile] = useState(false);
  
  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener for resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
      <DialogContent className={`p-0 border-none ${isMobile ? 'max-w-[95vw]' : 'max-w-3xl'} bg-transparent shadow-none mx-auto`}>
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
            className="absolute border border-gray-300 top-2 md:top-3 right-2 md:right-3 z-10 p-1.5 md:p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
          >
            <X className="h-4 w-4 md:h-6 md:w-6 text-gray-700" />
          </motion.button>
          
          {/* Action buttons */}
          <div className="absolute top-2 md:top-3 left-2 md:left-3 z-10 flex space-x-2">

            {/* Download button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleDownload}
              className="p-1.5 md:p-2 bg-white/90 border border-gray-300 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center hover:bg-white transition-colors"
              title="Download Logo"
            >
              <Download className="h-4 w-4 md:h-6 md:w-6 text-green-600" />
            </motion.button>
          </div>
          
          {/* Image container with proper sizing and centering */}
          <div 
            className="bg-[#f8f9fa] flex items-center justify-center p-3 md:p-6" 
            style={{ minHeight: isMobile ? "250px" : "400px" }}
          >
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="rounded-lg overflow-hidden shadow-lg"
            >
              <Image
                width={1000}
                height={1000}
                objectFit="contain"
                src={imageSrc} 
                alt="Logo preview" 
                className="h-full w-full object-contain max-h-[70vh]"
                style={{ display: "block" }}
              />
            </motion.div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;
