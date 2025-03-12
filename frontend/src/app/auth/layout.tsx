import React, { ReactNode } from "react";
import Trusted from "@/components/landing/trusted";
import { Metadata } from "next";
import Logo from "@/components/landing/logo";

export const metadata: Metadata = {
  title: {
    default: "Join scrive | Write Better LinkedIn Responses",
    template: "%s | scrive Authentication",
  },
  description:
    "Join scrive and write better LinkedIn responses. Our Chrome extension helps you craft professional and engaging replies effortlessly.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://scrive.pro/auth/signup",
    title: "Join scrive | Write Better LinkedIn Responses",
    description:
      "Write better LinkedIn responses with scrive. Our Chrome extension helps you craft professional and engaging replies effortlessly.",
    images: [
      {
        url: "https://scrive.pro/_next/image?url=%2Fbg.png&w=3840&q=75",
        width: 1200,
        height: 630,
        alt: "scrive Authentication Preview",
      },
    ],
    siteName: "scrive",
  },
  twitter: {
    card: "summary_large_image",
    title: "Join scrive | Create Your Account",
    description:
      "Write better LinkedIn responses with scrive. Our Chrome extension helps you craft professional and engaging replies effortlessly.",
    images: ["https://scrive.pro/_next/image?url=%2Fbg.png&w=3840&q=75"],
  },
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: false,
      follow: true,
      noimageindex: true,
    },
  },
  alternates: {
    canonical: "https://scrive.pro/auth/signup",
  },
};

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 p-12 relative overflow-hidden bg-gradient-to-br from-violet-600 to-violet-800">
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:64px_64px]" />

        {/* Decorative Gradients */}
        <div className="absolute -left-40 -top-40 h-[800px] w-[800px] rounded-full bg-gradient-to-tr from-violet-400/30 to-fuchsia-400/30 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-[600px] w-[600px] rounded-full bg-gradient-to-bl from-cyan-400/30 to-violet-400/30 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-violet-500/10 to-violet-500/10 blur-2xl" />

        {/* Content */}
        <div className="relative flex flex-col justify-between h-full">
          <Logo size={40} mode="ligth" textClass=" text-white " />

          <div className="space-y-8 max-w-lg">
            <div className="space-y-6">
              <h1 className="text-7xl font-bold text-white leading-[1.1] tracking-tight">
                Elevate Your
                <br />
                <span className="text-zinc-200">LinkedIn Game</span>
              </h1>
              <p className="text-xl text-violet-100 leading-relaxed">
                Craft professional LinkedIn responses with our Chrome extension. Generate new replies or refine drafts
              </p>
            </div>

            <Trusted className="text-zinc-200" />
          </div>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="flex-1 flex items-center justify-center">{children}</div>
    </div>
  );
};

export default AuthLayout;
