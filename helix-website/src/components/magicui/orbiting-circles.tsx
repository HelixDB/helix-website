"use client";

import React, { forwardRef, useRef } from "react";

import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/magicui/animated-beam";
import Image from "next/image";
const BigCircle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative z-10 flex items-center justify-center",
        className
      )}
    >
      <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-indigo-500/30 via-purple-500/50 to-pink-500/20 blur-3xl"></div>
      <div
        className="relative flex size-20 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_8px_16px_-6px_rgba(0,0,0,0.1)]"
      >
        {children}
      </div>
    </div>
  );
});

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative z-10 flex items-center justify-center",
        className
      )}
    >
      <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-indigo-500/30 via-purple-500/10 to-pink-500/10 blur-3xl"></div>
      <div
        className="relative flex size-14 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_8px_16px_-6px_rgba(0,0,0,0.1)]"
      >
        {children}
      </div>
    </div>
  );
});

Circle.displayName = "Circle";

export default function OrbitingCircles() {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);
  const div5Ref = useRef<HTMLDivElement>(null);
  const div6Ref = useRef<HTMLDivElement>(null);
  const div7Ref = useRef<HTMLDivElement>(null);

  return (
    <div
      className="relative flex h-[400px] w-full items-center justify-center "
      ref={containerRef}
    >
      <div className="flex size-full max-h-[200px] max-w-lg flex-col items-stretch justify-between gap-10">
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div1Ref}>
            <Image src="/neo4j.png" alt="Graph" width={40} height={40} />
          </Circle>
          <Circle ref={div5Ref}>
            <Image src="/reddis.png" alt="Graph" width={40} height={40} />
          </Circle>
        </div>
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div2Ref}>
            <Image src="/arrango.png" alt="Graph" width={40} height={40} />
          </Circle>
          <BigCircle ref={div4Ref} >
            <Image src="/light-helix.png" alt="Graph" width={60} height={60} />
          </BigCircle>
          <Circle ref={div6Ref}>
            <Image src="/qdrant.png" alt="Graph" width={40} height={40} />
          </Circle>
        </div>
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div3Ref}>
            <Image src="/neptune.png" alt="Graph" width={40} height={40} />
          </Circle>
          <Circle ref={div7Ref}>
            <Image src="/pinecone.png" alt="Graph" width={40} height={40} />
          </Circle>
        </div>
      </div>

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div4Ref}
        curvature={-75}
        endYOffset={-10}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div4Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div3Ref}
        toRef={div4Ref}
        curvature={75}
        endYOffset={10}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div5Ref}
        toRef={div4Ref}
        curvature={-75}
        endYOffset={-10}
        reverse
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div6Ref}
        toRef={div4Ref}
        reverse
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div7Ref}
        toRef={div4Ref}
        curvature={75}
        endYOffset={10}
        reverse
      />
    </div>
  );
}