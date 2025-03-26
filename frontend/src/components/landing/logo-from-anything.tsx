import React from "react";
import { CurvedArrowRight } from "../../../public/icons/SvgIcons";
import Image from "next/image";

const LogoFromAnything = () => {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="order-2 lg:order-1 relative">
            <div className="relative rounded-lg overflow-hidden">
              <div className="flex gap-2 justify-center items-center">
                <div className="relative w-56 h-56 md:w-64 md:h-64 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
                  <Image
                    fill
                    src="/showcase/before-astronauts.png" 
                    alt="Original photo" 
                    className="object-contain rounded-lg overflow-hidden"
                  />
                </div>
                <CurvedArrowRight className="w-16 h-16 md:w-24 md:h-24 text-blue-600" />
                <div className="relative w-56 h-56 md:w-64 md:h-64 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
                  <Image 
                    src="/showcase/after-astronauts.png" 
                    alt="Generated logo from photo"
                    fill
                    className="object-contain rounded-lg overflow-hidden"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <h2 className="text-2xl md:text-3xl font-bold mb-5">
              Generate a Logo from <span className="text-blue-600">Absolutely Anything</span> You Imagine
            </h2>
            <p className="text-base mb-6">
              Have a photo of a cupcake? A cat? A landscape? Our advanced AI can transform any image into a professional logo that captures its essence while maintaining brand standards.
            </p>
            <div className="space-y-4 mb-6">
              <div className="flex items-start">
                <span className="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 rounded-full min-w-6 h-6 flex items-center justify-center mr-3 mt-0.5">1</span>
                <p className="text-muted-foreground">Upload any image that inspires you - literally anything!</p>
              </div>
              <div className="flex items-start">
                <span className="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 rounded-full min-w-6 h-6 flex items-center justify-center mr-3 mt-0.5">2</span>
                <p className="text-muted-foreground">Our AI extracts key elements and transforms them into logo concepts</p>
              </div>
              <div className="flex items-start">
                <span className="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 rounded-full min-w-6 h-6 flex items-center justify-center mr-3 mt-0.5">3</span>
                <p className="text-muted-foreground">Refine with colors, typography, and layout adjustments</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LogoFromAnything;
