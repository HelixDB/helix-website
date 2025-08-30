"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Github, Star } from "lucide-react";
import { motion } from "framer-motion";
import { getGithubStars, formatNumber } from "@/lib/github";

export function StarCtaSection() {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    getGithubStars().then(setStars);
  }, []);

  return (
    <section className="py-24 sm:py-32">
      <div className="container mx-auto py-16 px-4 sm:px-8">
        <motion.div
          className="text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            You've made it this far!
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8">
            If you're excited about what we're building, show your support with a star.
            <br />
            It helps us grow and motivates us to keep pushing the boundaries.
          </p>

          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button
              size="lg"
              className="px-8 py-6 text-xl flex items-center gap-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20 transition-all hover:scale-105"
              asChild
            >
              <a
                href="https://github.com/HelixDB/helix-db"
                target="_blank"
                rel="noopener noreferrer"
              >
                {stars !== null && (
                  <span className="py-0.5 bg-white/10 rounded-full text- font-bold">
                    {formatNumber(stars)}
                  </span>
                )}
                <Star className="w-5 h-5 fill-current" />
                <span>Star on GitHub</span>
              </a>
            </Button>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                Takes 2 seconds
              </span>
              <span className="flex items-center gap-2">
                <span className="text-2xl">🚀</span>
                Join {stars !== null ? `${formatNumber(stars)}+` : 'our'} developers
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}