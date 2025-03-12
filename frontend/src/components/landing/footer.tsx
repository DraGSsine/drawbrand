import React from "react";
import Logo from "./logo";
import { ArrowRight, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="mt-auto bg-white backdrop-blur-sm">
      {/* Call-to-action Section */}
      <section className="text-center py-32 max-w-7xl mx-auto px-4">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl lg:text-5xl font-bold text-zinc-800 tracking-tight leading-tight">
            Ready to Transform Your Communications?
          </h2>
          <p className="mt-4 text-xl font-medium lg:text-2xl text-zinc-600">
            Get started with scrive today and craft perfect responses every time
          </p>
        </div>
        <div className="mt-8 flex flex-col items-center gap-4">
          <Link 
            href="/auth/signup"
            className=" flex items-center justify-center h-14 px-8 rounded-full font-medium bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-200 hover:shadow-xl hover:shadow-violet-200 transition-all duration-200 group"
          >
            Try it free
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <div className=" bg-zinc-50 border-t pb-10 border-zinc-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 max-w-7xl mx-auto px-4">
          {/* Brand Column */}
          <div className="space-y-4">
            <Logo size={30} mode="dark" />
            <p className="text-zinc-500 text-sm max-w-sm">
              Your intelligent companion for crafting the perfect LinkedIn
              responses, powered by advanced AI
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex justify-end flex-wrap gap-x-12 gap-y-4">
            {[
              ["Testimonials ", "#testimonials"],
              ["Pricing", "#pricing"],
              ["Terms", "/terms"],
              ["Privacy", "/privacy"],
            ].map(([name, href]) => (
              <Link
                key={name}
                href={href}
                className="text-sm text-zinc-500 hover:text-violet-500 transition-colors"
              >
                {name}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-200">
          <div className="flex flex-col md:flex-row md:items-center max-w-7xl mx-auto justify-between gap-4 px-4">
            <div className="text-zinc-500 text-sm">
              © {new Date().getFullYear()} scrive. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <Link
                target="_blank"
                href="https://www.linkedin.com/in/yassineouchen/"
                className="text-zinc-400 hover:text-blue-500 transition-colors"
                aria-label="Visit Yassine Ouchen's LinkedIn profile"
              >
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link
                target="_blank"
                href="https://twitter.com/yassin_ouchn"
                className="text-zinc-400 hover:text-blue-500 transition-colors"
                aria-label="Visit Yassine Ouchen's Twitter profile"
              >
                <Twitter className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
