import type { Metadata } from "next";
import { Inria_Sans } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import BackgroundParticles from "./components/BackgroundParticles";

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
      <Providers>
        
        <body className="min-h-screen noise-overlay">{children}</body>
      </Providers>
    </html>
  );
}
