"use client";
import React from "react";
import ShowcaseCard from "@/components/showcase/ShowcaseCard";

const logoShowcaseItems = [
  {
    id: 1,
    before: "before-dragon-line.png",
    after: "after-dragon-line.png",
    title: "Dragon Logo Design",
    description: "Line art to detailed illustration",
    styles: [
      { name: "Dynamic", color: "purple" as const },
      { name: "Detailed", color: "blue" as const }
    ],
    gradient: "bg-purple-50"
  },
  {
    id: 2,
    before: "before-castle-pixel.png",
    after: "after-castle-pixel.png",
    title: "Castle Brand Evolution",
    description: "Pixel art to modern vector design",
    styles: [
      { name: "Retro", color: "orange" as const },
      { name: "Modern", color: "blue" as const }
    ],
    gradient: "bg-orange-50"
  },
  {
    id: 3,
    before: "before-coffee-badgeCrest.png",
    after: "after-coffee-badgeCrest.png",
    title: "Coffee Brand Evolution",
    description: "Badge style to modern crest design",
    styles: [
      { name: "Classic", color: "green" as const },
      { name: "Premium", color: "blue" as const }
    ],
    gradient: "bg-green-50"
  },
  {
    id: 4,
    before: "before-tree-manga.png",
    after: "after-tree-manga.png",
    title: "Tree Brand Transformation",
    description: "Manga style to professional design",
    styles: [
      { name: "Nature", color: "green" as const },
      { name: "Modern", color: "blue" as const }
    ],
    gradient: "bg-green-50"
  },
  {
    id: 5,
    before: "before-ship-comic.png",
    after: "after-ship-comic.png",
    title: "Ship Logo Transformation",
    description: "Comic style to professional design",
    styles: [
      { name: "Classic", color: "blue" as const },
      { name: "Modern", color: "green" as const }
    ],
    gradient: "bg-blue-50"
  },
  {
    id: 6,
    before: "before-mountain-mascot.png",
    after: "after-mountain-mascot.png",
    title: "Mountain Logo Evolution",
    description: "Mascot style to modern design",
    styles: [
      { name: "Nature", color: "green" as const },
      { name: "Modern", color: "blue" as const }
    ],
    gradient: "bg-green-50"
  }
];

const LogoShowcase = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-blue-100/40 blur-3xl"></div>
      <div className="absolute top-1/3 -left-20 w-40 h-40 rounded-full bg-purple-100/40 blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Transform Your <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Sketches</span> Into <span className="bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">Professional Logos</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Our AI specializes in turning hand-drawn sketches into polished, production-ready logos in various styles. See the transformations below!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-7xl mx-auto">
          {logoShowcaseItems.map((item) => (
            <ShowcaseCard key={item.id} item={item} />
          ))}
        </div>

        <div className="text-center mt-16">
          <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1">
            See More Transformations
          </button>
        </div>
      </div>
    </section>
  );
};

export default LogoShowcase;
