"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleCheck } from "../../../public/icons/SvgIcons";

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "$9.99",
      period: "/month",
      description: "Perfect for getting started",
      features: [
        "100 logo generations per month",
        "12,000+ icons library",
        "24/7 support",
        "High resolution downloads",
        "PNG downloads"
      ],
      buttonText: "Get Started",
      buttonVariant: "outline", 
      delay: "0.2s"
    },
    {
      name: "Growth",
      price: "$14.99",
      period: "/month",
      description: "Ideal for growing businesses",
      features: [
        "unlimited logo generations",
        "12,000+ icons library",
        "24/7 support", 
        "High resolution downloads",
        "PNG downloads",
        
      ],
      buttonText: "Get Started",
      buttonVariant: "primary",
      popular: true,
      delay: "0.4s"
    },
    {
      name: "Pro",
      price: "$149",
      period: "/year",
      description: "Best value for professionals",
      features: [
        "Unlimited logo generations",
        "2 months free",
        "12,000+ icons library",
        "24/7 support",
        "High resolution downloads", 
        "PNG downloads"
      ],
      buttonText: "Get Annual Plan",
      buttonVariant: "outline",
      delay: "0.6s"
    }
  ];

  return (
    <section id="pricing" className="py-16 md:py-20 bg-gradient-to-br from-blue-50 to-blue-50 dark:from-slate-900/60 dark:to-slate-800/60">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 opacity-0 animate-fade-in" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-5">
            Simple, <span className="text-blue-600 dark:text-blue-400">Transparent</span> Pricing
          </h2>
          <p className="text-base md:text-lg max-w-2xl mx-auto text-slate-700 dark:text-slate-300">
            Choose the plan that fits your needs. No hidden fees or long-term commitments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className="opacity-0 animate-fade-in flex"
              style={{ animationDelay: plan.delay, animationFillMode: "forwards" }}
            >
              <Card className={`glass-card relative flex flex-col w-full ${plan.popular ? 'border-blue-600 shadow-lg' : 'border-slate-200 dark:border-slate-700'}`}>
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 dark:bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100">{plan.name}</CardTitle>
                  <div className="mt-2 flex items-baseline">
                    <span className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">{plan.price}</span>
                    {plan.period && <span className="text-slate-600 dark:text-slate-400 ml-1">{plan.period}</span>}
                  </div>
                  <CardDescription className="mt-2 text-sm md:text-base text-slate-700 dark:text-slate-300">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <CircleCheck className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mr-2" iconPrimary="#fff" />
                        <span className="text-sm md:text-base text-slate-700 dark:text-slate-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className={`w-full ${plan.buttonVariant === 'primary' ? "bg-blue-600 text-white hover:bg-blue-600/90" : "bg-white border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-slate-800"}`}
                  >
                    {plan.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
