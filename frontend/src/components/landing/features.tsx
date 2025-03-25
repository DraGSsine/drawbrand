"use client";

import React from "react";
import { CircleCheck, Fingerprint, Sparkles, GameBoard , Bucket, Download } from "../../../public/icons/SvgIcons";

const LogoFeatures = () => {
  const features = [
    {
      icon: <Fingerprint className="w-10 h-10 text-brand-purple" />,
      title: "100% Unique Designs",
      description: "Every logo created is completely unique and tailored to your needs, never recycled or templated.",
      delay: "0.2s"
    },
    {
      icon: <Sparkles className="w-10 h-10 text-brand-purple" />,
      title: "Fast & Creative",
      description: "Get professional logo options in seconds, not days or weeks. Save time without sacrificing quality.",
      delay: "0.3s"
    },
    {
      icon: <GameBoard className="w-10 h-10 text-brand-purple" />,
      title: "Multiple Iterations",
      description: "Generate unlimited variations until you find the perfect logo that matches your vision.",
      delay: "0.4s"
    },
    {
      icon: <Bucket className="w-10 h-10 text-brand-purple" />,
      title: "Customizable Styles",
      description: "Choose from various styles and aesthetics to match your brand identity and preferences.",
      delay: "0.5s"
    },
    {
      icon: <Download className="w-10 h-10 text-brand-purple" />,
      title: "High-Res Downloads",
      description: "Download your logo in multiple formats (PNG, SVG, JPG) perfect for both digital and print use.",
      delay: "0.6s"
    },
    {
      icon: <CircleCheck className="w-10 h-10 text-brand-purple" />,
      title: "Commercial License",
      description: "All logos come with full commercial usage rights so you can use them for any business purpose.",
      delay: "0.7s"
    }
  ];

  return (
    <section id="features" className="section-padding relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 opacity-0 animate-fade-in" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
          <h2 className="heading-lg mb-4">
            Why Choose <span className="bg-blue-purple-gradient bg-clip-text text-transparent">LogoMagic AI</span>
          </h2>
          <p className="paragraph max-w-2xl mx-auto">
            Our AI logo generator combines advanced technology with design expertise to deliver outstanding results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="glass-card p-6 opacity-0 animate-fade-in"
              style={{ animationDelay: feature.delay, animationFillMode: "forwards" }}
            >
              <div className="bg-primary/10 rounded-xl w-16 h-16 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Background decorations */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-blue-200/20 dark:bg-blue-900/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-purple-200/20 dark:bg-purple-900/10 rounded-full blur-3xl -z-10"></div>
    </section>
  );
};

export default LogoFeatures;
