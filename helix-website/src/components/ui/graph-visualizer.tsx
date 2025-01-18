"use client";
import React, { useEffect, useRef, useState } from "react";
import ForceGraph2D, { ForceGraphMethods } from "react-force-graph-2d";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { X } from "lucide-react";

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

const InfoBox = ({
  element,
  onClose,
}: {
  element: { data: any; type: "node" | "edge" } | null;
  onClose: () => void;
}) => {
  if (!element) return null;

  const { data, type } = element;
  const propertyOrder = [
    "id",
    "label",
    "source",
    "target",
    ...Object.keys(data).sort(),
  ];
  const displayProperties = Array.from(new Set(propertyOrder)).filter((key) => {
    const value = data[key];
    return (
      key !== "__indexColor" &&
      key !== "x" &&
      key !== "y" &&
      key !== "vx" &&
      key !== "vy" &&
      key !== "index" &&
      value !== undefined &&
      value !== null &&
      typeof value !== "function" &&
      (typeof value !== "object" || value.id !== undefined)
    );
  });

  return (
    <Card className="absolute top-4 left-4 w-120 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" >
      <CardHeader className="p-4 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">
            {type.charAt(0).toUpperCase() + type.slice(1)} Info
          </CardTitle>
          <button
            onClick={onClose}
            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="px-6 py-4">
        <div className="space-y-2">
          {displayProperties.map((key) => {
            const value = data[key];
            console.log(value);
            let displayValue = "";
            if (key == "source" || key == "target") {
                displayValue = value.Name || value.id || JSON.stringify(value);
            } else {
              displayValue =
                typeof value === "object" && value !== null
                  ? value.id || JSON.stringify(value)
                  : String(value);
            }
            return (
              <div key={key} className="flex justify-between gap-4">
                <span className="text-sm font-medium text-muted-foreground">
                  {String(key).charAt(0).toUpperCase() + String(key).slice(1)}:
                </span>
                <span className="text-sm">{displayValue}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export function GraphVisualizer({
  data,
  height,
  width,
  currentTheme,
}: GraphVisualizerProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [selectedElement, setSelectedElement] = useState<{
    data: any;
    type: "node" | "edge";
  } | null>(null);

  const handleClick = (element: any, type: "node" | "edge") => {
    if (element) {
      setSelectedElement({
        data: element,
        type,
      });
    } else {
      setSelectedElement(null);
    }
  };

  return (
    <div className="relative h-[500px] w-[500px]">
      {selectedElement && (
        <InfoBox
          element={selectedElement}
          onClose={() => setSelectedElement(null)}
        />
      )}
      <ForceGraph2D
        graphData={data}
        nodeLabel={(val) => val.Name || val.label || val.id}
        nodeColor={() => (isDark ? "rgb(255, 255, 255)" : "rgb(64, 64, 65)")}
        linkColor={() =>
          isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0,0,0,0.5)"
        }
        backgroundColor={
          currentTheme === "dark"
            ? "rgba(26, 26, 26, 0.4)"
            : "rgba(255,255,255,0.5)"
        }
        linkWidth={8}
        nodeRelSize={6}
        linkDirectionalParticles={2}
        linkDirectionalParticleWidth={8}
        height={height}
        width={width}
        onNodeClick={(node) => handleClick(node, "node")}
        onLinkClick={(link) => handleClick(link, "edge")}
        onBackgroundClick={() => setSelectedElement(null)}
      />
    </div>
  );
}
