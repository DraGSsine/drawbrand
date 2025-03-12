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
    default: "Scrive | LinkedIn Message Assistant - Craft Messages That Get Responses",
    template: "%s | Scrive - LinkedIn Messaging Tool",
  },
  description:
    "Scrive helps you craft compelling LinkedIn messages that drive 3X higher response rates. Our Chrome extension uses AI to optimize your outreach, personalize templates, and improve networking results.",
  keywords: [
    "LinkedIn message assistant",
    "LinkedIn outreach tool",
    "LinkedIn message templates",
    "Chrome extension for LinkedIn",
    "LinkedIn response rates",
    "AI LinkedIn messages",
    "professional networking tool",
    "LinkedIn cold outreach",
    "message optimization",
    "LinkedIn messaging extension",
  ],
  authors: [{ name: "Scrive" }],
  creator: "Scrive",
  publisher: "Scrive",
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
    url: "https://scrive.pro",
    siteName: "Scrive - LinkedIn Message Assistant",
    title: "Scrive | Craft Better LinkedIn Messages & Boost Response Rates",
    description:
      "Transform your LinkedIn outreach with Scrive. Our Chrome extension helps you write personalized messages that get results, with AI-powered templates and message optimization.",
    images: [
      {
        url: "https://scrive.pro/og-image.png",
        width: 1200,
        height: 630,
        alt: "Scrive LinkedIn Message Assistant Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Scrive | LinkedIn Message Assistant - Get More Responses",
    description:
      "Write better LinkedIn messages and boost your response rates with Scrive. Our Chrome extension makes networking and outreach more effective with AI-powered assistance.",
    creator: "@yassin_ouchen",
    images: ["https://scrive.pro/twitter-image.png"],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  alternates: {
    canonical: "https://scrive.pro",
    languages: {
      "en-US": "https://scrive.pro",
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