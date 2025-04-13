import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Analytics } from "@vercel/analytics/react";


const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "HelixDB | Native Graph-Vector Database",
  description: "Build 10x faster with the first fully native Graph-Vector Database combining the power of graph and vector types natively in Rust to build RAG and AI applications easily",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} ${playfair.variable} font-sans antialiased`}>
        <Providers>
          <Analytics />
          <div className="relative flex min-h-screen flex-col">

            <main className="">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}