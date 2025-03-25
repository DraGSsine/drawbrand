import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "../../../public/icons/SvgIcons";
import Image from "next/image";

const CTA = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/20 dark:to-violet-950/20">
      <div className="container mx-auto px-6">
        <div className="relative z-10 glass-card rounded-3xl p-10 md:p-14 lg:p-20 max-w-5xl mx-auto bg-opacity-90">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-center">
            <div className="lg:col-span-3 opacity-0 animate-fade-in" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
              <h2 className="text-4xl font-extrabold mb-8">
                Generate Your Logo <span className="bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">Now</span>
              </h2>
              <p className="text-lg mb-10 text-gray-700 dark:text-gray-300">
                Transform your ideas into stunning logos in seconds. Join thousands of satisfied customers who have elevated their brand with LogoMagic AI.
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <Button className="bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
                  <span>Try For Free</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-colors">
                  View Gallery
                </Button>
              </div>
            </div>
            <div className="lg:col-span-2 opacity-0 animate-fade-in" style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}>
              <div className="relative">
                <div className="relative w-full h-72 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg">
                  <Image 
                    src="/showcase/after-rocket-watercolor.png" 
                    alt="AI generated logo examples" 
                    fill
                    className="object-contain rounded-xl overflow-hidden"
                  />
                </div>
                <div className="absolute -top-4 -right-4 bg-indigo-500 text-white text-sm px-3 py-1 rounded-full transform rotate-3 shadow-md">
                  Ready in seconds!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-indigo-100 to-transparent opacity-70 -z-10"></div>
    </section>
  );
};

export default CTA;
