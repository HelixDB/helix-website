"use client";

import React, { useEffect, useRef } from "react";
import ForceGraph2D, { ForceGraphMethods } from "react-force-graph-2d";
import { useTheme } from "next-themes";

interface GraphData {
  nodes: Array<{
    id: string;
    name?: string;
    val?: number;
    [key: string]: any;
  }>;
  links: Array<{
    source: string;
    target: string;
    [key: string]: any;
  }>;
}

export interface Node {
  id: string;
  label?: string;
  properties?: Record<string, any>;
  [key: string]: any;
}

export interface Edge {
  id: string;
  label: string;
  source: string;
  target: string;
  properties?: Record<string, any>;
  [key: string]: any;
}

interface GraphVisualizerProps {
  data: GraphData;
  height: number;
  width: number;
  currentTheme?: string;
}

export function GraphVisualizer({
  data,
  height,
  width,

  currentTheme,
}: GraphVisualizerProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  
  return (
    <div className={"h-[500px] w-[500px]"}>
      <ForceGraph2D
        graphData={data}
        nodeLabel="id"
        nodeColor={() => {
          return isDark ? "rgb(255, 255, 255)" : "rgb(64, 64, 65)";
        }}
        linkColor={() => {
          return isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0,0,0,0.5)";
        }}
        backgroundColor={
          currentTheme === "dark"
            ? "rgba(26, 26, 26, 0.4)"
            : "rgba(255,255,255,0.5)"
        }
        linkWidth={8} // Increased link thickness
        nodeRelSize={6} // Increased node size
        linkDirectionalParticles={2} // Add particles for visual appeal
        linkDirectionalParticleWidth={8} // Particle size
        height={height}
        width={width}

      />
    </div>
  );
}
