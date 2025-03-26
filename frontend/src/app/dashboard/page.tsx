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
  const [isTablet, setIsTablet] = useState(false);

  // Check for screen sizes
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1280);
      
      // Auto show sidebars on desktop
      if (window.innerWidth >= 1280) {
        setShowLeftSidebar(true);
        setShowRightSidebar(true);
      } else if (window.innerWidth >= 768) {
        // On tablet, show left sidebar by default
        setShowLeftSidebar(true);
        setShowRightSidebar(false);
      } else {
        // On mobile, hide both sidebars by default
        setShowLeftSidebar(false);
        setShowRightSidebar(false);
      }
    };
    
    // Initial check
    checkScreenSize();
    
    // Add event listener for resize
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Close sidebars on mobile/tablet when ESC key is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isMobile) {
          setShowLeftSidebar(false);
          setShowRightSidebar(false);
        } else if (isTablet) {
          setShowRightSidebar(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobile, isTablet]);

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
          {/* Tablet-only buttons for opening/closing sidebars */}
          {isTablet && !isMobile && (
            <>
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
            </>
          )}
        </div>
      </header>

      {/* Main content area */}
      <div className="h-[calc(100vh-56px)] w-full mx-auto relative p-4 mt-14">
        {/* Mobile sidebar toggle buttons above drawing area - only visible on mobile */}
        {isMobile && (
          <div className="flex w-full gap-2 mb-2 z-20">
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
        )}
        
        {/* Overlay for mobile when sidebars are open */}
        <AnimatePresence>
          {(isMobile || isTablet) && (showLeftSidebar || showRightSidebar) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed top-14 bottom-0 left-0 right-0 bg-black/30 backdrop-blur-sm z-20 lg:hidden"
              onClick={() => {
                setShowLeftSidebar(isMobile ? false : showLeftSidebar);
                setShowRightSidebar(false);
              }}
            />
          )}
        </AnimatePresence>

        <div className="flex h-full">
          {/* Left Sidebar - Configuration panel */}
          <AnimatePresence>
            {((!isMobile && !isTablet && showLeftSidebar) || ((isMobile || isTablet) && showLeftSidebar)) && (
              <motion.div
                initial={(isMobile || isTablet) ? { x: "-100%" } : { opacity: 0 }}
                animate={(isMobile || isTablet) ? { x: 0 } : { opacity: 1 }}
                exit={(isMobile || isTablet) ? { x: "-100%" } : { opacity: 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                className={`
                  ${(isMobile || isTablet) ? 'fixed top-[56px] bottom-0 z-30 w-[90%] md:w-[320px]' : 'relative w-[350px]'}
                  bg-white rounded-2xl overflow-hidden border border-blue-100 h-full
                `}
                style={{
                  boxShadow: (isMobile || isTablet) ? "5px 0 20px rgba(0,0,0,0.1)" : "none"
                }}
              >
                <div className="h-full overflow-y-auto">
                  <Sidebar />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toggle for left sidebar - visible on desktop and tablet */}
          {!isMobile && (
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
          )}

          {/* Main drawing area */}
          <main className="flex-1 h-full overflow-hidden bg-white rounded-2xl shadow-sm border border-blue-100">
            <Drawing />
          </main>

          {/* Toggle for right sidebar - visible on desktop and tablet */}
          {!isMobile && (
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
          )}

          {/* Right Sidebar - Generator panel */}
          <AnimatePresence>
            {((!isMobile && !isTablet && showRightSidebar) || ((isMobile || isTablet) && showRightSidebar)) && (
              <motion.div
                initial={(isMobile || isTablet) ? { x: "100%" } : { opacity: 0 }}
                animate={(isMobile || isTablet) ? { x: 0 } : { opacity: 1 }}
                exit={(isMobile || isTablet) ? { x: "100%" } : { opacity: 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                className={`
                  ${(isMobile || isTablet) ? 'fixed top-[56px] bottom-0 right-0 z-30 w-[90%] md:w-[300px]' : 'relative w-[340px]'}
                  bg-white rounded-2xl overflow-hidden border border-blue-100 h-full
                `}
                style={{
                  boxShadow: (isMobile || isTablet) ? "-5px 0 20px rgba(0,0,0,0.1)" : "none"
                }}
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
