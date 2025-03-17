"use client";

import React, { useState } from "react";
import Drawing from "../../components/dashboard/Drawing";
import RigthSideBar from "@/components/dashboard/RigthSideBar";
import Sidebar from "@/components/dashboard/sidebar";
import { Button } from "@/components/ui/button";
import { MessageMinus, X } from "../../../public/icons/SvgIcons";

export default function DashboardPage() {
  // State to control sidebar visibility
  const [showLeftSidebar, setShowLeftSidebar] = useState(false);
  const [showRightSidebar, setShowRightSidebar] = useState(false);

  return (
    <div className="h-screen w-screen px-8 pt-20 pb-5 overflow-hidden max-w-8xl mx-auto">
      {/* Main layout container */}
      <div className="flex h-full relative">
        {/* Left Sidebar - Configuration panel */}
        <div
          className={`fixed lg:relative z-40 h-full bg-white dark:bg-gray-900  transition-all duration-300 ease-in-out
                     ${showLeftSidebar ? "left-0" : "-left-full lg:left-0"} w-80`}
        >
          <Sidebar />

          {/* Close button for mobile */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowLeftSidebar(false)}
            className="absolute top-2 right-2 lg:hidden"
          >
            <X size={20} className="h-5 w-5" />
          </Button>
        </div>

        {/* Main content area - Drawing canvas takes most space */}
        <div className="flex-1 h-full flex flex-col overflow-hidden">
          {/* Configure buttons for mobile - visible up to 1024px */}
          <div className="flex justify-between p-2 lg:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLeftSidebar(true)}
              className="flex items-center gap-1"
            >
              <MessageMinus className="h-4 w-4" />
              Configure
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRightSidebar(true)}
            >
              Details
            </Button>
          </div>

          {/* Drawing canvas container */}
          <Drawing />
        </div>

        {/* Right Sidebar */}
        <div
          className={`fixed lg:relative z-40 h-full bg-white dark:bg-gray-900  transition-all duration-300 ease-in-out
                     ${showRightSidebar ? "right-0" : "-right-full lg:right-0"} w-80`}
        >
          <RigthSideBar />

          {/* Close button for mobile */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowRightSidebar(false)}
            className="absolute top-2 left-2 lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
