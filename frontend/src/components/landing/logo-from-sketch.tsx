import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CurvedArrowRight } from "../../../public/icons/SvgIcons";
import Image from "next/image";

const LogoFromSketch = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">
              Generate a Logo from a <span className="bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent">Sketch</span>
            </h2>
            <p className="text-base mb-8">
              Turn your hand-drawn sketches or rough ideas into clean, professional logos. Our AI understands your concept and refines it while preserving your original vision.
            </p>
            <div className="space-y-6 mb-8">
              <div className="flex items-start">
                <span className="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 rounded-full min-w-6 h-6 flex items-center justify-center mr-3 mt-0.5">1</span>
                <p className="text-muted-foreground">Upload your sketch or drawing that captures your basic concept</p>
              </div>
              <div className="flex items-start">
                <span className="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 rounded-full min-w-6 h-6 flex items-center justify-center mr-3 mt-0.5">2</span>
                <p className="text-muted-foreground">Our AI analyzes the lines, shapes, and overall composition</p>
              </div>
              <div className="flex items-start">
                <span className="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 rounded-full min-w-6 h-6 flex items-center justify-center mr-3 mt-0.5">3</span>
                <p className="text-muted-foreground">Choose from multiple vectorized logo options based on your sketch</p>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative rounded-lg overflow-hidden">
              <div className=" flex gap-2 justify-center items-center">
                  <div className="relative w-64 h-64 bg-white flex justify-center items-center dark:bg-gray-800 rounded-lg shadow-md">
                    <Image 
                    src="/showcase/before-owl-iconEmoji.png" 
                    alt="Sketch to logo example" 
                      width={156}
                      height={156}
                      className="object-contain rounded-lg overflow-hidden"
                    />
                  </div>
                <CurvedArrowRight className="w-24 h-24" />
                <div className="relative w-64 h-64 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
                  <Image 
                    src="/showcase/after-owl-iconEmoji.png" 
                    alt="Final logo design"
                    fill
                    className="object-contain rounded-lg overflow-hidden"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LogoFromSketch;
