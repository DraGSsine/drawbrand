"use client";

import React, { useState, useEffect } from "react";
import Drawing from "../../components/dashboard/Drawing";
import RightSideBar from "@/components/dashboard/RightSideBar";
import Sidebar from "@/components/dashboard/sidebar";
import { Button } from "@/components/ui/button";
import { 
  Bars,
  SquareArrowLeft,
  ChevronLeft, 
  ChevronRight,
  Sparkles 
} from "../../../public/icons/SvgIcons";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardPage() {
  // Simplified sidebar visibility state
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  // Track if component is mounted (client-side)
  const [isMounted, setIsMounted] = useState(false);
  // Store viewport information
  const [viewport, setViewport] = useState({
    isMobile: false, // < 768px
    isTablet: false, // 768px - 1279px
  });

  // Set isMounted to true after component mounts
  useEffect(() => {
    setIsMounted(true);
    
    // Initialize viewport size
    const updateViewport = () => {
      setViewport({
        isMobile: window.innerWidth < 768,
        isTablet: window.innerWidth >= 768 && window.innerWidth < 1280,
      });
    };
    
    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  // Close sidebars on ESC key (for accessibility)
  useEffect(() => {
    if (!isMounted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // On mobile (will be hidden via CSS if not mobile)
        if (viewport.isMobile) {
          setShowLeftSidebar(false);
          setShowRightSidebar(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMounted, viewport.isMobile]);

  // Helper function for sidebar overlay click
  const handleOverlayClick = () => {
    if (!isMounted) return;
    
    if (viewport.isMobile) {
      // Close both sidebars on mobile
      setShowLeftSidebar(false);
      setShowRightSidebar(false);
    } else if (viewport.isTablet) {
      // Only close right sidebar on tablet
      setShowRightSidebar(false);
    }
  };

  // Calculate sidebar width based on viewport
  const getLeftSidebarWidth = () => {
    if (!isMounted) return "350px"; // Default for initial render
    if (viewport.isMobile) return "90%";
    if (viewport.isTablet) return "320px";
    return "350px";
  };

  const getRightSidebarWidth = () => {
    if (!isMounted) return "340px"; // Default for initial render
    if (viewport.isMobile) return "90%";
    if (viewport.isTablet) return "300px";
    return "340px";
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-blue-50">
      {/* Top navigation bar */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 shadow-sm z-40">
        <div className="flex items-center">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg font-semibold text-gray-800 flex items-center"
          >
            <Sparkles className="w-5 h-5 mr-2 text-blue-600" />
            Logo Creator
          </motion.h1>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Tablet-only sidebar toggles */}
          <div className="hidden md:flex lg:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLeftSidebar(!showLeftSidebar)}
              className="flex items-center gap-1"
            >
              <Bars className="h-4 w-4" />
              <span className="text-xs">Settings</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRightSidebar(!showRightSidebar)}
              className="flex items-center gap-1"
            >
              <SquareArrowLeft className="h-4 w-4" />
              <span className="text-xs">Generate</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <div className="h-[calc(100vh-56px)] w-full mx-auto relative p-4 mt-14">
        {/* Mobile sidebar toggle buttons - only visible on mobile */}
        <div className="flex md:hidden w-full gap-2 mb-2 z-20">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setShowLeftSidebar(true)}
            className="flex-1 h-12 bg-white/90 backdrop-blur-sm shadow-sm border border-blue-200 rounded-xl"
          >
            <Bars className="h-5 w-5 mr-2 text-blue-600" />
            <span className="font-medium text-blue-700">Settings</span>
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={() => setShowRightSidebar(true)}
            className="flex-1 h-12 bg-white/90 backdrop-blur-sm shadow-sm border border-blue-200 rounded-xl"
          >
            <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
            <span className="font-medium text-blue-700">Generate</span>
          </Button>
        </div>
        
        {/* Overlay for mobile/tablet when sidebars are open */}
        <AnimatePresence>
          {(showLeftSidebar || showRightSidebar) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed top-14 bottom-0 left-0 right-0 bg-black/30 backdrop-blur-sm z-20 lg:hidden"
              onClick={handleOverlayClick}
            />
          )}
        </AnimatePresence>

        <div className="flex h-full">
          {/* Left Sidebar - Configuration panel */}
          <AnimatePresence>
            {showLeftSidebar && (
              <motion.div
                initial={{ 
                  x: "-100%",
                  opacity: 0,
                  width: "90%", // Mobile default width
                }}
                animate={{ 
                  x: 0,
                  opacity: 1,
                  width: getLeftSidebarWidth()
                }}
                exit={{ 
                  x: "-100%", 
                  opacity: 0 
                }}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                className={`
                  fixed md:relative left-0 top-[56px] md:top-0 z-30 
                  h-[calc(100vh-56px)] 
                  bg-white rounded-2xl overflow-hidden border border-blue-100
                  shadow-lg md:shadow-none
                `}
              >
                <div className="h-full overflow-y-auto">
                  <Sidebar /> 
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toggle for left sidebar - visible on desktop and tablet */}
          <div className="hidden md:block">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowLeftSidebar(!showLeftSidebar)}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-50 bg-white shadow-md rounded-r-lg border border-l-0 border-gray-200 h-16 w-8"
            >
              {showLeftSidebar ? 
                <ChevronLeft className="h-6 w-6 text-blue-600" /> : 
                <ChevronRight className="h-6 w-6 text-blue-600" />
              }
            </Button>
          </div>

          {/* Main drawing area */}
          <main className="flex-1 h-[80vh] md:h-full overflow-hidden bg-white rounded-2xl shadow-sm border border-blue-100">
            <Drawing />
          </main>

          {/* Toggle for right sidebar - visible on desktop and tablet */}
          <div className="hidden md:block">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowRightSidebar(!showRightSidebar)}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-50 bg-white shadow-md rounded-l-lg border border-r-0 border-gray-200 h-16 w-8"
            >
              {showRightSidebar ? 
                <ChevronRight className="h-6 w-6 text-blue-600" /> : 
                <ChevronLeft className="h-6 w-6 text-blue-600" />
              }
            </Button>
          </div>

          {/* Right Sidebar - Generator panel */}
          <AnimatePresence>
            {showRightSidebar && (
              <motion.div
                initial={{ 
                  x: "100%",
                  opacity: 0,
                  width: "90%", // Mobile default width
                }}
                animate={{ 
                  x: 0,
                  opacity: 1,
                  width: getRightSidebarWidth()
                }}
                exit={{ 
                  x: "100%", 
                  opacity: 0 
                }}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                className={`
                  fixed md:relative right-0 top-[56px] md:top-0 z-30  
                  h-[calc(100vh-56px)] 
                  bg-white rounded-2xl overflow-hidden border border-blue-100
                  shadow-lg md:shadow-none
                `}
              >
                <div className="h-full overflow-y-auto">
                  <RightSideBar />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
