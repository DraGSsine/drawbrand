import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CurvedArrowRight } from "../../../public/icons/SvgIcons";
import Image from "next/image";

const LogoFromAnything = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-amber-50 to-rose-50 dark:from-amber-950/20 dark:to-rose-950/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative">
            <div className="relative rounded-lg overflow-hidden">
              <div className="flex gap-2 justify-center items-center">
                <div className="relative w-64 h-64 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
                  <Image 
                    src="/showcase/before-owl-iconEmoji.png" 
                    alt="Original photo" 
                    fill
                    className="object-contain rounded-lg overflow-hidden"
                  />
                </div>
                <CurvedArrowRight className="w-24 h-24" />
                <div className="relative w-64 h-64 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
                  <Image 
                    src="/showcase/after-owl-iconEmoji.png" 
                    alt="Generated logo from photo"
                    fill
                    className="object-contain rounded-lg overflow-hidden"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl font-bold mb-6">
              Generate a Logo from <span className="bg-gradient-to-r from-amber-500 to-rose-600 bg-clip-text text-transparent">Absolutely Anything</span> You Imagine
            </h2>
            <p className="text-base mb-8">
              Have a photo of a cupcake? A cat? A landscape? Our advanced AI can transform any image into a professional logo that captures its essence while maintaining brand standards.
            </p>
            <div className="space-y-6 mb-8">
              <div className="flex items-start">
                <span className="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300 rounded-full min-w-6 h-6 flex items-center justify-center mr-3 mt-0.5">1</span>
                <p className="text-muted-foreground">Upload any image that inspires you - literally anything!</p>
              </div>
              <div className="flex items-start">
                <span className="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300 rounded-full min-w-6 h-6 flex items-center justify-center mr-3 mt-0.5">2</span>
                <p className="text-muted-foreground">Our AI extracts key elements and transforms them into logo concepts</p>
              </div>
              <div className="flex items-start">
                <span className="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300 rounded-full min-w-6 h-6 flex items-center justify-center mr-3 mt-0.5">3</span>
                <p className="text-muted-foreground">Refine with colors, typography, and layout adjustments</p>
              </div>
            </div>
            <Button className="bg-amber-600 text-white hover:bg-amber-700 transition-colors">
              Try With Your Own Image
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LogoFromAnything;
