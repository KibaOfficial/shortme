// Copyright (c) 2024 KibaOfficial
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";

// Components
import Header from "@/components/ui/Header";
import { Providers } from "./providers";

const font = Figtree({ subsets: ["latin"] });

const baseUrl = process.env.NEXT_PUBLIC_HOSTNAME || "http://localhost:3000";

export const metadata: Metadata = {
  title: "ShortMe - URL shortener",
  description: "ShortMe is a free URL shortener that allows you to shorten your long URLs into short, easy-to-share links.",
  
  openGraph: {
    title: "ShortMe - URL shortener",
    description: "ShortMe is a free URL shortener that allows you to shorten your long URLs into short, easy-to-share links.",
    url: baseUrl, 
    type: 'website',
    images: [
      {
        url: `${baseUrl}/images/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'ShortMe - URL shortener',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: "ShortMe - URL shortener",
    description: "ShortMe is a free URL shortener that allows you to shorten your long URLs into short, easy-to-share links.",
    site: '@your_twitter_handle', 
    images: [
      `${baseUrl}/images/twitter-image.png`,
    ],
  },

  keywords: ["url shortener", "link shortener", "shorten url", "free", "custom short links"],
  robots: "index, follow", 
  authors: [
    {
      name: "KibaOfficial",
      url: "https://github.com/KibaOfficial",
    },
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href={baseUrl} />
      </head>
      <body className={font.className}>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
