"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Burger, X } from "../../../public/icons/SvgIcons";
import Logo from "./logo";
import Link from "next/link";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 bg-white/80 backdrop-blur-lg shadow-sm"
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Logo size={30} />

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/#testimonials" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
            Testimonials
          </Link>
          <Link href="/#why-us" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
            Why Us
          </Link>
          <Link href="/#pricing" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
            Pricing
          </Link>
          <Link href="/showcase" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">Showcase</Link>
        </nav>

        <div className="hidden md:flex items-center space-x-3">
          <Link href="/auth/signin" className="font-medium hover:bg-blue-50 hover:text-blue-600 rounded-full p-2 w-28 text-center">
            Login
          </Link>
          <Link href="/auth/signup" className="bg-blue-600 rounded-full hover:bg-blue-600 text-white p-2 w-28 text-center">
            Try for Free
          </Link>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden rounded-full text-gray-700 focus:outline-none hover:text-blue-600 transition-colors"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Burger className="w-6 h-6" />}
        </button>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg p-5 border-t border-gray-100 animate-fade-in shadow-lg">
            <nav className="flex flex-col space-y-4 py-3">
              <Link href="/#testimonials" className="text-base font-medium py-2 text-gray-700 hover:text-blue-600">
                Testimonials
              </Link>
              <Link href="/#how-it-works" className="text-base font-medium py-2 text-gray-700 hover:text-blue-600">
                How It Works
              </Link>
              <Link href="/#pricing" className="text-base font-medium py-2 text-gray-700 hover:text-blue-600">
                Pricing
              </Link>
              <div className="flex flex-col space-y-3 pt-3">
              <Link href="/auth/signup" className="bg-white border border-zinc-10 rounded-full hover:bg-zinc-100 text-blue-600 p-2 w-28 text-center">
              Login
                </Link>
                <Link href="/auth/signup" className="bg-blue-600 rounded-full hover:bg-blue-600 text-white p-2 w-28 text-center">
                Try for Free
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
