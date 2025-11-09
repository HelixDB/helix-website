import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Providers } from "@/components/providers";
import { Footer } from "@/components/footer";
import { Analytics } from "@vercel/analytics/react";
import Script from 'next/script';
import { EllmoContent } from "@/components/ellmo-content";

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
      <head>
        {/* eLLMo AI GTM - Data Layer Initialization */}
        <Script id="ellmo-init" strategy="afterInteractive">
          {`(function(w){ w.ellmoDL = w.ellmoDL || []; })(window);`}
        </Script>

        {/* eLLMo AI GTM - Main Script */}
        <Script id="ellmo-gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','ellmoDL','GTM-T8HFNXSQ');`}
        </Script>
      </head>
      <body className={`${geist.variable} ${playfair.variable} font-sans antialiased`}>
        <EllmoContent />
        <Providers>
          <Analytics />
          <div className="relative flex min-h-screen flex-col">
            <main className="">{children}</main>
          </div>
        </Providers>
        {/* eLLMo AI GTM - Noscript */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-T8HFNXSQ"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
      </body>
    </html>
  );
}