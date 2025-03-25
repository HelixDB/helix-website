"use client"

import * as React from "react"
import { PricingCard, type PricingTier } from "@/components/ui/pricing-card"
import { Tab } from "@/components/ui/pricing-tab"
import { AuthModal } from "@/components/ui/auth-modal"
import { motion } from "framer-motion"

interface PricingSectionProps {
    title: string
    subtitle: string
    tiers: PricingTier[]
    frequencies: string[]
}

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

export function PricingSection({
    title,
    subtitle,
    tiers,
    frequencies,
}: PricingSectionProps) {
    const [selectedFrequency, setSelectedFrequency] = React.useState(frequencies[0])
    const [showAuthModal, setShowAuthModal] = React.useState(false)

    return (
        <section className="min-h-screen flex flex-col items-center gap-10 py-24 relative bg-gradient-to-b from-white dark:from-transparent to-transparent">
            <motion.div
                className="space-y-7 text-center"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
            >
                <div className="space-y-4">
                    <motion.h1
                        variants={itemVariants}
                        className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80 md:text-5xl pb-1"
                    >
                        {title}
                    </motion.h1>
                    <motion.p
                        variants={itemVariants}
                        className="text-xl text-transparent bg-gradient-to-r bg-clip-text from-foreground to-foreground/80 pb-1"
                    >
                        {subtitle}
                    </motion.p>
                </div>
                <div className="mx-auto flex w-fit rounded-full bg-muted p-1">
                    {frequencies.map((freq) => (
                        <Tab
                            key={freq}
                            text={freq}
                            selected={selectedFrequency === freq}
                            setSelected={setSelectedFrequency}
                            discount={freq === "reserved"}
                        />
                    ))}
                </div>
            </motion.div>

            <div className="container mx-auto px-4">
                <div className="grid w-full max-w-6xl gap-6 mx-auto grid-cols-2 lg:grid-cols-4">
                    {tiers.map((tier) => (
                        <PricingCard
                            key={tier.name}
                            tier={tier}
                            paymentFrequency={selectedFrequency}
                            onSignUpClick={() => setShowAuthModal(true)}
                        />
                    ))}
                </div>
            </div>

            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
            />
        </section>
    )
} 