import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "DrawBrand | Sketch to Logo Converter",
    template: "%s | DrawBrand - Sketch to Logo AI Tool",
  },
  description:
    "DrawBrand transforms your sketches and images into professional logos using AI. Convert your design ideas into stunning, ready-to-use logos with our powerful conversion tool.",
  keywords: [
    "sketch to logo",
    "AI logo generator",
    "image to logo converter",
    "logo design tool",
    "AI design converter",
    "professional logo maker",
    "drawing to logo",
    "logo transformation",
    "brand design tool",
    "AI branding assistant",
  ],
  authors: [{ name: "DrawBrand" }],
  creator: "DrawBrand",
  publisher: "DrawBrand",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://drawbrand.art",
    siteName: "DrawBrand - Sketch to Logo Converter",
    title: "DrawBrand | Transform Sketches into Professional Logos",
    description:
      "Turn your sketches and images into professional logos with DrawBrand. Our AI-powered tool helps you create stunning logos from your design ideas quickly and efficiently.",
    images: [
      {
        url: "https://drawbrand.art/og-image.png",
        width: 1200,
        height: 630,
        alt: "DrawBrand Sketch to Logo Converter Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DrawBrand | AI-Powered Sketch to Logo Converter",
    description:
      "Transform your sketches and images into professional logos with DrawBrand. Create stunning brand identities with our AI-powered conversion tool.",
    creator: "@yassin_ouchen",
    images: ["https://drawbrand.art/twitter-image.png"],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  alternates: {
    canonical: "https://drawbrand.art",
    languages: {
      "en-US": "https://drawbrand.art",
    },
  },
  category: "productivity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}