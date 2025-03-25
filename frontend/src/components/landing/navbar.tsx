"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Burger, X } from "../../../public/icons/SvgIcons";
import Logo from "./logo";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "py-3 bg-background/80 backdrop-blur-lg shadow-sm"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Logo size={32} mode={isScrolled ? "dark" : "light"} />

        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="nav-link">
            Features
          </a>
          <a href="#how-it-works" className="nav-link">
            How It Works
          </a>
          <a href="#showcase" className="nav-link">
            Gallery
          </a>
          <a href="#pricing" className="nav-link">
            Pricing
          </a>
          <a href="/showcase" className="nav-link">Showcase</a>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" className="font-medium hover:bg-brand-blue/10">
            Login
          </Button>
          <Button className="btn-primary">
            Try for Free
          </Button>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-foreground focus:outline-none hover:text-brand-blue transition-colors"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Burger className="w-6 h-6" />}
        </button>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-lg p-6 border-t border-border animate-fade-in shadow-lg">
            <nav className="flex flex-col space-y-6 py-4">
              <a href="#features" className="nav-link text-lg py-2">
                Features
              </a>
              <a href="#how-it-works" className="nav-link text-lg py-2">
                How It Works
              </a>
              <a href="#showcase" className="nav-link text-lg py-2">
                Gallery
              </a>
              <a href="#pricing" className="nav-link text-lg py-2">
                Pricing
              </a>
              <div className="flex flex-col space-y-4 pt-4">
                <Button variant="ghost" className="w-full justify-center font-medium text-lg py-6 hover:bg-brand-blue/10">
                  Login
                </Button>
                <Button className="btn-primary w-full justify-center text-lg py-6">
                  Try for Free
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
