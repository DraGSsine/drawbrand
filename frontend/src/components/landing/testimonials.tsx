"use client";

import React from "react";
import { Quote } from "lucide-react";
import Image from "next/image";

const TestimonialSection = () => {
  return (
    <section
      id="testimonials"
      className="py-20 bg-gradient-to-br from-fuchsia-200/50 to-violet-200/50"
    >
      <h2 className="text-center text-3xl sm:text-4xl lg:text-5xl font-bold mb-12 text-slate-800">
        What People Are Saying
      </h2>

      <div className="max-w-5xl mx-auto">
        <div className="relative bg-white rounded-3xl p-6 sm:p-12 shadow-[0_0_50px_-12px_rgba(0,0,0,0.1)] border border-zinc-200">
          {/* Quote Icon */}
          <div className="absolute top-6 sm:top-12 left-6 sm:left-12">
            <Quote
              size={32}
              className="text-fuchsia-500 opacity-80 fill-fuchsia-500"
            />
          </div>

          {/* Testimonial Content */}
          <div className="pt-12 sm:pt-16 pl-0 sm:pl-4">
            <h3 className="text-xl sm:text-2xl font-bold text-fuchsia-500 mb-4">
              &quot;Game-Changer for Me&quot;
            </h3>
            <p className="text-gray-700 text-base sm:text-lg mb-8 sm:mb-12 leading-relaxed">
              I&apos;ve been using Scrive for a few weeks, and it&apos;s been a true game-changer. I&apos;m more productive and spend far less time on paperwork. I&apos;d recommend it to anyone looking to get more done.
            </p>

            {/* Author Info */}
            <div className="flex items-center">
              <div className="relative w-12 h-12 sm:w-14 sm:h-14">
                <Image
                  src="/users/hsu.webp"
                  alt="Jane Doe headshot"
                  fill
                  className="rounded-full object-cover "
                />
              </div>
              <div className="ml-4">
                <div className="font-bold text-slate-900">Hua Hsu</div>
                <div className="text-sm text-slate-600">Digital Marketer</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
