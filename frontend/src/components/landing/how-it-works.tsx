import React from "react";
import { Sparkles, WandSparkles } from "lucide-react";
import Image from "next/image";

function WindowCard({
  highlightedText,
  firstPartRegularText,
  children,
  icon,
  secondPartRegulatText,
}: {
  highlightedText: string;
  firstPartRegularText: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  secondPartRegulatText?: string;
}) {
  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-xl pt-10 px-10 relative overflow-hidden border border-zinc-200 shadow-[0_0_50px_-12px_rgba(0,0,0,0.1)]">
      <div className="flex z-10 flex-col gap-2 mb-8">
        <h2 className="text-xl font-semibold lg:text-2xl">
          {firstPartRegularText}{" "}
          <span className="inline-flex items-center mr-2 relative">
            <span className="absolute inset-0 bg-blue-100 rounded-full" />
            {icon}
            <span className=" text-blue-800 relative px-2">{highlightedText}</span>
          </span>
          {secondPartRegulatText}
        </h2>
      </div>
      <div className="bg-white z-10 backdrop-blur-sm rounded-t-xl relative p-8 shadow-sm border-l border-r border-t border-zinc-200">
        <div className="flex gap-2 absolute top-4 left-4">
          <div className="w-3 h-3 rounded-full bg-red-400/90" />
          <div className="w-3 h-3 rounded-full bg-amber-400/90" />
          <div className="w-3 h-3 rounded-full bg-emerald-400/90" />
        </div>
        <div className="mt-8">{children}</div>
      </div>
      <div className="h-1/2 w-1/2 z-0 absolute bottom-0 left-0 bg-gradient-to-t from-blue-100 via-blue-100 to-white"></div>
      <div className="h-1/2 w-1/2 z-0 absolute bottom-0 right-0 bg-gradient-to-t from-blue-100 via-blue-100 to-white"></div>
    </div>
  );
}

function HowItWorks() {
  return (
    <div id="howItWorks" className="max-w-6xl py-32 mx-auto px-6">
      <div className="space-y-4 text-center mb-16">
        <h2 className="text-4xl font-semibold text-gray-900">
          How It Works
        </h2>
        <p className="text-gray-600 text-xl max-w-2xl mx-auto">
          Effortlessly create and refine LinkedIn messages with AI. Craft impactful content and enhance your drafts for clarity.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* First Card */}
        <WindowCard
          firstPartRegularText="Write a better LinkedIn message"
          highlightedText="Quickly"
          secondPartRegulatText="in seconds"
          icon={<WandSparkles className="w-5 h-5 text-blue-800 relative ml-2" />}
        >
          <Image
            src="/part1.gif"
            width={500}
            height={500}
            alt="Generate a new LinkedIn message"
          />
        </WindowCard>

        {/* Second Card */}
        <WindowCard
          firstPartRegularText="Polish your LinkedIn drafts with AI"
          highlightedText="Assistance"
          secondPartRegulatText="for a pro touch"
          icon={<Sparkles className="w-5 h-5 text-blue-800 relative ml-2" />}
        >
          <Image
            src="/part2.gif"
            width={500}
            height={500}
            alt="Refine your LinkedIn message"
          />
        </WindowCard>
      </div>
    </div>
  );
}

export default HowItWorks;
