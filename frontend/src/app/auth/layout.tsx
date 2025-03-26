import React, { ReactNode } from "react";
import { Metadata } from "next";
import Image from "next/image";
import Logo from "@/components/landing/logo";

export const metadata: Metadata = {
  title: {
    default: "Authentication",
    template: "%s | Authentication",
  },
  description: "Sign in or create an account to access your dashboard.",
};

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

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800">
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:64px_64px]" />

        {/* Decorative Gradients */}
        <div className="absolute -left-40 -top-40 h-[800px] w-[800px] rounded-full bg-gradient-to-tr from-blue-400/30 to-fuchsia-400/30 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-[600px] w-[600px] rounded-full bg-gradient-to-bl from-cyan-400/30 to-blue-400/30 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-blue-600/10 to-blue-600/10 blur-2xl" />

        {/* Content Container with better organization */}
        <div className="relative flex flex-col h-full">
          {/* Top Section with Logo */}
          <div className="mt-10 ml-10 bg-white p-2 rounded-xl w-44">
            <Logo size={100} textClass="" />
          </div>

          {/* Center Section with Text */}
          <div className=" py-12">
            <div className="px-12 max-w-lg">
              <h1 className="text-6xl font-extrabold text-white leading-tight">
                Join Us
              </h1>
              <p className="text-lg text-blue-100 mt-4">
                Create an account to unlock all features and start your journey with us.
              </p>
            </div>
          </div>

          {/* Bottom Section with Image Showcase */}
          <div className="w-full auth-fadeIn">
            <div className="relative z-10 overflow-hidden space-y-6 mb-12">
              {/* First row - Left to Right */}
              <div className="relative w-full overflow-hidden">
                <div className="flex auth-slideLeftToRight">
                  <div className="flex gap-6">
                    {showcaseImages.row1.map((image, index) => (
                      <div key={index} className="relative w-32 h-32 flex-shrink-0 hover:scale-105 transition-all duration-500 transform hover:-translate-y-1">
                        <Image
                          src={image}
                          alt={`Logo example ${index + 1}`}
                          fill
                          className="object-contain bg-white rounded-xl shadow-lg p-2"
                          sizes="(max-width: 128px) 100vw, 128px"
                        />
                      </div>
                    ))}
                    {showcaseImages.row1.map((image, index) => (
                      <div key={`duplicate-${index}`} className="relative w-32 h-32 flex-shrink-0 hover:scale-105 transition-all duration-500 transform hover:-translate-y-1">
                        <Image
                          src={image}
                          alt={`Logo example ${index + 1}`}
                          fill
                          className="object-contain bg-white rounded-xl shadow-lg p-2"
                          sizes="(max-width: 128px) 100vw, 128px"
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
                      <div key={index} className="relative w-32 h-32 flex-shrink-0 hover:scale-105 transition-all duration-500 transform hover:-translate-y-1">
                        <Image
                          src={image}
                          alt={`Logo example ${index + 9}`}
                          fill
                          className="object-contain bg-white rounded-xl shadow-lg p-2"
                          sizes="(max-width: 128px) 100vw, 128px"
                        />
                      </div>
                    ))}
                    {showcaseImages.row2.map((image, index) => (
                      <div key={`duplicate-${index}`} className="relative w-32 h-32 flex-shrink-0 hover:scale-105 transition-all duration-500 transform hover:-translate-y-1">
                        <Image
                          src={image}
                          alt={`Logo example ${index + 9}`}
                          fill
                          className="object-contain bg-white rounded-xl shadow-lg p-2"
                          sizes="(max-width: 128px) 100vw, 128px"
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
                      <div key={index} className="relative w-32 h-32 flex-shrink-0 hover:scale-105 transition-all duration-500 transform hover:-translate-y-1">
                        <Image
                          src={image}
                          alt={`Logo example ${index + 18}`}
                          fill
                          className="object-contain bg-white rounded-xl shadow-lg p-2"
                          sizes="(max-width: 128px) 100vw, 128px"
                        />
                      </div>
                    ))}
                    {showcaseImages.row3.map((image, index) => (
                      <div key={`duplicate-${index}`} className="relative w-32 h-32 flex-shrink-0 hover:scale-105 transition-all duration-500 transform hover:-translate-y-1">
                        <Image
                          src={image}
                          alt={`Logo example ${index + 18}`}
                          fill
                          className="object-contain bg-white rounded-xl shadow-lg p-2"
                          sizes="(max-width: 128px) 100vw, 128px"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute top-1/4 right-20 w-40 h-40 rounded-full bg-blue-200/60 blur-3xl auth-float"></div>
            <div className="absolute bottom-1/4 left-20 w-48 h-48 rounded-full bg-purple-200/60 blur-3xl auth-float-delayed"></div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center">{children}</div>
    </div>
  );
};

export default AuthLayout;
