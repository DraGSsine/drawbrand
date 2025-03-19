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
      {/* Main layout container using CSS Grid */}
      <div className="h-full grid grid-cols-1 lg:grid-cols-[330px_1fr_400px] gap-4">
        {/* Left Sidebar - Configuration panel */}
        <div
          className={`fixed lg:static z-40 h-full transition-all duration-300 ease-in-out
                     ${showLeftSidebar ? "left-8" : "-left-full"} lg:left-auto`}
        >
          <Sidebar />

          {/* Close button for mobile */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowLeftSidebar(false)}
            className="absolute top-2 right-2 lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Main content area - Drawing canvas */}
        <div className="h-full flex flex-col overflow-hidden">
          {/* Configure buttons for mobile - visible up to lg breakpoint */}
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
          className={`fixed lg:static z-40 h-full transition-all duration-300 ease-in-out
                     ${showRightSidebar ? "right-8" : "-right-full"} lg:right-auto`}
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
