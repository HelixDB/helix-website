"use client";

import React from "react";
import { motion } from "framer-motion";
import { Github, Linkedin } from "lucide-react";
import { FaDiscord, FaXTwitter } from "react-icons/fa6";
import { SocialCard } from "./social-card";
import { Card } from "./card";

export function SocialGrid() {
    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center lg:justify-end"
        >
            <motion.div
                className="relative w-full p-8 border border-white/10 bg-muted/30 backdrop-blur-xl shadow-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] rounded-xl overflow-hidden group"
                transition={{ duration: 0.2 }}
            >
                {/* Social grid */}
                <div className="grid grid-cols-2 gap-6 w-full relative z-10">
                    <SocialCard
                        href="https://github.com/HelixDB/helix-db"
                        title="GitHub"
                        icon={Github}
                        variant="github"
                    />

                    <SocialCard
                        href="https://twitter.com/hlx_db"
                        title="X"
                        icon={FaXTwitter}
                        variant="twitter"
                    />

                    <SocialCard
                        href="https://linkedin.com/company/helixdb"
                        title="LinkedIn"
                        icon={Linkedin}
                        variant="linkedin"
                    />

                    <SocialCard
                        href="https://discord.gg/2stgMPr5BD"
                        title="Discord"
                        icon={FaDiscord}
                        variant="discord"
                    />
                </div>
            </motion.div>
        </motion.div>
    );
} 