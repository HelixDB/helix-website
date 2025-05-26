"use client";
/// <reference types="three" />
import React, { useState } from "react";
import { Hero } from "@/components/sections/hero";
import { Install } from "@/components/sections/install";
import { Better } from "@/components/sections/better";
import UseCases from "@/components/sections/use-cases";
import { DemoSection } from "@/components/sections/demo-section";
import { ComparisonSection } from "@/components/sections/comparison-section";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { CommunitySection } from "@/components/sections/community-section";
import { CloudServiceSection } from "@/components/sections/cloud-service-section";


export default function Home() {

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden ">
      <Header />
      <Hero />
      <div className="bg-gradient-to-b from-transparent via-neutral-100/5 to-neutral-100/10 dark:via-neutral-900/5 dark:to-neutral-900/10">
        <Install />
        <Better />
        <ComparisonSection />
        <UseCases />
        <CommunitySection />
        <CloudServiceSection />
        <DemoSection />
        <Footer />
      </div>
    </div>
  );
}
