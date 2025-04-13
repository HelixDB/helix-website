"use client";
/// <reference types="three" />
import React, { useState } from "react";
import { Hero } from "@/components/sections/hero";
import { Install } from "@/components/sections/install";
import { Better } from "@/components/sections/better";
import { PrecompiledQueries } from "@/components/sections/precompiled-queries";
import UseCases from "@/components/sections/use-cases";
import { Button } from "@/components/ui/button";
import { PricingSection } from "@/components/sections/pricing-section";
import { DemoSection } from "@/components/sections/demo-section";
import { motion } from "framer-motion";
import { Github } from "lucide-react";
import { ComparisonSection } from "@/components/sections/comparison-section";
import { FaDiscord } from "react-icons/fa";
import { SocialLinks } from "@/components/ui/social-links";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const pricingTiers = [
  /* {
    name: "Free",
    description: "Download HelixDB and use it locally for free!",
    onDemandPrice: 0,
    reservedPrice: 0,
    features: [
      "Community support",
      "Public documentation"
    ],
    callToAction: "Get Started",
    callToActionLink: "https://github.com/HelixDB/helix-db"
  }, */
  {
    name: "Small",
    description: "For independent developers and working on side projects",
    onDemandPrice: 0.10,
    reservedPrice: 50,
    features: [
      "730 hours of free compute",
      "2v CPU, 4GB RAM",
      "Dedicated cloud instance",
      "Unlimited writes and requests",
      "Priority support"
    ],
    highlighted: true,
    callToAction: "Start Free Trial",
    callToActionLink: "/signup"
  },
  {
    name: "Medium",
    description: "For independent developers and small teams",
    onDemandPrice: 0.20,
    reservedPrice: 100,
    features: [
      "2v CPU, 8GB RAM",
      "Dedicated cloud instance",
      "Unlimited writes and requests",
      "Priority support",

    ],
    callToAction: "Get Started",
    callToActionLink: "/signup"
  },
  {
    name: "Large",
    description: "For medium to large teams and organizations",
    onDemandPrice: 0.50,
    reservedPrice: 250,
    features: [
      "4v CPU, 16GB RAM",
      "Dedicated cloud instance",
      "Unlimited writes and requests",
      "Priority support",
    ],
    callToAction: "Get Started",
    callToActionLink: "/signup"
  },
  {
    name: "X-Large",
    description: "For large teams and organizations",
    onDemandPrice: 1,
    reservedPrice: 500,
    features: [
      "8v CPU, 32GB RAM",
      "Dedicated cloud instance",
      "Unlimited writes and requests",
      "Priority support",
    ],
    callToAction: "Get Started",
    callToActionLink: "/signup"
  }
];
export default function Home() {

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden">
      <Header />
      <Hero />
      <Install />
      <Better />
      {<PrecompiledQueries />}
      <ComparisonSection />
      <UseCases />
      <PricingSection
        title="Simple, transparent pricing"
        subtitle="Helix prices can be used on demand or reserved. No hidden fees, no surprises."
        tiers={pricingTiers}
        frequencies={["on demand", "reserved"]}
      />
      <motion.div
        variants={fadeInUp}
        className="py-16 bg-gradient-to-b from-muted/30 to-background"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-4"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
              Join Our Growing Community
            </h2>
            <p className="text-xl  max-w-2xl mx-auto">
              Be part of the next generation of graph database technology.
              Connect with developers and innovators building the future.
            </p>
          </motion.div>
          <div className=" text-center space-y-8">
            <div className="flex justify-center">
              <SocialLinks iconSize={24} className="gap-8" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-lg px-8 shadow-lg w-full sm:w-1/2"
                  asChild
                >
                  <a
                    href="https://discord.gg/helixdb"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3"
                  >
                    <FaDiscord className="w-5 h-5" />
                    <span className="font-medium">Join Discord</span>
                  </a>
                </Button>
                <Button
                  size="lg"
                  className="text-lg px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20 w-full sm:w-1/2"
                  asChild
                >
                  <a
                    href="https://github.com/HelixDB/helix-db"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3"
                  >
                    <Github className="w-5 h-5" />
                    <span className="font-medium">Star on GitHub</span>
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
      <DemoSection />

      <Footer />
    </div>
  );
}
