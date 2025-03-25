import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Bolt, BadgeCheck } from "../../../public/icons/SvgIcons";

const WhyUs = () => {
  const features = [
    {
      title: "Fast and User-Friendly",
      description: "Transform your image into a logo in seconds with our intuitive interface. No design skills needed to get professional results.",
      icon: <Bolt className="w-6 h-6 text-brand-orange" />
    },
    {
      title: "Endless Creative Possibilities",
      description: "Generate and customize multiple unique logo options from a single image. Find the perfect match for your brand identity.",
      icon: <Sparkles className="w-6 h-6 text-brand-purple" />
    },
    {
      title: "Commercial Usage Rights",
      description: "All logos created with our platform come with full commercial usage rights, so you can use them confidently in your business.",
      icon: <BadgeCheck className="w-6 h-6 text-brand-blue" />
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-1 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="glass-effect rounded-2xl transition-all duration-300 hover:shadow-glass-lg overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start">
                      <div className="mr-4 mt-1">{feature.icon}</div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="order-1 lg:order-2 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
              Why Choose <span className="bg-gradient-to-r from-brand-blue to-brand-purple bg-clip-text text-transparent">Sologo AI</span> Image to Logo?
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8">
              Take your logo to the next level with our AI-powered platform. Whether you're a startup, small business, or established brand, our tool transforms your ideas into professional logos instantly.
            </p>
            <div className="flex flex-col space-y-4">
              <div className="flex items-start">
                <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">1</span>
                <p className="text-muted-foreground">Upload any image that represents your brand idea</p>
              </div>
              <div className="flex items-start">
                <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">2</span>
                <p className="text-muted-foreground">Our AI analyzes and transforms it into professional logo options</p>
              </div>
              <div className="flex items-start">
                <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">3</span>
                <p className="text-muted-foreground">Choose your favorite design and customize to perfection</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
