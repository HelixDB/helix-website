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
import { motion } from "framer-motion";

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

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="justify-center"
    >
      <WavyBackground
        className="min-h-screen w-full"
        blur={25}
        backgroundFill={currentTheme === "dark" ? "#000000" : "#ffffff"}
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

          {/* Footer */}
          <motion.div
            variants={fadeInUp}
          >
            <Footer />
          </motion.div>
        </motion.div>
      </WavyBackground>
    </motion.main>
  );
}
