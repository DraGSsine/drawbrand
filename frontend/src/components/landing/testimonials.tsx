import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Founder, Bloom Boutique",
      content: "DrawBrand transformed my simple sketch into a stunning professional logo that perfectly captures my brand's essence. The process was incredibly fast and the results exceeded my expectations!",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      initials: "SJ",
      delay: "0.2s"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Marketing Director, TechNova",
      content: "As someone with zero design skills, I was amazed by how quickly the AI understood my vision and created a logo that looks like it was made by a professional designer. Saved me thousands of dollars!",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      initials: "MC",
      delay: "0.4s"
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      role: "Independent Artist",
      content: "The logo AI created for my art business perfectly blends creativity with professionalism. I've received countless compliments on my new branding, and it took just minutes to generate!",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop",
      initials: "ER",
      delay: "0.6s"
    }
  ];

  return (
    <section id="testimonials" className="py-16 md:py-20 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 opacity-0 animate-fade-in" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-5">
            Loved by <span className="text-blue-600">Thousands</span> of Creators
          </h2>
          <p className="text-base md:text-lg max-w-2xl mx-auto text-gray-700 dark:text-gray-300">
            Hear from businesses and individuals who have transformed their brands with our AI logo creator.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial) => (
            <Card 
              key={testimonial.id}
              className="glass-card p-6 opacity-0 animate-fade-in"
              style={{ animationDelay: testimonial.delay, animationFillMode: "forwards" }}
            >
              <div className="flex items-center mb-4">
                <Avatar className="h-12 w-12 mr-4 border-2 border-blue-200 dark:border-blue-800">
                  <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                  <AvatarFallback>{testimonial.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-base md:text-lg text-gray-800 dark:text-gray-200">{testimonial.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base italic">{testimonial.content}</p>
              <div className="mt-4 flex">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
