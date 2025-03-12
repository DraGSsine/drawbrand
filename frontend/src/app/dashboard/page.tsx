"use client";

import React from "react";
import dynamic from "next/dynamic";

const DynamicDrawing = dynamic(() => import("../components/Drawing"), {
  ssr: false,
  loading: () => <p>Loading drawing canvas...</p>
});

export default function DashboardPage() {
  return (
    <div className="w-full h-full">
      <DynamicDrawing />
    </div>
  );
}
