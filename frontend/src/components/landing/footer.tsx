import React from "react";
import Logo from "./logo";
import Link from "next/link";
import { Linkedin, Twitter } from "../../../public/icons/SvgIcons";

const Footer = () => {
  return (
    <footer className="mt-auto bg-gradient-to-br from-blue-50 to-blue-50 dark:from-blue-950/20 dark:to-blue-950/20 backdrop-blur-sm">
      <div className="border-t border-gray-300 dark:border-gray-700">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand Column */}
            <div className="space-y-6">
              <Logo size={36} />
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed max-w-sm">
                Transform your ideas into stunning logos with DrawBrand&apos;s AI-powered platform. Create unique, professional designs that perfectly represent your brand.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">Quick Links</h3>
              <div className="flex flex-col space-y-4">
                {[
                  ["How It Works", "#how-it-works"],
                  ["Features", "#features"],
                  ["Examples", "#examples"],
                  ["Pricing", "#pricing"],
                ].map(([name, href]) => (
                  <Link
                    key={name}
                    href={href}
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                  >
                    {name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Legal */}
            <div className="space-y-6">
              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">Legal</h3>
              <div className="flex flex-col space-y-4">
                {[
                  ["Terms of Service", "/terms"],
                  ["Privacy Policy", "/privacy"],
                  ["Cookie Policy", "/cookies"],
                  ["Refund Policy", "/refund"],
                ].map(([name, href]) => (
                  <Link
                    key={name}
                    href={href}
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                  >
                    {name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Social */}
            <div className="space-y-6">
              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">Connect</h3>
              <div className="flex items-center space-x-4">
                <Link
                  target="_blank"
                  href="https://www.linkedin.com/in/yassineouchen/"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                  aria-label="Visit Yassine Ouchen's LinkedIn profile"
                >
                  <Linkedin className="w-5 h-5" />
                </Link>
                <Link
                  target="_blank"
                  href="https://twitter.com/yassin_ouchn"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                  aria-label="Visit Yassine Ouchen's Twitter profile"
                >
                  <Twitter className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-300 dark:border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="text-gray-600 dark:text-gray-400 text-sm">
                © {new Date().getFullYear()} DrawBrand. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
