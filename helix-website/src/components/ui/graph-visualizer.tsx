"use client";
import { Copy, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";

import { Card, CardContent, CardHeader, CardTitle } from "./card";

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
  height?: number;
  width?: number;
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

  const truncateId = (str: string, startChars = 5, endChars = 5) => {
    if (str.length <= startChars + endChars + 3) return str;
    return `${str.slice(0, startChars)}...${str.slice(-endChars)}`;
  };

  return (
    <Card className="absolute z-[10000000000] top-4 left-4 rounded-none w-160 bg-muted/50 backdrop-blur ">
      <CardHeader className="p-2 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">
            {type.charAt(0).toUpperCase() + type.slice(1)} Info
          </CardTitle>
          <button
            onClick={() => onClose()}
            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="px-6 py-4 space-y-2">
        {displayProperties.map((key) => {
          const value = data[key];
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
              {displayValue.length > 20 ? (
                <div className="flex items-center gap-2 ml-8">
                  <span
                    className="text-sm cursor-pointer hover:opacity-80 group relative"
                    onClick={() => {
                      navigator.clipboard.writeText(`"${displayValue}"`);
                    }}
                    title={`Click to copy: ${displayValue}`}
                  >
                    {truncateId(displayValue)}
                    <Copy className="h-3 w-3 inline ml-1 opacity-50 group-hover:opacity-100" />
                  </span>
                </div>
              ) : (
                <span className="text-sm">{displayValue}</span>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
const GraphVisualizer: React.FC<GraphVisualizerProps> = ({
  data,
  currentTheme,
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [selectedElement, setSelectedElement] = useState<{
    data: any;
    type: "node" | "edge";
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };
    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

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
    <div ref={containerRef} className="relative w-full h-full">
      <div className="absolute inset-0">
        <ForceGraph2D
          graphData={data}
          width={dimensions.width}
          height={dimensions.height}
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
          onNodeClick={(node) => handleClick(node, "node")}
          onLinkClick={(link) => handleClick(link, "edge")}
        />
        <InfoBox
          element={selectedElement}
          onClose={() => setSelectedElement(null)}
        />
      </div>
    </div>
  );
};

export default GraphVisualizer;
