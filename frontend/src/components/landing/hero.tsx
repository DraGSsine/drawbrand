import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  CurvedArrowRight, 
  Check, 
  Star 
} from "../../../public/icons/SvgIcons";
import Link from "next/link";

interface Feature {
  text: string;
  color: string;
}

const Hero: React.FC = () => {
  const features: Feature[] = [
    { text: "AI-powered precision", color: "green" },
    { text: "Ready in seconds", color: "blue" },
    { text: "Unlimited revisions", color: "amber" }
  ];

  const userImages = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop"
  ];

  return (
    <section className="relative min-h-screen py-20 px-4 sm:px-6 overflow-hidden flex items-center">
      {/* Ambient Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {[
          { top: "top-0 left-1/4", bg: "bg-blue-200/30", size: "w-[500px] h-[500px]", delay: "" },
          { top: "bottom-0 right-0", bg: "bg-purple-200/30", size: "w-[400px] h-[400px]", delay: "animation-delay-1000" },
          { top: "top-1/3 right-1/4", bg: "bg-pink-100/20", size: "w-[300px] h-[300px]", delay: "animation-delay-2000" }
        ].map((item, index) => (
          <div
            key={index}
            className={`absolute ${item.top} ${item.bg} ${item.size} rounded-full 
              blur-[80px] opacity-60 animate-pulse ${item.delay}`}
          />
        ))}
      </div>

      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-10 transition-all duration-1000 ease-out">
            <div className="space-y-6">
              <div className="inline-flex">
                <div className="px-4 py-1.5 rounded-full bg-blue-600/10 border border-blue-600/20 
                  text-blue-600 font-medium text-sm shadow-sm hover-lift">
                  <span className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-600 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    Sketch to Logo Transformation
                  </span>
                </div>
              </div>

              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold">
                Transform <span className="text-blue-600">Anything</span> Into
                <br className="hidden sm:inline" /> Professional <span className="text-gradient">Logo</span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
                Our AI-powered platform converts your simple sketches into stunning,
                professional logos that perfectly capture your brand's essence and vision.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex justify-center space-x-4">
                  <Link
                    href="/auth/signup"
                    className="h-14 px-8 text-base flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-600/90 
                      shadow-lg shadow-blue-600/20 transition-all duration-300 transform 
                      text-white hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-600/30 group"
                  >
                    Start Creating Now
                    <ArrowRight 
                      className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5" 
                      iconPrimary="#fff" 
                      iconSecondary="#fff" 
                    />
                  </Link>

                  <Link
                    href="/showcase"
                    className="h-14 px-8 flex items-center justify-center text-base rounded-full border-2 hover:bg-zinc-50 hover:text-zinc-800
                      transition-all duration-300 border-gray-200"
                  >
                    See Examples
                  </Link>
                </div>
              </div>

            </div>

            <div className="pt-4">
              <div className="flex items-center gap-5">
                <div className="flex -space-x-3">
                  {userImages.map((imageUrl, i) => (
                    <div
                      key={i}
                      className="w-12 h-12 rounded-full border-2 border-white overflow-hidden 
                        ring-2 ring-white/50 hover-lift"
                      style={{ transitionDelay: `${i * 100}ms` }}
                    >
                      <Image
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
          <div className="transition-all duration-1000 ease-out translate-y-8">
            <LogoShowcase />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;


const LogoShowcase = () => {
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
    <div className="relative z-10 rounded-2xl bg-white/80 backdrop-blur-md border border-white/30 shadow-xl p-6 overflow-hidden">
      <div className="absolute -top-6 -right-6 w-16 h-16 bg-blue-400/10 rounded-full blur-xl"></div>
      <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-purple-400/10 rounded-full blur-xl"></div>

      <div className="relative">
        <div className="mb-8">
          <div className="grid grid-cols-7 gap-6 items-center">
            <div className="col-span-3">
              <div className="aspect-square rounded-xl bg-white border border-gray-200 p-3 flex items-center justify-center overflow-hidden shadow-sm">
                <Image
                  src="/showcase/before-astronauts.png"
                  width={150}
                  height={150}
                  alt="after owl"
                  className="rounded-xl overflow-hiden"
                />
              </div>
            </div>
            <div className="col-span-1 flex items-center justify-center">
              <CurvedArrowRight className="w-12 h-12" />
            </div>
            <div className="col-span-3">
              <div className="aspect-square rounded-xl bg-white border border-gray-200 p-3 flex items-center justify-center overflow-hidden shadow-sm">
                <Image
                  src="/showcase/after-astronauts.png"
                  width={500}
                  height={500}
                  alt="after owl"
                />
              </div>
            </div>
          </div>
        </div>


        <div className="relative z-10 overflow-hidden space-y-6 mb-12">
              {/* First row - Left to Right */}
              <div className="relative w-full overflow-hidden">
                <div className="flex auth-slideLeftToRight">
                  <div className="flex gap-6">
                    {showcaseImages.row1.map((image, index) => (
                      <div key={index} className="relative w-16 h-16 flex-shrink-0 hover:scale-105 transition-all duration-500 transform hover:-translate-y-1">
                        <Image
                          src={image}
                          alt={`Logo example ${index + 1}`}
                          fill
                          className="rounded-xl overflow-hiden"

                        />
                      </div>
                    ))}
                    {showcaseImages.row1.map((image, index) => (
                      <div key={`duplicate-${index}`} className="relative w-16 h-16 flex-shrink-0 hover:scale-105 transition-all duration-500 transform hover:-translate-y-1">
                        <Image
                          src={image}
                          alt={`Logo example ${index + 1}`}
                          fill
                          className="rounded-xl overflow-hiden"

                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Second row - Right to Left */}
              <div className="relative w-full overflow-hidden">
                <div className="flex auth-slideRightToLeft">
                  <div className="flex gap-6">
                    {showcaseImages.row2.map((image, index) => (
                      <div key={index} className="relative w-16 h-16 flex-shrink-0 hover:scale-105 transition-all duration-500 transform hover:-translate-y-1">
                        <Image
                          src={image}
                          alt={`Logo example ${index + 9}`}
                          fill
                          className="rounded-xl overflow-hiden"

                        />
                      </div>
                    ))}
                    {showcaseImages.row2.map((image, index) => (
                      <div key={`duplicate-${index}`} className="relative w-16 h-16 flex-shrink-0 hover:scale-105 transition-all duration-500 transform hover:-translate-y-1">
                        <Image
                          src={image}
                          alt={`Logo example ${index + 9}`}
                          fill
                          className="rounded-xl overflow-hiden"

                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Third row - Left to Right */}
              <div className="relative w-full overflow-hidden">
                <div className="flex auth-slideLeftToRight">
                  <div className="flex gap-6">
                    {showcaseImages.row3.map((image, index) => (
                      <div key={index} className="relative w-16 h-16 flex-shrink-0 hover:scale-105 transition-all duration-500 transform hover:-translate-y-1">
                        <Image
                          src={image}
                          alt={`Logo example ${index + 18}`}
                          fill
                          className="rounded-xl overflow-hiden"

                        />
                      </div>
                    ))}
                    {showcaseImages.row3.map((image, index) => (
                      <div key={`duplicate-${index}`} className="relative w-16 h-16 flex-shrink-0 hover:scale-105 transition-all duration-500 transform hover:-translate-y-1">
                        <Image
                          src={image}
                          alt={`Logo example ${index + 18}`}
                          fill
                          className="rounded-xl overflow-hiden"

                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
        <div className="mt-8 flex justify-center">
          <div className="h-1 w-20 rounded-full bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
};
