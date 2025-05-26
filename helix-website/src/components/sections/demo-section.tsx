import React from 'react';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Github, Calendar, ArrowUpRight, Download, Users, Shield, Zap, HeadphonesIcon, User, Medal, Cloud } from "lucide-react";

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            duration: 0.3
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 120,
            damping: 15
        }
    }
};

export function DemoSection() {
    return (
        <section className="min-h-[1080px] py-12 md:py-24 flex items-center relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>

            <motion.div
                className="max-w-4xl mx-auto px-4 sm:px-8 text-center relative z-10"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
            >
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl md:text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-foreground/80 leading-tight"
                >
                    Commercial Support
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed max-w-3xl mx-auto"
                >
                    Do you want to use HelixDB in production, with automated disaster recovery,
                    monitoring, consulting, and support from the HelixDB team?
                </motion.p>

                {/* Main CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="relative group"
                >

                    <motion.div
                        className="relative bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-lg border-2 border-primary/30 rounded-3xl p-8 md:p-12 shadow-2xl hover:shadow-3xl transition-all duration-500 group-hover:border-primary/50"
                        whileHover={{ scale: 1.01, y: -4 }}
                        transition={{ duration: 0.4, type: "spring", stiffness: 120 }}
                    >
                        {/* Header */}
                        <div className="text-center mb-8">
                            <motion.div
                                className="w-20 h-20 bg-gradient-to-br from-primary/30 to-purple-500/30 rounded-2xl flex items-center justify-center border-2 border-primary/40 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300"
                                whileHover={{ rotate: 5 }}
                            >
                                <Calendar className="w-10 h-10 text-primary" />
                            </motion.div>

                            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-foreground/80">
                                Ready to Get Started?
                            </h3>
                            <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
                                Book a call with our team to discuss your specific needs and get HelixDB running in production.
                            </p>
                        </div>

                        {/* Benefits */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            {[
                                { icon: Zap, text: "Feature Priority" },
                                { icon: Cloud, text: "Self-Hosted" },
                                { icon: Users, text: "Expert Support" },
                                { icon: Shield, text: "Enterprise Ready" },
                            ].map((benefit, index) => (
                                <div key={index} className="flex items-center gap-3 justify-center md:justify-start">
                                    <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                                        <benefit.icon className="w-4 h-4 text-primary" />
                                    </div>
                                    <span className="text-sm font-medium text-foreground">{benefit.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTA Button */}
                        <div className="text-center">
                            <Button
                                size="lg"
                                className="text-lg px-10 py-6 bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/90 hover:via-primary/80 hover:to-primary/70 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 w-full md:w-auto"
                                asChild
                            >
                                <a
                                    href="https://calendly.com/helixdb/ceo-consultation"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-3"
                                >
                                    <Calendar className="w-5 h-5" />
                                    <span className="font-semibold">Book a call</span>
                                </a>
                            </Button>
                            <p className="text-sm text-muted-foreground mt-4">
                                Free 30-minute consultation • No commitment required
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </section>
    );
} 