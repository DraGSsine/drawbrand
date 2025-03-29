import React from "react";
import { ArrowRight, Star } from "../../../public/icons/SvgIcons";
import Link from "next/link";

const Hero: React.FC = () => {
  const userImages = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop"
  ];

  return (
    <section className="relative min-h-screen py-12 sm:py-16 md:py-20 px-4 sm:px-8 md:px-12 overflow-hidden flex items-center">
      {/* Ambient Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {[
          { top: "top-0 left-1/4", bg: "bg-blue-200/30", size: "w-[300px] sm:w-[400px] md:w-[500px] h-[300px] sm:h-[400px] md:h-[500px]", delay: "" },
          { top: "bottom-0 right-0", bg: "bg-brand-purple-200/30", size: "w-[250px] sm:w-[300px] md:w-[400px] h-[250px] sm:h-[300px] md:h-[400px]", delay: "animation-delay-1000" },
          { top: "top-1/3 right-1/4", bg: "bg-pink-100/20", size: "w-[200px] sm:w-[250px] md:w-[300px] h-[200px] sm:h-[250px] md:h-[300px]", delay: "animation-delay-2000" }
        ].map((item, index) => (
          <div
            key={index}
            className={`absolute ${item.top} ${item.bg} ${item.size} rounded-full 
              blur-[80px] opacity-60 animate-pulse ${item.delay}`}
          />
        ))}
      </div>

      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10 lg:gap-20 items-center">
          {/* Left Column - Text Content */}
          <div className="md:col-span-6 lg:col-span-5 space-y-6 sm:space-y-8 md:space-y-10 transition-all duration-1000 ease-out">
            <div className="space-y-4 sm:space-y-6">
              <div className="inline-flex">
                <div className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-blue-100 border border-brand-blue-600/20 
                  text-brand-blue-600 font-medium text-xs sm:text-sm shadow-sm hover-lift">
                  <span className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-600 "></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                    </span>
                    Sketch to Logo Transformation
                  </span>
                </div>
              </div>

              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                Transform <span className="text-brand-blue-600">Anything</span> Into
                <br className="hidden sm:inline" /> Professional <span className="text-gradient">Logo</span>
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
                Our AI-powered platform converts your simple sketches into stunning,
                professional logos that perfectly capture your brand's essence and vision.
              </p>
            </div>

            <div className="space-y-6 sm:space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <Link
                  href="/auth/signup"
                  className="h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-600/90 
                    shadow-lg shadow-brand-blue-600/20 transition-all duration-300 transform 
                    text-white hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-blue-600/30 group"
                >
                  Start Creating Now
                  <ArrowRight 
                    className="ml-2 h-4 sm:h-5 w-4 sm:w-5 transition-transform group-hover:translate-x-0.5" 
                    iconPrimary="#fff" 
                    iconSecondary="#fff" 
                  />
                </Link>

                <Link
                  href="/showcase"
                  className="h-12 sm:h-14 px-6 sm:px-8 flex items-center justify-center text-sm sm:text-base rounded-full border-2 hover:bg-zinc-50 hover:text-zinc-800
                    transition-all duration-300 border-gray-200"
                >
                  See Examples
                </Link>
              </div>
            </div>

            <div className="pt-2 sm:pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
                <div className="flex -space-x-3">
                  {userImages.map((imageUrl, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white overflow-hidden 
                        ring-2 ring-white/50 hover-lift"
                      style={{ transitionDelay: `${i * 100}ms` }}
                    >
                      <img
                        width={40}
                        height={40}
                        src={imageUrl}
                        alt={`User ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="font-medium text-sm">Join our early adopters!</p>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400" />
                    ))}
                    <span className="ml-1.5 text-xs font-medium text-gray-500">4.8 out of 5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Image Showcase */}
          <div className="md:col-span-6 lg:col-span-7 transition-all duration-1000 ease-out">
            <LogoShowcase />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;


interface LogoProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export const Logo: React.FC<LogoProps> = ({ src, alt, className = "", width = 150, height = 150 }) => {
  return (
    <div className={`rounded-xl overflow-hidden ${className}`}>
      <img src={src} alt={alt} width={width} height={height} className="object-cover w-full h-full" />
    </div>
  );
};

const LogoShowcase: React.FC = () => {
  const showcaseImages = {
    row1: [
      "/showcase/after-airplane-basic.png",
      "/showcase/after-balloon-messy.png",
      "/showcase/after-brain-rough.png",
      "/showcase/after-wendys.png",
      "/showcase/after-moonboy-beginner.png",
      "/showcase/after-three-pictorial.png",
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
      "/showcase/after-astronauts.png",
      "/showcase/after-ship-comic.png",
      "/showcase/after-telescope-crude.png",
      "/showcase/after-three-pictorial.png",
      "/showcase/after-tree-manga.png",
      "/showcase/after-treehouse-crude.png",
      "/showcase/after-wolf-abstract.png"
    ]
  };

  return (
    <div className="relative z-10 rounded-2xl bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-md border border-white/40 shadow-xl p-4 sm:p-6 md:p-8 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-100/40 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-brand-purple-100/40 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-blue-50/30 rounded-full blur-3xl"></div>

      <div className="relative">
        {/* Before & After Showcase */}
        <div className="mb-6 sm:mb-10">
          <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-4 sm:mb-6 text-center">See the transformation</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-7 gap-4 md:gap-6 items-center">
            <div className="col-span-1 sm:col-span-3 mx-auto sm:mx-0">
              <div className="aspect-square w-full max-w-[180px] sm:max-w-none rounded-xl bg-white border border-gray-100 p-3 flex items-center justify-center overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                <Logo 
                  src="/showcase/before-astronauts.png"
                  alt="Sketch of astronaut"
                  width={150}
                  height={150}
                  className="rounded-xl"
                />
              </div>
              <p className="text-xs text-center mt-2 text-gray-500">Your Sketch</p>
            </div>
            
            <div className="col-span-1 flex items-center justify-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-brand-blue-600/20">
                <ArrowRight 
                  className="h-4 w-4 sm:h-5 sm:w-5" 
                  iconPrimary="#fff" 
                  iconSecondary="#fff" 
                />
              </div>
            </div>
            
            <div className="col-span-1 sm:col-span-3 mx-auto sm:mx-0">
              <div className="aspect-square w-full max-w-[180px] sm:max-w-none rounded-xl bg-white border border-gray-100 p-3 flex items-center justify-center overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                <Logo 
                  src="/showcase/after-astronauts.png"
                  alt="Professional astronaut logo"
                  width={150}
                  height={150}
                />
              </div>
              <p className="text-xs text-center mt-2 text-gray-500">Generated Logo</p>
            </div>
          </div>
        </div>

        {/* More Examples Label */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="h-[1px] w-10 sm:w-16 bg-gray-200"></div>
          <p className="text-xs sm:text-sm font-medium text-gray-500">More Examples</p>
          <div className="h-[1px] w-10 sm:w-16 bg-gray-200"></div>
        </div>

        {/* Scrolling Logo Showcases */}
        <div className="relative z-10 overflow-hidden space-y-3 sm:space-y-5 mb-4 sm:mb-6">
          {/* First row - Left to Right */}
          <div className="relative w-full overflow-hidden">
            <div className="flex auth-slideLeftToRight">
              <div className="flex gap-3 sm:gap-5">
                {showcaseImages.row1.map((image, index) => (
                  <div key={index} className="relative w-10 h-10 sm:w-14 sm:h-14 flex-shrink-0 hover:scale-110 transition-all duration-300 hover:shadow-md rounded-lg overflow-hidden transform hover:-translate-y-1">
                    <img
                      src={image}
                      alt={`Logo example ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ))}
                {showcaseImages.row1.map((image, index) => (
                  <div key={`duplicate-${index}`} className="relative w-10 h-10 sm:w-14 sm:h-14 flex-shrink-0 hover:scale-110 transition-all duration-300 hover:shadow-md rounded-lg overflow-hidden transform hover:-translate-y-1">
                    <img
                      src={image}
                      alt={`Logo example ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Second row - Right to Left */}
          <div className="relative w-full overflow-hidden">
            <div className="flex auth-slideRightToLeft">
              <div className="flex gap-3 sm:gap-5">
                {showcaseImages.row2.map((image, index) => (
                  <div key={index} className="relative w-10 h-10 sm:w-14 sm:h-14 flex-shrink-0 hover:scale-110 transition-all duration-300 hover:shadow-md rounded-lg overflow-hidden transform hover:-translate-y-1">
                    <img
                      src={image}
                      alt={`Logo example ${index + 9}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ))}
                {showcaseImages.row2.map((image, index) => (
                  <div key={`duplicate-${index}`} className="relative w-10 h-10 sm:w-14 sm:h-14 flex-shrink-0 hover:scale-110 transition-all duration-300 hover:shadow-md rounded-lg overflow-hidden transform hover:-translate-y-1">
                    <img
                      src={image}
                      alt={`Logo example ${index + 9}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Third row - Left to Right */}
          <div className="relative w-full overflow-hidden">
            <div className="flex auth-slideLeftToRight">
              <div className="flex gap-3 sm:gap-5">
                {showcaseImages.row3.map((image, index) => (
                  <div key={index} className="relative w-10 h-10 sm:w-14 sm:h-14 flex-shrink-0 hover:scale-110 transition-all duration-300 hover:shadow-md rounded-lg overflow-hidden transform hover:-translate-y-1">
                    <img
                      src={image}
                      alt={`Logo example ${index + 18}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ))}
                {showcaseImages.row3.map((image, index) => (
                  <div key={`duplicate-${index}`} className="relative w-10 h-10 sm:w-14 sm:h-14 flex-shrink-0 hover:scale-110 transition-all duration-300 hover:shadow-md rounded-lg overflow-hidden transform hover:-translate-y-1">
                    <img
                      src={image}
                      alt={`Logo example ${index + 18}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};
