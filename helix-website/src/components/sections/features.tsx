"use client";

import React from "react";
import { Terminal, Cloud, Code2, Zap, ArrowDownUp } from "lucide-react";

const features = [
    {
        title: "Managed Service",
        description:
            "Set up in minutes. We handle the infrastructure so you can focus on your product.",
        icon: Terminal,
    },
    {
        title: "Cost-Effective",
        description:
            "You only pay for what you use. No hidden fees, no overprovisioning.",
        icon: Zap,
    },
    {
        title: "Powerful Query Language",
        description:
            "Helix provides a language that's readable, type-safe, and powerful.",
        icon: Code2,
    },
    {
        title: "Easy to implement",
        description:
            "Helix automatically generates API endpoints that make it easy to implement.",
        icon: ArrowDownUp,
    },
];

export function FeaturesSection() {
    return (
        <section className="py-20 bg-muted/50
">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Why Use Helix?
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        A modern graph database that puts developers first.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="p-6 rounded-xl bg-card hover:bg-card/50 hover:scale-[1.02] transition-all"
                        >
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                <feature.icon className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
} 