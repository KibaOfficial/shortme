import type { Metadata, Viewport } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";

// Components
import Header from "@/components/ui/Header";

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
        url: `${baseUrl}/logo.jpeg`,
        width: 1200,
        height: 630,
        alt: 'ShortMe - URL shortener',
      },
    ],
    locale: "en_US",
    siteName: "ShortMe",
  },

  twitter: {
    card: 'summary_large_image',
    title: "ShortMe - URL shortener",
    description: "ShortMe is a free URL shortener that allows you to shorten your long URLs into short, easy-to-share links.",
    site: '@KibaOfficialOwO',
    creator: '@KibaOfficialOwO',
    images: [
      `${baseUrl}/logo.jpeg`,
    ],
  },

  keywords: ["url shortener", "link shortener", "shorten url", "free", "custom short links"],
  robots: "index, follow", 
  authors: [
    {
      name: "KibaOfficial",
      url: "https://github.com/KibaOfficial",
    },
  ],
  creator: "KibaOfficial",
  applicationName: "ShortMe",
  manifest: `${baseUrl}/site.webmanifest`,
  icons: [
    {
      rel: "icon",
      url: `${baseUrl}/favicon.ico`,
      type: "image/x-icon",
    },
    {
      rel: "apple-touch-icon",
      url: `${baseUrl}/logo.jpeg`,
      sizes: "180x180",
    },
  ],
};

export const viewport: Viewport = {
  themeColor: "#317EFB",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href={baseUrl} />
      </head>
      <body className={font.className}>
        <Header />
        {children}
      </body>
    </html>
  );
}
