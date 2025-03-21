"use client";

import React, { useEffect, useState } from "react";
import { Download, Github, Code2, Terminal, Shield } from "lucide-react";
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
import { Database, Network, Search, Brain, Sparkles, Lightbulb, Zap, ArrowRight, Star, GitFork, Users } from "lucide-react";
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

const titleVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
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

// Add comparison query examples
const comparisonExamples = {
  cypher: {
    name: "Cypher",
    code: `MATCH (user:User)
WHERE user.age > 25
WITH user
MATCH (user)-[:FOLLOWS]->(friend)
RETURN friend
ORDER BY friend.name
LIMIT 10`,
    lines: 7
  },
  gremlin: {
    name: "Gremlin",
    code: `g.V().hasLabel('User')
  .has('age', gt(25))
  .out('FOLLOWS')
  .dedup()
  .order()
    .by('name')
  .limit(10)`,
    lines: 7
  }
};

export default function Home() {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();
  const [isMobile, setIsMobile] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'cypher' | 'gremlin'>('cypher');
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
            <HeroSection githubStats={githubStats} />
          </motion.div>

          <motion.div variants={fadeInUp}>
            <FeaturesSection />
          </motion.div>

          {/* Query Language Comparison Section */}
          <motion.div
            variants={fadeInUp}
            className="py-20 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background/50" />
            <div className="absolute inset-0 bg-grid-white/[0.01] bg-grid-primary/[0.01]" />
            <div className="container relative mx-auto px-4">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={titleVariants}
                className="text-center mb-16 max-w-7xl mx-auto"
              >
                <div className="relative inline-block">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent [text-wrap:balance] bg-gradient-to-br from-foreground via-foreground/90 to-primary/80">
                    Simple, Powerful, and Intuitive
                  </h2>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    See how HelixQL simplifies complex queries compared to traditional query languages
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-7xl mx-auto"
              >
                {/* HelixQL Example */}
                <motion.div
                  variants={itemVariants}
                  className="p-6 rounded-xl border border-white/10 bg-muted/30 backdrop-blur-xl shadow-xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-foreground">HelixQL</h3>
                    <span className="text-sm text-muted-foreground">3 lines of code</span>
                  </div>
                  <pre className="bg-background/80 p-4 rounded-md overflow-x-auto border border-white/10">
                    <code className="text-sm">
                      {`QUERY findFriends() =>
  users <- V<User>::WHERE(_::{age}::GT(25))
  RETURN users::Out<Follows> LIMIT 10`}
                    </code>
                  </pre>
                </motion.div>

                {/* Comparison Example */}
                <motion.div
                  variants={itemVariants}
                  className="p-6 rounded-xl border border-white/10 bg-muted/30 backdrop-blur-xl shadow-xl"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Button
                          variant={selectedLanguage === 'cypher' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedLanguage('cypher')}
                          className="text-sm"
                        >
                          Cypher
                        </Button>
                        <Button
                          variant={selectedLanguage === 'gremlin' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedLanguage('gremlin')}
                          className="text-sm"
                        >
                          Gremlin
                        </Button>
                      </div>
                      <span className="text-sm text-muted-foreground">{comparisonExamples[selectedLanguage].lines} lines of code</span>
                    </div>
                    <pre className="bg-background/80 p-4 rounded-md overflow-x-auto border border-white/10">
                      <code className="text-sm">
                        {comparisonExamples[selectedLanguage].code}
                      </code>
                    </pre>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
              >
                <motion.div
                  variants={itemVariants}
                  className="p-6 rounded-xl border border-white/5 bg-muted/10 backdrop-blur-sm"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                    }}
                    className="w-14 h-14 rounded-lg flex items-center justify-center mb-4 relative"
                    style={{
                      background: `linear-gradient(135deg, 
                        rgba(99, 102, 241, 0.1) 0%,
                        rgba(139, 92, 246, 0.1) 100%)`
                    }}
                  >
                    <Zap className="w-7 h-7 text-primary" />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">70% Less Code</h3>
                  <p className="text-muted-foreground">Write cleaner, more maintainable queries with our intuitive syntax</p>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="p-6 rounded-xl border border-white/5 bg-muted/10 backdrop-blur-sm"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                    }}
                    className="w-14 h-14 rounded-lg flex items-center justify-center mb-4 relative"
                    style={{
                      background: `linear-gradient(135deg, 
                        rgba(99, 102, 241, 0.1) 0%,
                        rgba(139, 92, 246, 0.1) 100%)`
                    }}
                  >
                    <Shield className="w-7 h-7 text-primary" />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Type Safety</h3>
                  <p className="text-muted-foreground">Catch errors at compile time with full type checking and IDE support</p>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="p-6 rounded-xl border border-white/5 bg-muted/10 backdrop-blur-sm"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                    }}
                    className="w-14 h-14 rounded-lg flex items-center justify-center mb-4 relative"
                    style={{
                      background: `linear-gradient(135deg, 
                        rgba(99, 102, 241, 0.1) 0%,
                        rgba(139, 92, 246, 0.1) 100%)`
                    }}
                  >
                    <Brain className="w-7 h-7 text-primary" />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Native Vector Support</h3>
                  <p className="text-muted-foreground">Seamlessly combine graph traversals with vector operations</p>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Setup Comparison Section */}
          <motion.div
            variants={fadeInUp}
            className="py-20 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background/50" />
            <div className="container relative mx-auto px-4">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={titleVariants}
                className="text-center mb-16 max-w-3xl mx-auto"
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent [text-wrap:balance] bg-gradient-to-br from-foreground via-foreground/90 to-primary/80">
                  Simple Setup
                </h2>
                <p className="text-xl text-muted-foreground">
                  Replace complex architectures with a single powerful database
                </p>
              </motion.div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16"
              >
                {/* Traditional Setup */}
                <motion.div
                  variants={itemVariants}
                  className="p-8 rounded-xl border border-white/10 bg-muted/30 backdrop-blur-xl"
                >
                  <div className="mb-6">
                    <h3 className="text-2xl font-semibold mb-2">Traditional Setup</h3>
                    <p className="text-muted-foreground">Multiple databases, complex integrations</p>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-background/50 border border-white/5">
                      <p className="font-medium mb-1">Graph Database</p>
                      <p className="text-sm text-muted-foreground">Neo4j setup & configuration</p>
                    </div>
                    <div className="p-4 rounded-lg bg-background/50 border border-white/5">
                      <p className="font-medium mb-1">Vector Database</p>
                      <p className="text-sm text-muted-foreground">Pinecone/Qdrant deployment</p>
                    </div>
                    <div className="p-4 rounded-lg bg-background/50 border border-white/5">
                      <p className="font-medium mb-1">Integration Layer</p>
                      <p className="text-sm text-muted-foreground">Custom sync logic & maintenance</p>
                    </div>
                  </div>
                </motion.div>

                {/* Helix Setup */}
                <motion.div
                  variants={itemVariants}
                  className="p-8 rounded-xl border border-white/10 bg-muted/30 backdrop-blur-xl"
                >
                  <div className="mb-6">
                    <h3 className="text-2xl font-semibold mb-2">Helix Setup</h3>
                    <p className="text-muted-foreground">One command, zero complexity</p>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-background/50 border border-white/5">
                      <p className="font-medium mb-2">Install & Start</p>
                      <pre className="text-sm bg-muted/30 p-2 rounded-md">
                        <code>cargo install helix-db</code>
                      </pre>
                    </div>
                    <div className="p-4 rounded-lg bg-background/50 border border-white/5">
                      <p className="font-medium mb-2">Define Schema</p>
                      <pre className="text-sm bg-muted/30 p-2 rounded-md">
                        <code>{`V::User {
  Name: String,
  Embedding: Vector<384>
}`}</code>
                      </pre>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="grid grid-cols-3 gap-4 max-w-3xl mx-auto text-center"
              >
                <motion.div
                  variants={itemVariants}
                  className="p-4 rounded-lg bg-muted/30 backdrop-blur-sm"
                >
                  <h3 className="text-3xl font-bold mb-1">90%</h3>
                  <p className="text-sm text-muted-foreground">Less Setup Time</p>
                </motion.div>
                <motion.div
                  variants={itemVariants}
                  className="p-4 rounded-lg bg-muted/30 backdrop-blur-sm"
                >
                  <h3 className="text-3xl font-bold mb-1">1 API</h3>
                  <p className="text-sm text-muted-foreground">Single Interface</p>
                </motion.div>
                <motion.div
                  variants={itemVariants}
                  className="p-4 rounded-lg bg-muted/30 backdrop-blur-sm"
                >
                  <h3 className="text-3xl font-bold mb-1">Zero</h3>
                  <p className="text-sm text-muted-foreground">Integration Code</p>
                </motion.div>
              </motion.div>
            </div>
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
                <p className="text-xl text-muted max-w-2xl mx-auto">
                  Be part of the next generation of graph database technology.
                  Connect with developers and innovators building the future.
                </p>
              </motion.div>
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
                  <p className="text-xl text-muted max-w-2xl mx-auto">
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
                    className="text-xl text-muted max-w-2xl mx-auto mb-16"
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
