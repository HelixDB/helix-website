"use client";
/// <reference types="three" />
import React from "react";
import { Hero } from "@/components/hero";
import { Install } from "@/components/install";

export default function Home() {
  return (
    <div className="relative w-full min-h-screen">
      <Hero />
      <Install />
    </div>
  );
}