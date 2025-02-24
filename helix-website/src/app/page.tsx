"use client";

import React, { useEffect, useState } from "react";
import { Github } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { WavyBackground } from "@/components/ui/wavy-background";
import { Sandbox } from "@/components/ui/sandbox";
import { FeaturesSection } from "@/components/sections/features";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/sections/hero";
import { Logo } from "@/components/ui/logo";
import { motion, useScroll, useTransform } from "framer-motion";
import { CodeBlock } from "@/components/ui/code-block";
import { Card } from "@/components/ui/card";
import { Database, Network, Search, Brain, Shield, Sparkles, Lightbulb, Zap, ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQSection } from "@/components/sections/faq";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function Home() {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();

  const blurOpacity = useTransform(
    scrollY,
    [0, 200], // Adjust scroll range
    [0, 1]    // Opacity range
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <div className="relative w-full">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <WavyBackground
          className="w-full h-full"
          blur={25}
          backgroundFill={currentTheme === "dark" ? "#000000" : "#ffffff"}
        />
        <motion.div
          className="absolute inset-0 backdrop-blur-3xl bg-background/50"
          style={{ opacity: blurOpacity }}
        />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="w-full"
        >
          {/* Main Content */}
          <motion.div variants={fadeInUp}>
            <HeroSection />
          </motion.div>

          <motion.div variants={fadeInUp}>
            <FeaturesSection />
          </motion.div>

          {/* Sandbox */}
          <motion.div
            variants={fadeInUp}
            id="sandbox"
            className="py-20"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Try HelixQL
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Experience the power and simplicity of HelixQL with our
                  interactive sandbox.
                </p>
              </motion.div>
              <Sandbox />
            </div>
          </motion.div>

          {/* Book Demo Section */}
          <motion.div
            variants={fadeInUp}
            className="py-20 relative overflow-hidden"
          >
            {/* Animated background elements */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background/50"
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%"],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />

            <div className="max-w-7xl min-h-[calc(50vh)] mx-auto px-4 sm:px-8 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center p-16 rounded-xl border border-white/5 bg-muted/50 backdrop-blur-sm relative overflow-hidden group"
                whileHover={{
                  scale: 1.01,
                  transition: {
                    duration: 0.2,
                  },
                }}
              >

                <div className="relative z-10">
                  <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent [text-wrap:balance] bg-gradient-to-br from-foreground via-foreground/90 to-primary/80"
                    whileHover={{
                      scale: 1.02,
                      transition: { duration: 0.2 },
                    }}
                  >
                    Bring your architecture together
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-xl text-muted-foreground max-w-2xl mx-auto mb-16"
                    whileHover={{
                      scale: 1.01,
                      transition: { duration: 0.2 },
                    }}
                  >
                    Book a call with us to see how Helix can fit into your stack.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 20 }}
                    whileHover={{
                      scale: 1.05,
                      transition: {
                        type: "spring",
                        stiffness: 400,
                        damping: 17
                      }
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      size="lg"
                      className="text-lg px-8 py-6 relative overflow-hidden group"
                      onClick={() => window.open('https://calendly.com/helix-db/new-meeting', '_blank')}
                    >
                      <motion.span
                        className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-500/20 to-primary/20"
                        animate={{
                          x: ["-100%", "100%"],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      <span className="relative z-10">Book Demo</span>
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* FAQ Section */}
          {/* <motion.div
            variants={fadeInUp}
            className="py-20 bg-muted/50"
          >
            <FAQSection />
          </motion.div> */}
        </motion.div>
      </motion.div>
    </div>
  );
}
