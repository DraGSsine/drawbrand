"use client";
import React from "react";
import ShowcaseCard from "@/components/showcase/ShowcaseCard";

const showcaseItems = [
  {
    id: 1,
    before: "before-airplane-basic.png",
    after: "after-airplane-basic.png",
    title: "Airplane Logo Transformation",
    description: "From basic sketch to professional logo design",
    styles: [
      { name: "Minimalist", color: "blue" as const },
      { name: "Clean", color: "green" as const }
    ],
    gradient: "bg-gradient-to-br from-blue-50 to-indigo-100"
  },
  {
    id: 2,
    before: "before-balloon-messy.png",
    after: "after-balloon-messy.png",
    title: "Balloon Logo Evolution",
    description: "Messy sketch to refined design",
    styles: [
      { name: "Playful", color: "purple" as const },
      { name: "Modern", color: "blue" as const }
    ],
    gradient: "bg-gradient-to-br from-purple-50 to-pink-100"
  },
  {
    id: 3,
    before: "before-brain-rough.png",
    after: "after-brain-rough.png",
    title: "Brain Logo Design",
    description: "Rough sketch to professional brand mark",
    styles: [
      { name: "Professional", color: "green" as const },
      { name: "Clean", color: "blue" as const }
    ],
    gradient: "bg-gradient-to-br from-blue-50 to-cyan-100"
  },
  {
    id: 4,
    before: "before-castle-pixel.png",
    after: "after-castle-pixel.png",
    title: "Castle Brand Evolution",
    description: "Pixel art to modern vector design",
    styles: [
      { name: "Retro", color: "orange" as const },
      { name: "Modern", color: "blue" as const }
    ],
    gradient: "bg-gradient-to-br from-orange-50 to-yellow-100"
  },
  {
    id: 5,
    before: "before-cat-flatGraphic.png",
    after: "after-cat-flatGraphic.png",
    title: "Cat Logo Transformation",
    description: "Flat graphic to modern illustration",
    styles: [
      { name: "Playful", color: "purple" as const },
      { name: "Modern", color: "blue" as const }
    ],
    gradient: "bg-gradient-to-br from-purple-50 to-pink-100"
  },
  {
    id: 6,
    before: "before-coffee-badgeCrest.png",
    after: "after-coffee-badgeCrest.png",
    title: "Coffee Brand Evolution",
    description: "Badge style to modern crest design",
    styles: [
      { name: "Classic", color: "green" as const },
      { name: "Premium", color: "blue" as const }
    ],
    gradient: "bg-gradient-to-br from-green-50 to-emerald-100"
  },
  {
    id: 7,
    before: "before-compass-amateur.png",
    after: "after-compass-amateur.png",
    title: "Compass Logo Design",
    description: "Amateur sketch to professional design",
    styles: [
      { name: "Professional", color: "blue" as const },
      { name: "Clean", color: "green" as const }
    ],
    gradient: "bg-gradient-to-br from-blue-50 to-indigo-100"
  },
  {
    id: 8,
    before: "before-compass-pop.png",
    after: "after-compass-pop.png",
    title: "Compass Brand Evolution",
    description: "Pop art to modern design",
    styles: [
      { name: "Pop Art", color: "orange" as const },
      { name: "Modern", color: "blue" as const }
    ],
    gradient: "bg-gradient-to-br from-orange-50 to-yellow-100"
  },
  {
    id: 9,
    before: "before-dragon-line.png",
    after: "after-dragon-line.png",
    title: "Dragon Logo Transformation",
    description: "Line art to detailed illustration",
    styles: [
      { name: "Dynamic", color: "purple" as const },
      { name: "Detailed", color: "blue" as const }
    ],
    gradient: "bg-gradient-to-br from-purple-50 to-indigo-100"
  },
  {
    id: 10,
    before: "before-hand-shaky.png",
    after: "after-hand-shaky.png",
    title: "Hand Logo Evolution",
    description: "Shaky sketch to refined design",
    styles: [
      { name: "Organic", color: "green" as const },
      { name: "Clean", color: "blue" as const }
    ],
    gradient: "bg-gradient-to-br from-green-50 to-emerald-100"
  },
  {
    id: 11,
    before: "before-hourglass-basic.png",
    after: "after-hourglass-basic.png",
    title: "Hourglass Brand Design",
    description: "Basic sketch to modern logo",
    styles: [
      { name: "Minimalist", color: "blue" as const },
      { name: "Modern", color: "purple" as const }
    ],
    gradient: "bg-gradient-to-br from-blue-50 to-cyan-100"
  },
  {
    id: 12,
    before: "before-house-wobbly.png",
    after: "after-house-wobbly.png",
    title: "House Logo Transformation",
    description: "Wobbly sketch to professional design",
    styles: [
      { name: "Clean", color: "green" as const },
      { name: "Modern", color: "blue" as const }
    ],
    gradient: "bg-gradient-to-br from-green-50 to-emerald-100"
  },
  {
    id: 13,
    before: "before-lantern-crude.png",
    after: "after-lantern-crude.png",
    title: "Lantern Brand Evolution",
    description: "Crude sketch to refined design",
    styles: [
      { name: "Classic", color: "orange" as const },
      { name: "Modern", color: "blue" as const }
    ],
    gradient: "bg-gradient-to-br from-orange-50 to-yellow-100"
  },
  {
    id: 14,
    before: "before-lightbulb-messy.png",
    after: "after-lightbulb-messy.png",
    title: "Lightbulb Logo Design",
    description: "Messy sketch to clean design",
    styles: [
      { name: "Clean", color: "blue" as const },
      { name: "Modern", color: "purple" as const }
    ],
    gradient: "bg-gradient-to-br from-blue-50 to-indigo-100"
  },
  {
    id: 15,
    before: "before-lighthouse-cartoon.png",
    after: "after-lighthouse-cartoon.png",
    title: "Lighthouse Brand Evolution",
    description: "Cartoon style to professional design",
    styles: [
      { name: "Professional", color: "green" as const },
      { name: "Classic", color: "blue" as const }
    ],
    gradient: "bg-gradient-to-br from-blue-50 to-cyan-100"
  },
  {
    id: 16,
    before: "before-lion-kawaii.png",
    after: "after-lion-kawaii.png",
    title: "Lion Logo Transformation",
    description: "Kawaii style to modern design",
    styles: [
      { name: "Cute", color: "purple" as const },
      { name: "Modern", color: "blue" as const }
    ],
    gradient: "bg-gradient-to-br from-purple-50 to-pink-100"
  },
  {
    id: 17,
    before: "before-moonboy-beginner.png",
    after: "after-moonboy-beginner.png",
    title: "Moonboy Brand Design",
    description: "Beginner sketch to professional design",
    styles: [
      { name: "Playful", color: "blue" as const },
      { name: "Modern", color: "purple" as const }
    ],
    gradient: "bg-gradient-to-br from-blue-50 to-indigo-100"
  },
  {
    id: 18,
    before: "before-mountain-mascot.png",
    after: "after-mountain-mascot.png",
    title: "Mountain Logo Evolution",
    description: "Mascot style to modern design",
    styles: [
      { name: "Nature", color: "green" as const },
      { name: "Modern", color: "blue" as const }
    ],
    gradient: "bg-gradient-to-br from-green-50 to-emerald-100"
  },
  {
    id: 19,
    before: "before-owl-iconEmoji.png",
    after: "after-owl-iconEmoji.png",
    title: "Owl Brand Transformation",
    description: "Emoji style to professional design",
    styles: [
      { name: "Playful", color: "orange" as const },
      { name: "Modern", color: "blue" as const }
    ],
    gradient: "bg-gradient-to-br from-orange-50 to-yellow-100"
  },
  {
    id: 20,
    before: "before-rocket-rough.png",
    after: "after-rocket-rough.png",
    title: "Rocket Logo Design",
    description: "Rough sketch to clean design",
    styles: [
      { name: "Dynamic", color: "blue" as const },
      { name: "Modern", color: "purple" as const }
    ],
    gradient: "bg-gradient-to-br from-blue-50 to-indigo-100"
  },
  {
    id: 21,
    before: "before-rocket-watercolor.png",
    after: "after-rocket-watercolor.png",
    title: "Rocket Brand Evolution",
    description: "Watercolor to modern design",
    styles: [
      { name: "Artistic", color: "orange" as const },
      { name: "Modern", color: "blue" as const }
    ],
    gradient: "bg-gradient-to-br from-orange-50 to-yellow-100"
  },
  {
    id: 22,
    before: "before-ship-comic.png",
    after: "after-ship-comic.png",
    title: "Ship Logo Transformation",
    description: "Comic style to professional design",
    styles: [
      { name: "Classic", color: "blue" as const },
      { name: "Modern", color: "green" as const }
    ],
    gradient: "bg-gradient-to-br from-blue-50 to-cyan-100"
  },
  {
    id: 23,
    before: "before-telescope-crude.png",
    after: "after-telescope-crude.png",
    title: "Telescope Brand Design",
    description: "Crude sketch to refined design",
    styles: [
      { name: "Scientific", color: "purple" as const },
      { name: "Modern", color: "blue" as const }
    ],
    gradient: "bg-gradient-to-br from-purple-50 to-indigo-100"
  },
  {
    id: 24,
    before: "before-three-pictorial.png",
    after: "after-three-pictorial.png",
    title: "Three Logo Evolution",
    description: "Pictorial style to modern design",
    styles: [
      { name: "Classic", color: "green" as const },
      { name: "Modern", color: "blue" as const }
    ],
    gradient: "bg-gradient-to-br from-green-50 to-emerald-100"
  },
  {
    id: 25,
    before: "before-tree-manga.png",
    after: "after-tree-manga.png",
    title: "Tree Brand Transformation",
    description: "Manga style to professional design",
    styles: [
      { name: "Nature", color: "green" as const },
      { name: "Modern", color: "blue" as const }
    ],
    gradient: "bg-gradient-to-br from-green-50 to-emerald-100"
  },
  {
    id: 26,
    before: "before-treehouse-crude.png",
    after: "after-treehouse-crude.png",
    title: "Treehouse Logo Design",
    description: "Crude sketch to refined design",
    styles: [
      { name: "Playful", color: "green" as const },
      { name: "Modern", color: "blue" as const }
    ],
    gradient: "bg-gradient-to-br from-green-50 to-emerald-100"
  },
  {
    id: 27,
    before: "before-wolf-abstract.png",
    after: "after-wolf-abstract.png",
    title: "Wolf Brand Evolution",
    description: "Abstract sketch to modern design",
    styles: [
      { name: "Bold", color: "purple" as const },
      { name: "Modern", color: "blue" as const }
    ],
    gradient: "bg-gradient-to-br from-purple-50 to-indigo-100"
  }
];

const ShowcasePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-28 pb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Logo Design Showcase
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Witness the transformation of simple sketches into professional brand marks through our AI-powered design process.
        </p>
      </section>

      {/* Showcase Grid */}
      <div className="container mx-auto px-4 pb-20 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {showcaseItems.map((item) => (
            <ShowcaseCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShowcasePage;
