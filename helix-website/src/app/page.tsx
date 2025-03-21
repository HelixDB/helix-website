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
import { Database, Network, Search, Brain, Shield, Sparkles, Lightbulb, Zap, ArrowRight, Star, GitFork, Users } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQSection } from "@/components/sections/faq";
import { SocialLinks } from "@/components/ui/social-links";
import { MessageCircle } from "lucide-react";
import { FaDiscord } from "react-icons/fa";

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

// Add cache helper
const CACHE_KEY = 'github_stats';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CachedData {
  data: {
    stars: number;
    forks: number;
    lastCommit: string;
  };
  timestamp: number;
}

function getCachedData(): CachedData | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const parsedCache = JSON.parse(cached) as CachedData;
    if (Date.now() - parsedCache.timestamp > CACHE_DURATION) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    return parsedCache;
  } catch {
    return null;
  }
}

function setCachedData(data: CachedData['data']) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch {
    // Ignore cache errors
  }
}

export default function Home() {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();
  const [isMobile, setIsMobile] = useState(false);
  const [githubStats, setGithubStats] = useState<{
    stars: number;
    forks: number;
    lastCommit: string;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
    setIsMobile(window.innerWidth < 768);

    // Fetch GitHub stats
    const fetchGitHubStats = async () => {
      try {
        // Check cache first
        const cached = getCachedData();
        if (cached) {
          setGithubStats(cached.data);
          return;
        }

        const headers = {
          'Accept': 'application/vnd.github.v3+json',
          // Add a user agent to avoid 403 errors
          'User-Agent': 'HelixDB-Website'
        };

        const [repoResponse, commitsResponse] = await Promise.all([
          fetch('https://api.github.com/repos/HelixDB/helix-db', { headers }),
          fetch('https://api.github.com/repos/HelixDB/helix-db/commits', { headers })
        ]);

        // Handle individual response errors
        if (!repoResponse.ok) {
          console.warn('Failed to fetch repo data:', await repoResponse.text());
          throw new Error('Failed to fetch repo data');
        }

        if (!commitsResponse.ok) {
          console.warn('Failed to fetch commits data:', await commitsResponse.text());
          throw new Error('Failed to fetch commits data');
        }

        const repoData = await repoResponse.json();
        const commits = await commitsResponse.json();

        const stats = {
          stars: repoData?.stargazers_count ?? 0,
          forks: repoData?.forks_count ?? 0,
          lastCommit: commits?.[0]?.commit?.author?.date
            ? new Date(commits[0].commit.author.date).toLocaleDateString()
            : 'Recently'
        };

        // Cache the successful response
        setCachedData(stats);
        setGithubStats(stats);
      } catch (error) {
        console.error('Error fetching GitHub stats:', error);

        // Try to use cached data even if expired in case of error
        const expired = localStorage.getItem(CACHE_KEY);
        if (expired) {
          try {
            const parsedExpired = JSON.parse(expired);
            setGithubStats(parsedExpired.data);
            return;
          } catch {
            // Ignore parse errors
          }
        }

        // Set default values if both fetch and cache fail
        setGithubStats({
          stars: 0,
          forks: 0,
          lastCommit: 'Recently'
        });
      }
    };

    fetchGitHubStats();

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const blurOpacity = useTransform(
    scrollY,
    [0, 200],
    [0, isMobile ? 0.5 : 1] // Reduce blur effect on mobile
  );

  if (!mounted) return null;

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <div className="relative w-full">
      {/* Background - Simplified for mobile */}
      <div className="fixed inset-0 z-0">
        {!isMobile && (
          <WavyBackground
            className="w-full h-full"
            blur={isMobile ? 10 : 25} // Reduced blur on mobile
            backgroundFill={currentTheme === "dark" ? "#000000" : "#ffffff"}
          />
        )}
        <motion.div
          className="absolute inset-0 bg-background/50"
          style={{
            backdropFilter: isMobile ? 'none' : 'blur(3xl)',
            opacity: blurOpacity
          }}
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

          {/* GitHub Activity Section */}
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
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
                  Join Our Growing Community
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Be part of the next generation of graph database technology.
                  Connect with developers and innovators building the future.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {githubStats && (
                  <>
                    <motion.div
                      whileHover={{ y: -5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <Card className="p-6 text-center bg-background/50 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-colors hover:shadow-lg hover:shadow-primary/5">
                        <Star className="w-8 h-8 mx-auto mb-4 text-primary" />
                        <h3 className="text-2xl font-bold mb-2">{githubStats.stars.toLocaleString()}</h3>
                        <p className="text-muted-foreground">GitHub Stars</p>
                      </Card>
                    </motion.div>
                    <motion.div
                      whileHover={{ y: -5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <Card className="p-6 text-center bg-background/50 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-colors hover:shadow-lg hover:shadow-primary/5">
                        <GitFork className="w-8 h-8 mx-auto mb-4 text-primary" />
                        <h3 className="text-2xl font-bold mb-2">{githubStats.forks.toLocaleString()}</h3>
                        <p className="text-muted-foreground">Project Forks</p>
                      </Card>
                    </motion.div>
                    <motion.div
                      whileHover={{ y: -5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <Card className="p-6 text-center bg-background/50 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-colors hover:shadow-lg hover:shadow-primary/5">
                        <Users className="w-8 h-8 mx-auto mb-4 text-primary" />
                        <h3 className="text-2xl font-bold mb-2">1,000+</h3>
                        <p className="text-muted-foreground">Community Members</p>
                      </Card>
                    </motion.div>
                  </>
                )}
              </div>

              <div className="mt-12 text-center space-y-8">
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
                  <p className="text-muted-foreground">
                    Join our community and support the project
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                    <Button
                      size="lg"
                      className="text-lg px-8 bg-[#7289DA] hover:bg-[#7289DA]/90 shadow-lg shadow-[#7289DA]/20 w-full sm:w-1/2"
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
                        {githubStats && (
                          <span className="px-2 py-0.5 text-sm bg-white/10 rounded-full">
                            {githubStats.stars.toLocaleString()}
                          </span>
                        )}
                      </a>
                    </Button>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Sandbox - Conditional render for mobile */}
          {!isMobile && (
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
          )}

          {/* Book Demo Section - Simplified for mobile */}
          <motion.div
            variants={fadeInUp}
            className="py-20 bg-muted/50"
          >
            <div className="max-w-7xl min-h-[calc(50vh)] mx-auto px-4 sm:px-8 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className={`text-center p-8 sm:p-16 rounded-3xl border border-white/5 bg-muted/50 ${isMobile ? '' : 'backdrop-blur-sm'
                  } relative overflow-hidden`}
              >
                <motion.div
                  initial={{ opacity: 0, width: "0%" }}
                  whileInView={{ opacity: 1, width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="absolute h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent top-0 left-0"
                />

                <motion.div
                  initial={{ opacity: 0, height: "0%" }}
                  whileInView={{ opacity: 1, height: "100%" }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="absolute w-[1px] bg-gradient-to-b from-transparent via-primary/50 to-transparent top-0 right-0"
                />

                <motion.div
                  initial={{ opacity: 0, width: "0%" }}
                  whileInView={{ opacity: 1, width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="absolute h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent bottom-0 right-0"
                />

                <motion.div
                  initial={{ opacity: 0, height: "0%" }}
                  whileInView={{ opacity: 1, height: "100%" }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="absolute w-[1px] bg-gradient-to-b from-transparent via-primary/50 to-transparent bottom-0 left-0"
                />

                <div className="relative z-10">
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent [text-wrap:balance] bg-gradient-to-br from-foreground via-foreground/90 to-primary/80"
                  >
                    Bring your architecture together
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-xl text-muted-foreground max-w-2xl mx-auto mb-16"
                  >
                    Book a call with us to see how Helix can fit into your stack.
                  </motion.p>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}

                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 17
                    }}
                  >
                    <Button
                      size="lg"
                      className="text-lg px-8 py-6"
                      onClick={() => window.open('https://calendly.com/helix-db/new-meeting', '_blank')}
                    >
                      Book Demo
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
