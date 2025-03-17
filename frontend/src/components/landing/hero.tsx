"use client";
import React, { useEffect, useState } from "react";
import {
  Chrome,
  Play,
  X,
  CheckCircle2,
  Star,
  MoreHorizontal,
  AlertCircle,
  SmilePlus,
  LinkIcon,
  ImageIcon,
  Send,
} from "lucide-react";
import Trusted from "./trusted";
import Image from "next/image";

export function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  // Close modal with escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);
  
  return (
    <div className="relative flex items-center justify-center py-20 md:py-24 min-h-screen overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-violet-50 to-pink-50 pointer-events-none" aria-hidden="true" />

      {/* Floating shapes */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-4 top-20 w-36 md:w-72 h-36 md:h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob" />
        <div className="absolute -right-4 top-40 w-36 md:w-72 h-36 md:h-72 bg-violet-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute left-20 bottom-20 w-36 md:w-72 h-36 md:h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      <div className="relative w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-center">
          {/* Left Column - Text Content */}
          <div className="max-w-2xl mx-auto lg:mx-0 text-center lg:text-left">
            <div className="space-y-4 md:space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/50 backdrop-blur-sm border border-blue-100 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" aria-hidden="true" />
                <span className="text-xs md:text-sm font-medium text-zinc-800">
                  Boost Your LinkedIn Game
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-zinc-800 leading-tight">
                Supercharge Your{" "}
                <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  LinkedIn
                </span>
                <br />
                <span className="bg-gradient-to-r from-violet-600 to-violet-800 bg-clip-text text-transparent">
                  Connections
                </span>
              </h1>
              <p className="text-base md:text-lg lg:text-xl text-zinc-800 max-w-xl mx-auto lg:mx-0">
                Tired of blank stares at your LinkedIn messages? Our AI crafts
                killer, personalized intros that grab attention and spark real
                conversations no more crickets!
              </p>
            </div>

            <div className="mt-6 md:mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 md:gap-4">
              <a
                href="https://chromewebstore.google.com/detail/hfadoenckgoahdcacngfebieckmhemef?utm_source=item-share-cp"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto h-10 md:h-12 px-4 md:px-6 text-sm md:text-base font-medium flex items-center justify-center gap-2 rounded-full border-2 hover:border-violet-200 bg-white/50 hover:bg-white/80 hover:text-violet-600 transition-all duration-500 text-zinc-800"
                aria-label="Add to Chrome for free"
              >
                <Chrome className="w-4 h-4 md:w-5 md:h-5" aria-hidden="true" />
                <span className="whitespace-nowrap">Add to Chrome</span>
                <span className="hidden sm:inline ml-1">- Free!</span>
              </a>
              <button
                onClick={openModal}
                className="w-full sm:w-auto h-10 md:h-12 px-4 md:px-6 text-sm md:text-base rounded-full font-medium flex items-center justify-center bg-violet-600 hover:bg-violet-700 text-white  shadow-violet-200 hover:shadow-xl hover:shadow-violet-200 transition-all duration-500 group"
                aria-label="Watch demo video"
              >
                <Play className="w-4 h-4 md:w-5 md:h-5 mr-2" aria-hidden="true" />
                Demo
              </button>
            </div>

            <div className="mt-8 md:mt-12">
              <Trusted className="" />
            </div>
          </div>

          {/* Right Column - Chat UI */}
          <div className="relative w-full max-w-lg md:max-w-2xl mx-auto lg:mx-0 mt-8 lg:mt-0">
            <HeroLeft />
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div
            className="absolute inset-0"
            onClick={closeModal}
            aria-hidden="true"
          ></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden animate-scaleIn">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-violet-600 flex items-center justify-center" aria-hidden="true">
                  <Play className="w-6 h-6 text-white ml-0.5" />
                </div>
                <div>
                  <h2 id="modal-title" className="text-2xl font-bold text-gray-900">
                    Witness the LinkedIn Glow-Up
                  </h2>
                  <p className="text-sm text-gray-500">
                    Discover how to make connections that click
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-2.5 rounded-full hover:bg-gray-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-gray-500" aria-hidden="true" />
              </button>
            </div>

            {/* Video Container */}
            <div className="relative w-full aspect-video bg-black">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/atv88nZuP_s?si=ascLCj4TFw9GU_ea"
                title="LinkedIn Message Product Demo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center" aria-hidden="true">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">
                    I went from ignored to inbox hero landed a gig in weeks!
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={closeModal}
                    className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    aria-label="Close dialog"
                  >
                    Close
                  </button>
                  <a
                    href="https://chromewebstore.google.com/detail/hfadoenckgoahdcacngfebieckmhemef?utm_source=item-share-cp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 text-sm font-medium text-white bg-violet-600 border border-transparent rounded-full hover:bg-violet-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    aria-label="Install the extension from Chrome Web Store"
                  >
                    Grab It Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const HeroLeft = () => {


  return (
    <div>
      
    </div>
  );
};