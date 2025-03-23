"use client";
/// <reference types="three" />
import React from "react";
import { Hero } from "@/components/hero";
import { Install } from "@/components/install";
import { Better } from "@/components/better";

export default function Home() {
  return (
    <div className="relative w-full min-h-screen">
      <Hero />
      <Install />
      <Better />
    </div>
  );
}
