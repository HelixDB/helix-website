"use client";

import React from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { useTheme } from 'next-themes';

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

interface GraphVisualizerProps {
  data: GraphData;
  className?: string;
}

export function GraphVisualizer({ data, className }: GraphVisualizerProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <div className={className}>
      <ForceGraph2D
        graphData={data}
        nodeLabel="name"
        nodeColor={isDark ? "#fff" : "#000"}
        linkColor={isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"}
        backgroundColor="transparent"
        width={800}
        height={400}
      />
    </div>
  );
} 