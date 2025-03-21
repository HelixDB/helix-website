"use client";

import { motion } from "framer-motion";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 }
};

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    }
};

const faqs = [
    {
        id: "different",
        question: "What makes Helix different from other databases?",
        answer: "Helix is built from the ground up to natively support both graph and vector operations. Unlike other solutions that focus on one type, our unified approach means better performance, easier development, and more flexibility."
    },
    {
        id: "pricing",
        question: "How does pricing work?",
        answer: "Currently, Helix offers monthly subscriptions for our managed service. We plan to make this pay-as-you-go very soon."
    },
];

export function FAQSection() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <motion.div
                variants={fadeInUp}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
                className="text-center mb-16"
            >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Frequently Asked Questions
                </h2>
                <p className="text-xl text-muted max-w-3xl mx-auto">
                    Common questions about Helix and how it can help your development workflow.
                </p>
            </motion.div>

            <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="max-w-3xl mx-auto"
            >
                <Accordion type="single" collapsible>
                    {faqs.map((faq) => (
                        <motion.div
                            key={faq.id}
                            variants={item}
                        >
                            <AccordionItem value={faq.id}>
                                <AccordionTrigger className="text-xl">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        </motion.div>
                    ))}
                </Accordion>
            </motion.div>
        </div>
    );
} 