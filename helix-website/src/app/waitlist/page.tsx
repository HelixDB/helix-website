"use client";
/// <reference types="three" />
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/header";
import { Graph } from "@/components/sections/graph";
import { Footer } from "@/components/footer";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      duration: 0.5,
      when: "beforeChildren"
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

export default function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://script.google.com/a/macros/helix-db.com/s/AKfycbzjLnsS-PR87qfrxrcKYJNRBQeodB8-eWN5JfMCDh8xQ5Lw_HJUUZixg1QDwi1w45Cduw/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email }),
      });

      setSuccess(true);
      toast.success("Successfully joined the waitlist!");
    } catch (error) {
      console.error('Waitlist signup error:', error);
      toast.error("Failed to join waitlist. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Graph section with full viewport height */}
      <div className="h-screen relative overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <Graph />
        </div>

        <Header />

        <div className="container mx-auto px-4 sm:px-8 relative z-10 h-full flex items-center justify-center">
          <motion.div
            className="max-w-2xl w-full"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="text-center mb-12"
              variants={itemVariants}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Join the Waitlist
              </h1>
              <p className="text-lg text-muted-foreground">
                Be among the first to experience HelixDB's managed service. Sign up to get early access and stay updated on our development progress.
              </p>
            </motion.div>

            <motion.div
              className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-border"
              variants={itemVariants}
            >
              {success ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-semibold mb-2">Thank You!</h2>
                  <p className="text-muted-foreground">
                    We've added you to our waitlist. We'll notify you when it's your turn to join.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 text-base"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12 text-base"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Joining Waitlist...
                      </>
                    ) : (
                      "Join Waitlist"
                    )}
                  </Button>
                </form>
              )}
            </motion.div>

            <motion.div
              className="mt-8 text-center text-sm text-muted-foreground"
              variants={itemVariants}
            >
              <p>
                By joining the waitlist, you agree to receive updates about HelixDB.
                We respect your privacy and will never share your information.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Footer below the graph section */}
      <Footer />
    </div>
  );
}
