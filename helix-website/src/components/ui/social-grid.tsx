"use client";

import React from "react";
import { motion } from "framer-motion";
import { Github, Linkedin } from "lucide-react";
import { FaDiscord, FaXTwitter } from "react-icons/fa6";
import { SocialCard } from "./social-card";

export function SocialGrid() {
    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center lg:justify-end "
        >
            <div className="relative w-full">

                <div className="grid grid-cols-2 gap-6 w-full p-6 bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl shadow-xl shadow-white/20 [box-shadow:0_0_100px_rgba(255,255,255,0.1)]">
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
            </div>
        </motion.div>
    );
} 