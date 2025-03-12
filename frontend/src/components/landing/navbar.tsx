"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import Logo from "./logo";
import Link from "next/link";

const links = {
  testimonials: "Testimonials",
  howItWorks: "How it Works",
  pricing: "Pricing",
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Optimize scroll listener with throttling
  useEffect(() => {
    let scrollTimer: NodeJS.Timeout | null ;
    const handleScroll = () => {
      if (!scrollTimer) {
        scrollTimer = setTimeout(() => {
          setHasScrolled(window.scrollY > 20);
          scrollTimer = null;
        }, 100);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimer) clearTimeout(scrollTimer);
    };
  }, []);

  // Close menu when pressing escape key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, [isMenuOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        hasScrolled
          ? "bg-white/70 shadow-sm backdrop-blur-md"
          : "bg-transparent"
      )}
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Logo size={32} mode="dark" />

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList className="flex items-center gap-6">
                {Object.entries(links).map(([key, value]) => (
                  <NavigationMenuItem key={key}>
                    <NavigationMenuLink
                      href={`#${key}`}
                      className="text-zinc-600 hover:text-zinc-800 transition-colors p-2 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
                    >
                      {value}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
                <NavigationMenuItem>
                  <Button
                    variant="ghost"
                    className="text-violet-500 hover:text-violet-500 bg-white/30 font-medium rounded-full border border-violet-400 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    asChild
                  >
                    <NavigationMenuLink href="/auth/signin">
                      Sign In
                    </NavigationMenuLink>
                  </Button>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Button
                    className="bg-violet-500 hover:bg-violet-600 rounded-full text-white font-medium px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    asChild
                  >
                    <NavigationMenuLink href="/auth/signup">
                      Try it free
                    </NavigationMenuLink>
                  </Button>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Mobile Menu Button */}
          <Button
            className="md:hidden bg-white hover:bg-white rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-zinc-700" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6 text-zinc-700" aria-hidden="true" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        id="mobile-menu"
        className={cn(
          "fixed top-0 right-0 bottom-0 z-40 w-64 bg-white shadow-xl transition-transform duration-300 ease-in-out transform md:hidden",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
        aria-hidden={!isMenuOpen}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <Logo size={28} mode="dark" />
          <Button
            className="bg-white hover:bg-white rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-6 w-6 text-zinc-700" aria-hidden="true" />
          </Button>
        </div>
        <nav className="px-4 pb-6" aria-label="Mobile navigation">
          {Object.entries(links).map(([key, value]) => (
            <Link
              key={key}
              href={`#${key}`}
              className="block px-3 py-3 text-base text-zinc-600 hover:text-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              {value}
            </Link>
          ))}
          <div className="mt-6 space-y-3 px-3">
            <Button
              variant="ghost"
              className="w-full justify-center text-violet-500 hover:text-violet-600 hover:bg-violet-50 border border-violet-200 p-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
              asChild
            >
              <Link href="/auth/signin">Sign In</Link>
            </Button>
            <Button
              className="w-full bg-violet-500 hover:bg-violet-600 text-white p-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
              asChild
            >
              <Link href="/auth/signup">Try it free</Link>
            </Button>
          </div>
        </nav>
      </div>

      {/* Backdrop */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setIsMenuOpen(false)}
          tabIndex={-1}
          aria-hidden="true"
        />
      )}
    </nav>
  );
};

export default Navbar;
