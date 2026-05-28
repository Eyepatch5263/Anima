import type { Metadata } from "next";
import { Inria_Sans } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { Analytics } from "@vercel/analytics/next"

const inriaSans = Inria_Sans({
  variable: "--font-inria-sans",
  subsets: ["latin"],
  weight: "400",
  style: "normal",

});

export const metadata: Metadata = {
  title: "Anima — AI-Powered Anime Discovery",
  description:
    "Discover anime through narrative intelligence. AI-powered emotional mapping, philosophical depth analysis, and spoiler-safe recommendations.",
  icons: {
    icon: [
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://anima.pratyush.works",
    title: "Anima — AI-Powered Anime Discovery",
    description: "Discover anime through narrative intelligence, emotional mapping, and philosophic depth analysis.",
    siteName: "Anima",
    images: [
      {
        url: "/ai-1.webp",
        width: 1200,
        height: 630,
        alt: "Anima — AI-Powered Anime Discovery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Anima — AI-Powered Anime Discovery",
    description: "Discover anime through narrative intelligence, emotional mapping, and philosophic depth analysis.",
    images: ["/ai-1.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inriaSans.className} antialiased dark`}
      style={{ colorScheme: "dark", backgroundColor: "#141414" }}
    >
      <head>
        <meta name="google-site-verification" content="SUz7wHgUD9NgYm8u4pn2YqX5YNDmlBagjhS0T3nx1Bk" />
      </head>
      <Providers>
        <body className="min-h-screen">
          {children}
          <Analytics />
        </body>
      </Providers>
    </html>
  );
}
