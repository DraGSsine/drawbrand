"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Upload, FileCheck } from "../../../public/icons/SvgIcons";
import Image from "next/image";

const Hero = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
      
      // Simulate upload
      setIsUploading(true);
      setTimeout(() => {
        setIsUploading(false);
      }, 1500);
    }
  };

  const showcaseImages = {
    row1: [
      "/showcase/after-airplane-basic.png",
      "/showcase/after-balloon-messy.png",
      "/showcase/after-brain-rough.png",
      "/showcase/after-castle-pixel.png",
      "/showcase/after-cat-flatGraphic.png",
      "/showcase/after-coffee-badgeCrest.png",
      "/showcase/after-compass-amateur.png",
      "/showcase/after-compass-pop.png",
      "/showcase/after-dragon-line.png"
    ],
    row2: [
      "/showcase/after-hand-shaky.png",
      "/showcase/after-hourglass-basic.png",
      "/showcase/after-house-wobbly.png",
      "/showcase/after-lantern-crude.png",
      "/showcase/after-lightbulb-messy.png",
      "/showcase/after-lighthouse-cartoon.png",
      "/showcase/after-lion-kawaii.png",
      "/showcase/after-moonboy-beginner.png",
      "/showcase/after-mountain-mascot.png"
    ],
    row3: [
      "/showcase/after-owl-iconEmoji.png",
      "/showcase/after-rocket-rough.png",
      "/showcase/after-rocket-watercolor.png",
      "/showcase/after-ship-comic.png",
      "/showcase/after-telescope-crude.png",
      "/showcase/after-three-pictorial.png",
      "/showcase/after-tree-manga.png",
      "/showcase/after-treehouse-crude.png",
      "/showcase/after-wolf-abstract.png"
    ]
  };

  return (
    <section className="pt-32 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 max-w-xl mx-auto lg:mx-0 text-center lg:text-left opacity-0" style={{ animation: "fadeIn 1s forwards", animationDelay: "0.2s" }}>
            <div>
              <span className="px-4 py-1.5 rounded-full bg-blue-100 text-blue-600 font-medium text-sm inline-block mb-4 shadow-sm">
                AI-Powered Logo Design
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                Create Your Perfect <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Brand Identity</span> with DrawBrand
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Transform your ideas into stunning logos in seconds. Our AI-powered platform creates unique, professional designs that perfectly represent your brand.
              </p>
            </div>
            
            <div className="max-w-md mx-auto lg:mx-0">
              <div className="bg-white/90 backdrop-blur-md p-7 relative overflow-hidden rounded-xl shadow-xl border border-gray-100 dark:border-gray-800">
                <label htmlFor="file-upload" className={`flex flex-col items-center justify-center p-6 border-2 border-dashed ${fileName ? 'border-blue-500' : 'border-gray-300'} rounded-xl cursor-pointer transition-all duration-300 h-40 hover:border-blue-500 hover:bg-blue-50/50`}>
                  {!fileName && !isUploading && (
                    <>
                      <Upload className="w-10 h-10 mb-3 text-blue-600" />
                      <span className="text-base font-medium text-gray-900">Upload your image or sketch</span>
                      <span className="text-sm text-gray-500 mt-2">PNG, JPG, up to 5MB</span>
                    </>
                  )}
                  
                  {isUploading && (
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                      <span className="text-base font-medium text-gray-900 mt-3">Creating your logo...</span>
                    </div>
                  )}
                  
                  {fileName && !isUploading && (
                    <div className="flex items-center space-x-3">
                      <FileCheck className="w-6 h-6 text-blue-600" />
                      <span className="text-base font-medium text-gray-900 truncate max-w-[200px]">{fileName}</span>
                    </div>
                  )}
                  
                  <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
                
                <div className="mt-6">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-6 text-lg font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                    <span>Generate Logo</span>
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-6 text-sm text-gray-500 mt-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span>Instant results</span>
              </div>
              <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-300"></div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span>Unique designs</span>
              </div>
              <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-300"></div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span>Commercial license</span>
              </div>
            </div>
          </div>
          
          <div className="relative opacity-0" style={{ animation: "fadeIn 1s forwards", animationDelay: "0.6s" }}>
            <div className="relative z-10 overflow-hidden space-y-8">
              {/* First row - Left to Right */}
              <div className="relative w-full overflow-hidden">
                <div className="flex" style={{ animation: "slideLeftToRight 25s linear infinite" }}>
                  <div className="flex gap-8">
                    {showcaseImages.row1.map((image, index) => (
                      <div key={index} className="relative w-40 h-40 flex-shrink-0 hover:scale-105 transition-all duration-500 transform hover:-translate-y-1">
                        <Image 
                          src={image} 
                          alt={`Logo example ${index + 1}`}
                          fill
                          className="object-contain bg-white rounded-xl shadow-lg p-2"
                          sizes="(max-width: 160px) 100vw, 160px"
                        />
                      </div>
                    ))}
                    {showcaseImages.row1.map((image, index) => (
                      <div key={`duplicate-${index}`} className="relative w-40 h-40 flex-shrink-0 hover:scale-105 transition-all duration-500 transform hover:-translate-y-1">
                        <Image 
                          src={image} 
                          alt={`Logo example ${index + 1}`}
                          fill
                          className="object-contain bg-white rounded-xl shadow-lg p-2"
                          sizes="(max-width: 160px) 100vw, 160px"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Second row - Right to Left */}
              <div className="relative w-full overflow-hidden">
                <div className="flex" style={{ animation: "slideRightToLeft 25s linear infinite" }}>
                  <div className="flex gap-8">
                    {showcaseImages.row2.map((image, index) => (
                      <div key={index} className="relative w-40 h-40 flex-shrink-0 hover:scale-105 transition-all duration-500 transform hover:-translate-y-1">
                        <Image 
                          src={image} 
                          alt={`Logo example ${index + 9}`}
                          fill
                          className="object-contain bg-white rounded-xl shadow-lg p-2"
                          sizes="(max-width: 160px) 100vw, 160px"
                        />
                      </div>
                    ))}
                    {showcaseImages.row2.map((image, index) => (
                      <div key={`duplicate-${index}`} className="relative w-40 h-40 flex-shrink-0 hover:scale-105 transition-all duration-500 transform hover:-translate-y-1">
                        <Image 
                          src={image} 
                          alt={`Logo example ${index + 9}`}
                          fill
                          className="object-contain bg-white rounded-xl shadow-lg p-2"
                          sizes="(max-width: 160px) 100vw, 160px"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Third row - Left to Right */}
              <div className="relative w-full overflow-hidden">
                <div className="flex" style={{ animation: "slideLeftToRight 25s linear infinite" }}>
                  <div className="flex gap-8">
                    {showcaseImages.row3.map((image, index) => (
                      <div key={index} className="relative w-40 h-40 flex-shrink-0 hover:scale-105 transition-all duration-500 transform hover:-translate-y-1">
                        <Image 
                          src={image} 
                          alt={`Logo example ${index + 17}`}
                          fill
                          className="object-contain bg-white rounded-xl shadow-lg p-2"
                          sizes="(max-width: 160px) 100vw, 160px"
                        />
                      </div>
                    ))}
                    {showcaseImages.row3.map((image, index) => (
                      <div key={`duplicate-${index}`} className="relative w-40 h-40 flex-shrink-0 hover:scale-105 transition-all duration-500 transform hover:-translate-y-1">
                        <Image 
                          src={image} 
                          alt={`Logo example ${index + 17}`}
                          fill
                          className="object-contain bg-white rounded-xl shadow-lg p-2"
                          sizes="(max-width: 160px) 100vw, 160px"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-blue-200/60 blur-3xl" style={{ animation: "float 6s ease-in-out infinite" }}></div>
            <div className="absolute -bottom-8 -left-12 w-48 h-48 rounded-full bg-purple-200/60 blur-3xl" style={{ animation: "float 7s ease-in-out infinite", animationDelay: "1s" }}></div>
            <div className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full bg-green-200/40 blur-2xl" style={{ animation: "float 8s ease-in-out infinite", animationDelay: "2s" }}></div>
          </div>
        </div>
      </div>

      {/* Add animation keyframes via style tag */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes slideLeftToRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        @keyframes slideRightToLeft {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
};

export default Hero;
