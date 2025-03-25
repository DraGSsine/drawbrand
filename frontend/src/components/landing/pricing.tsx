"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleCheck } from "../../../public/icons/SvgIcons";

const Pricing = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for trying out our AI logo creator",
      features: [
        "5 logo generations",
        "Basic customization",
        "JPG downloads",
        "Standard quality"
      ],
      buttonText: "Start Free",
      buttonVariant: "outline",
      delay: "0.2s"
    },
    {
      name: "Pro",
      price: "$19",
      period: "/month",
      description: "Ideal for businesses and professionals",
      features: [
        "Unlimited logo generations",
        "Advanced customization",
        "PNG & SVG downloads",
        "High resolution",
        "Commercial license",
        "Priority processing"
      ],
      buttonText: "Get Started",
      buttonVariant: "primary",
      popular: true,
      delay: "0.4s"
    },
    {
      name: "Enterprise",
      price: "$49",
      period: "/month",
      description: "For teams and agencies with advanced needs",
      features: [
        "Everything in Pro",
        "API access",
        "Batch processing",
        "Team collaboration",
        "Dedicated support",
        "Custom integrations"
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline",
      delay: "0.6s"
    }
  ];

  return (
    <section id="pricing" className="section-padding bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/20 dark:to-violet-950/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 opacity-0 animate-fade-in" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
          <h2 className="text-4xl font-extrabold mb-6">
            Simple, <span className="bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">Transparent</span> Pricing
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-gray-700 dark:text-gray-300">
            Choose the plan that fits your needs. No hidden fees or long-term commitments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className="opacity-0 animate-fade-in flex"
              style={{ animationDelay: plan.delay, animationFillMode: "forwards" }}
            >
              <Card className={`glass-card relative flex flex-col w-full ${plan.popular ? 'border-indigo-500 shadow-lg' : ''}`}>
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-200">{plan.name}</CardTitle>
                  <div className="mt-2 flex items-baseline">
                    <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{plan.price}</span>
                    {plan.period && <span className="text-gray-600 dark:text-gray-400 ml-1">{plan.period}</span>}
                  </div>
                  <CardDescription className="mt-2 text-gray-700 dark:text-gray-300">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <CircleCheck className="h-5 w-5 text-indigo-500 dark:text-indigo-400 flex-shrink-0 mr-2" />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className={`w-full ${plan.buttonVariant === 'primary' ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'border-indigo-600 text-indigo-600 hover:bg-indigo-50'}`}
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
