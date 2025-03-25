"use client";
/// <reference types="three" />
import React, { useState } from "react";
import { Hero } from "@/components/hero";
import { Install } from "@/components/install";
import { Better } from "@/components/better";
import { PrecompiledQueries } from "@/components/precompiled-queries";
import UseCases from "@/components/use-cases";
import { Button } from "@/components/ui/button";
import { RAGFeatures } from "@/components/rag-features";
import { PricingSection } from "@/components/pricing-section";
import { Pattern } from "@/components/ui/patterns";
import { Steps } from "@/components/steps";
import { DemoSection } from "@/components/demo-section";
import { motion, useScroll } from "framer-motion";
import { Brain, Github, Shield, Zap } from "lucide-react";
import { useTheme } from "next-themes";
import { ComparisonSection } from "@/components/comparison-section";
import { FaDiscord } from "react-icons/fa";
import { SocialLinks } from "@/components/ui/social-links";

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
    description: "For independent developers and small teams",
    onDemandPrice: 0.10,
    reservedPrice: 50,
    features: [
      "730 hours of free compute",
      "Decicated cloud instance",
      "Unlimited writes and requests",
      "Priority support"
    ],
    highlighted: true,
    callToAction: "Start Free Trial",
    callToActionLink: "/signup"
  },
  {
    name: "Medium",
    description: "For larger teams and organizations",
    onDemandPrice: 0.20,
    reservedPrice: 100,
    features: [
      "Up to 500,000 documents",
      "Enterprise features",
      "Custom integrations",
      "Dedicated support",
      "SLA guarantee"
    ],
    callToAction: "Contact Sales",
    callToActionLink: "https://cal.com/helix-db"
  },
  {
    name: "Large",
    description: "Custom solutions for large organizations",
    onDemandPrice: 0.50,
    reservedPrice: 250,
    features: [
      "Unlimited documents",
      "Custom deployment",
      "24/7 support",
      "Security audit",
      "Custom SLA"
    ],
    callToAction: "Contact Sales",
    callToActionLink: "https://cal.com/helix-db"
  },
  {
    name: "X-Large",
    description: "Custom solutions for large organizations",
    onDemandPrice: 1,
    reservedPrice: 500,
    features: [
      "Unlimited documents",
      "Custom deployment",
      "24/7 support",
      "Security audit",
      "Custom SLA"
    ],
    callToAction: "Contact Sales",
    callToActionLink: "https://cal.com/helix-db"
  }
];
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
  const [selectedLanguage, setSelectedLanguage] = useState<'cypher' | 'gremlin'>('cypher');

  return (
    <div className="relative w-full min-h-screen">
      <Hero />
      <Install />
      <Better />
      {<PrecompiledQueries />}
      <ComparisonSection />
      <UseCases />
      <PricingSection
        title="Simple, transparent pricing"
        subtitle="Helix prices are entirely usage based. No hidden fees, no surprises."
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
    </div>
  );
}
