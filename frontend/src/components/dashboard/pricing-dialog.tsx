"use client"
import React, { useState, useEffect } from 'react';
import { Check, Bolt, Gem, Fire, Diamond } from '../../../public/icons/SvgIcons';
import { api } from '@/lib/axios';
import { useUserInfo } from '@/lib/queries';

interface PricingCardProps {
  plan: {
    name: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    buttonText: string;
    buttonVariant: string;
    popular?: boolean;
    delay: string;
  };
  onSelect: (plan: string) => void;
  isLoading: boolean;
  selectedPlan: string;
  subscriptionType: "monthly" | "yearly";
}

const PricingCard: React.FC<PricingCardProps> = ({
  plan,
  onSelect,
  isLoading,
  selectedPlan,
  subscriptionType,
}) => {
  const isSelected = selectedPlan === plan.name;

  return (
    <div 
      className="opacity-0 animate-fade-in flex h-full"
      style={{ animationDelay: plan.delay, animationFillMode: "forwards" }}
    >
      <div className={`glass-card relative flex flex-col w-full rounded-2xl transition-all duration-500 hover:scale-[1.02] ${
        plan.popular ? 'bg-gradient-to-br from-blue-600 to-blue-600 text-white shadow-xl shadow-blue-200' : 'bg-white border border-blue-100 shadow-lg shadow-blue-50'
      }`}>
        {plan.popular && (
          <div className="absolute border bg-white text-blue-600 border-zinc-300 py-1 text-xs px-2 font-bold rounded-full left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              Most Popular
          </div>
        )}
        
        <div className="p-6 md:p-8 flex flex-col h-full">
          <div>
            <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center transform transition-transform duration-500 hover:rotate-12 ${
              plan.popular ? "bg-blue-600/30 text-white" : "bg-blue-50 text-blue-600"
            }`}>
              {plan.name === "Starter" ? <Fire className="w-6 h-6" /> :
               plan.name === "Growth" ? <Bolt className="w-6 h-6" iconSecondary='#fff' iconPrimary='#fff' /> :
               <Gem className="w-6 h-6" />}
            </div>

            <h3 className={`text-xl font-bold mb-2 ${
              plan.popular ? "text-white" : "text-blue-900"
            }`}>
              {plan.name}
            </h3>
            
            <div className="mt-2 flex items-baseline">
              <span className={`text-3xl md:text-4xl font-bold ${
                plan.popular ? "text-white" : "text-blue-600"
              }`}>
                {plan.price}
              </span>
              <span className={`ml-1 text-sm ${
                plan.popular ? "text-blue-50" : "text-blue-600"
              }`}>
                {plan.period}
              </span>
            </div>

            <p className={`mt-2 text-sm ${
              plan.popular ? "text-blue-50" : "text-blue-600"
            }`}>
              {plan.description}
            </p>
          </div>

          <div className="flex-grow mt-8">
            <ul className="space-y-3">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-start gap-3">
                  <div className={`mt-1 ${
                    plan.popular ? "text-white" : "text-blue-600"
                  }`}>
                    <Check className="h-5 w-5" iconPrimary={plan.popular ? "#fff" : "#2563eb"} />
                  </div>
                  <span className={`text-sm leading-relaxed ${
                    plan.popular ? "text-blue-50" : "text-blue-700"
                  }`}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8">
            <button
              onClick={() => onSelect(plan.name)}
              disabled={isLoading}
              className={`w-full py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                plan.buttonVariant === 'primary'
                  ? "bg-white text-blue-600 hover:bg-blue-50"
                  : "bg-blue-600 text-white hover:bg-blue-600"
              } ${isLoading ? "opacity-75 cursor-not-allowed" : ""} flex items-center justify-center`}
            >
              {isLoading && isSelected ? (
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : null}
              {isLoading && isSelected ? "Processing..." : plan.buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SubscriptionDialog = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>("Growth");
  const [isPending, setIsPending] = useState(false);
  const {data , isLoading} = useUserInfo()
  const [subscriptionType, setSubscriptionType] = useState<"monthly" | "yearly">("monthly");
  if (data?.subscription?.status !== "none" || isLoading)
    return null;

  const handlePlanSelection = async (plan: string) => {
    setSelectedPlan(plan);
    setIsPending(true);
    
    try {
      const response = await api.post("/payments/create-checkout-session", {
        plan,
        subscriptionType,
      });
      window.location.href = response.data.url;
    } catch (error) {
      console.error(error);
      // Add your toast notification here
      setIsPending(false);
    }
  };

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
      delay: "0.2s",
      subscriptionType: "monthly"
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
      delay: "0.4s",
      subscriptionType: "monthly"
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
      delay: "0.6s",
      subscriptionType: "yearly"
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 md:p-8 max-w-6xl w-full mx-auto max-h-[90vh] overflow-y-auto">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold text-slate-800">
            Your subscription has expired
          </h2>
          <p className="text-base text-slate-600 max-w-2xl mx-auto">
            Select a plan to continue using all features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <PricingCard
              key={index}
              plan={plan}
              onSelect={handlePlanSelection}
              isLoading={isPending}
              selectedPlan={selectedPlan}
              subscriptionType={subscriptionType}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionDialog;