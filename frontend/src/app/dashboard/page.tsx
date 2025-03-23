"use client";

import React, { useState, useEffect } from "react";
import Drawing from "../../components/dashboard/Drawing";
import RightSideBar from "@/components/dashboard/RightSideBar";
import Sidebar from "@/components/dashboard/sidebar";
import { Button } from "@/components/ui/button";
import { 
  X, 
  Bars,
  SquareArrowLeft,
  ChevronLeft, 
  ChevronRight,
  Sparkles 
} from "../../../public/icons/SvgIcons";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardPage() {
  // State to control sidebar visibility
  const [showLeftSidebar, setShowLeftSidebar] = useState(false);
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener for resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebars on mobile when ESC key is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobile) {
        setShowLeftSidebar(false);
        setShowRightSidebar(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobile]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-blue-50">
      {/* Top navigation bar */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 shadow-sm">
        <div className="flex items-center">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg font-semibold text-gray-800 flex items-center"
          >
            <Sparkles className="w-5 h-5 mr-2 text-blue-500" />
            Logo Creator
          </motion.h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowLeftSidebar(!showLeftSidebar)}
            className="flex items-center gap-1 lg:hidden"
          >
            <Bars className="h-4 w-4" />
            <span className="sr-only md:not-sr-only md:text-xs">Settings</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowRightSidebar(!showRightSidebar)}
            className="flex items-center gap-1 lg:hidden"
          >
            <SquareArrowLeft className="h-4 w-4" />
            <span className="sr-only md:not-sr-only md:text-xs">Generate</span>
          </Button>
        </div>
      </header>

      {/* Main content area */}
      <div className="h-[calc(100vh-56px)] w-full mx-auto relative flex p-4 gap-4">
        {/* Overlay for mobile when sidebars are open */}
        <AnimatePresence>
          {isMobile && (showLeftSidebar || showRightSidebar) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/30 z-30 lg:hidden"
              onClick={() => {
                setShowLeftSidebar(false);
                setShowRightSidebar(false);
              }}
            />
          )}
        </AnimatePresence>

        {/* Left Sidebar - Configuration panel */}
        <motion.aside
          initial={false}
          animate={{ 
            x: (showLeftSidebar || !isMobile) ? 0 : "-100%",
            boxShadow: (showLeftSidebar && isMobile) ? "5px 0 20px rgba(0,0,0,0.1)" : "none"
          }}
          transition={{ type: "spring", stiffness: 400, damping: 40 }}
          className="fixed lg:relative z-40 h-full w-[350px] lg:translate-x-0 bg-white lg:shadow-sm rounded-2xl overflow-hidden border border-blue-100"
        >
          <Sidebar />

          {/* Close button for mobile */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowLeftSidebar(false)}
              className="absolute top-3 right-3 lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </motion.aside>

        {/* Toggle for left sidebar - visible on desktop */}
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowLeftSidebar(!showLeftSidebar)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 shadow-sm rounded-r-lg border border-l-0 border-gray-200 h-12 w-6"
          >
            {showLeftSidebar ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        )}

        {/* Main drawing area */}
        <main className="flex-1 h-full overflow-hidden bg-white rounded-2xl shadow-sm border border-blue-100">
          <Drawing />
        </main>

        {/* Toggle for right sidebar - visible on desktop */}
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowRightSidebar(!showRightSidebar)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 shadow-sm rounded-l-lg border border-r-0 border-gray-200 h-12 w-6"
          >
            {showRightSidebar ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        )}

        {/* Right Sidebar - Generator panel */}
        <motion.aside
          initial={false}
          animate={{ 
            x: (showRightSidebar || !isMobile) ? 0 : "100%",
            boxShadow: (showRightSidebar && isMobile) ? "-5px 0 20px rgba(0,0,0,0.1)" : "none"
          }}
          transition={{ type: "spring", stiffness: 400, damping: 40 }}
          className="fixed lg:relative right-0 z-40 h-full w-[340px] lg:translate-x-0 bg-white lg:shadow-sm rounded-2xl overflow-hidden border border-blue-100"
        >
          <RightSideBar />

          {/* Close button for mobile */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowRightSidebar(false)}
              className="absolute top-3 left-3 lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </motion.aside>
      </div>
    </div>
  );
}
