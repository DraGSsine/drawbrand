import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { CurvedArrowRight } from "../../../public/icons/SvgIcons";

interface ShowcaseStyle {
  name: string;
  color: "blue" | "purple" | "orange" | "green";
}

interface ShowcaseItem {
  id: number;
  before: string;
  after: string;
  title: string;
  description: string;
  styles: ShowcaseStyle[];
  gradient: string;
}

interface ShowcaseCardProps {
  item: ShowcaseItem;
}

const ShowcaseCard: React.FC<ShowcaseCardProps> = ({ item }) => {
  return (
    <div className={cn(
      "rounded-3xl p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
      item.gradient
    )}>
      {/* Before & After Container */}
      <div className="bg-white rounded-2xl p-6 relative shadow-md">
        <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-6">
          {/* Before Image */}
          <div className="relative aspect-square">
            <div className="w-full h-full bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <Image
                fill
                src={`/showcase/${item.before}`}
                alt={`Original sketch for ${item.title}`}
                className="object-contain p-4 transition-transform duration-500 hover:scale-110"
              />
            </div>
          </div>

          {/* Arrow */}
          <div className="flex items-center justify-center">
            <CurvedArrowRight className="w-14 h-14 text-blue-600/70" />
          </div>

          {/* After Image */}
          <div className="relative aspect-square">
            <div className="w-full h-full bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <Image
                fill
                src={`/showcase/${item.after}`}
                alt={`Generated logo for ${item.title}`}
                className="object-contain rounded-2xl transition-transform duration-500 hover:scale-110"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Title & Description */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
        <p className="text-sm text-gray-500 mt-2 mb-4">{item.description}</p>
        <div className="flex flex-wrap gap-2">
          {item.styles.map((style, index) => {
            // Map color names to Tailwind colors
            const colorMap = {
              blue: {
                bg: "bg-blue-100",
                text: "text-blue-700"
              },
              purple: {
                bg: "bg-purple-100",
                text: "text-purple-700"
              },
              orange: {
                bg: "bg-orange-100",
                text: "text-orange-700"
              },
              green: {
                bg: "bg-green-100",
                text: "text-green-700"
              }
            };
            
            return (
              <span
                key={index}
                className={cn(
                  "px-3 py-1 text-sm font-medium rounded-md transition-all duration-300 hover:scale-105",
                  colorMap[style.color].bg,
                  colorMap[style.color].text
                )}
              >
                {style.name}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ShowcaseCard;
