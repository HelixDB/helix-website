import React from 'react';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0,
            duration: 0.2,
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
            stiffness: 150,
            damping: 12
        }
    }
};

export function DemoSection() {
    return (
        <section className="min-h-[90vh] py-12 md:py-24 flex items-center relative overflow-hidden ">
            <div className="absolute bottom-0 right-0 left-0 opacity-5">
                <div className="container mx-auto h-[200px] md:h-[300px]">
                    <div className="relative h-full">
                        <img
                            src="/helix-white.svg"
                            alt="Helix Logo"
                            className="absolute left-4 bottom-0 w-full md:w-[1088px] h-[200px] md:h-[300px] object-contain object-left invert dark:invert-0"
                        />
                    </div>
                </div>
            </div>
            <motion.div
                className="container mx-auto px-4 flex flex-col items-center justify-center relative"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
            >
                <div className="max-w-3xl mx-auto text-center mb-8 md:mb-16">
                    <motion.h2
                        variants={itemVariants}
                        className="text-3xl md:text-4xl font-bold mb-3 md:mb-4"
                    >
                        Join the Waitlist
                    </motion.h2>
                    <motion.p
                        variants={itemVariants}
                        className="text-lg md:text-xl text-gray-600 dark:text-gray-400 px-4 md:px-0"
                    >
                        Sign up to get early access to Helix's managed service and to hear more about our development plans.
                    </motion.p>

                    <motion.div
                        variants={itemVariants}
                        className="mt-8"
                    >
                        <Button
                            size="lg"
                            variant="default"
                            className="px-6 md:px-8 py-4 md:py-6 text-base md:text-lg"
                        >
                            <a
                                href="/waitlist"
                            >
                                Join Now
                            </a>
                        </Button>
                    </motion.div>
                </div>

            </motion.div>
        </section>
    );
} 