"use client";
import React, { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import { useScroll } from "framer-motion";
import { useTheme } from "next-themes";

export function Graph() {
    const containerRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const graphRef = useRef<THREE.Group | null>(null);
    const frameIdRef = useRef<number>(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const lastTimeRef = useRef<number>(Date.now());
    const isAnimatingRef = useRef<boolean>(false);
    const lastScrollYRef = useRef<number>(0);
    const scrollVelocityRef = useRef<number>(0);
    const { resolvedTheme } = useTheme();

    const { scrollY } = useScroll();

    // Separate animation function that's not dependent on closure variables
    const startAnimation = () => {
        if (isAnimatingRef.current) return; // Prevent multiple animation loops

        isAnimatingRef.current = true;
        console.log("Starting animation");

        const animateFrame = () => {
            if (!graphRef.current || !cameraRef.current || !rendererRef.current || !sceneRef.current) {
                console.error("Animation objects not available");
                return;
            }

            frameIdRef.current = requestAnimationFrame(animateFrame);

            const graph = graphRef.current;
            const camera = cameraRef.current;
            const renderer = rendererRef.current;
            const scene = sceneRef.current;

            // Time-based animation
            const now = Date.now();
            const deltaTime = (now - lastTimeRef.current) / 1000;
            lastTimeRef.current = now;

            // Cap delta time to avoid jumps
            const cappedDelta = Math.min(deltaTime, 0.1);

            // Get current scroll position and calculate velocity
            const currentScrollY = scrollY.get();
            const scrollDelta = currentScrollY - lastScrollYRef.current;

            // Calculate scroll velocity with decay (smoothing)
            scrollVelocityRef.current = scrollVelocityRef.current * 0.8 + Math.abs(scrollDelta) * 0.2;
            lastScrollYRef.current = currentScrollY;

            // Get normalized velocity factor (0 to 1)
            const velocityFactor = Math.min(scrollVelocityRef.current / 50, 1);

            // Calculate normalized scroll factor for position-based effects
            const scrollFactor = Math.min(currentScrollY / 1000, 2);

            // Continuous rotation with velocity boost
            // Base rotation is slow, scrolling velocity makes it faster
            graph.rotation.y += (0.05 + velocityFactor * 0.2) * cappedDelta; // Slower base speed, faster with scroll
            graph.rotation.x += (0.02 + velocityFactor * 0.1) * cappedDelta; // Slower base speed, faster with scroll
            graph.rotation.z += (0.01 + velocityFactor * 0.05) * cappedDelta; // Slower base speed, faster with scroll

            // Apply additional scroll-based effects only based on position
            if (currentScrollY > 0) {
                // Zoom effect
                camera.position.z = Math.max(3.5, 6 - scrollFactor * 2.5);

                // Scale effect
                const scaleValue = 1 + scrollFactor * 0.25;
                graph.scale.set(scaleValue, scaleValue, scaleValue);
            }

            // Render the scene
            renderer.render(scene, camera);
        };

        // Start the animation loop
        frameIdRef.current = requestAnimationFrame(animateFrame);
    };

    // Initialize Three.js scene
    useEffect(() => {
        // Add a slight delay to ensure the container is fully mounted
        const initTimeout = setTimeout(() => {
            if (!containerRef.current) {
                console.error("Container ref not available");
                return;
            }

            try {
                console.log("Initializing Three.js");

                // Check the theme using next-themes
                const isLightMode = resolvedTheme === "light";
                console.log("Color scheme:", isLightMode ? "light mode" : "dark mode");

                // Create scene
                const scene = new THREE.Scene();
                sceneRef.current = scene;

                // Create camera with adjusted position
                const camera = new THREE.PerspectiveCamera(
                    45, // Wider FOV
                    containerRef.current.clientWidth / containerRef.current.clientHeight,
                    0.1,
                    1000
                );
                camera.position.z = 6; // Farther to see more of the network
                cameraRef.current = camera;

                // Create renderer with better settings
                const renderer = new THREE.WebGLRenderer({
                    antialias: true,
                    alpha: true,
                    powerPreference: 'high-performance'
                });
                renderer.setSize(
                    containerRef.current.clientWidth,
                    containerRef.current.clientHeight
                );
                renderer.setPixelRatio(window.devicePixelRatio);
                renderer.setClearColor(0x000000, 0); // transparent background
                containerRef.current.appendChild(renderer.domElement);
                rendererRef.current = renderer;

                // Create graph group and shift it right
                const graph = new THREE.Group();
                graph.position.x = 1.2; // Shift to the right

                // Add initial rotation to prevent static appearance at first render
                graph.rotation.x = 0.3;
                graph.rotation.y = 0.5;
                graph.rotation.z = 0.2;

                graphRef.current = graph;
                scene.add(graph);

                // Number of nodes and connections
                const nodeCount = 300; // Much more nodes
                const maxConnections = 5; // More connections per node

                // Create nodes
                const nodes: THREE.Vector3[] = [];
                const nodePositions: { x: number; y: number; z: number }[] = [];

                // Generate node positions in a more distributed way
                for (let i = 0; i < nodeCount; i++) {
                    // Create positions in a spherical volume
                    const theta = Math.random() * Math.PI * 2;
                    const phi = Math.acos(2 * Math.random() - 1);
                    const radius = 4 * Math.cbrt(Math.random()); // Cube root gives better distribution

                    const x = radius * Math.sin(phi) * Math.cos(theta);
                    const y = radius * Math.sin(phi) * Math.sin(theta);
                    const z = radius * Math.cos(phi);

                    nodes.push(new THREE.Vector3(x, y, z));
                    nodePositions.push({ x, y, z });
                }

                // Create a single geometry for all lines
                const lineSegments: THREE.Vector3[] = [];

                // Create connections
                for (let i = 0; i < nodeCount; i++) {
                    const node = nodes[i];

                    // Find nearby nodes
                    const connections = findNearbyNodes(i, nodePositions, maxConnections);

                    for (const targetIndex of connections) {
                        // Add line segments
                        lineSegments.push(node.clone());
                        lineSegments.push(nodes[targetIndex].clone());
                    }
                }

                // Create gradient colors for lines
                const lineColors: number[] = [];
                for (let i = 0; i < lineSegments.length; i++) {
                    if (isLightMode) {
                        // Darker colors for edges in light mode for better contrast
                        const darkBase = 0.05 + Math.random() * 0.15; // 5-20% dark (very dark base)
                        const blueHint = Math.random() * 0.3; // Blue hint
                        const purpleHint = Math.random() * 0.2; // Purple hint

                        // RGB values (very dark with hints of blue/purple)
                        const r = Math.min(0.5, darkBase + purpleHint * 0.5); // Add some red for purple
                        const g = Math.min(0.5, darkBase); // Keep green very low
                        const b = Math.min(0.5, darkBase + blueHint * 0.8 + purpleHint * 0.2); // Emphasize blue

                        lineColors.push(r, g, b);
                    } else {
                        // Lighter colors for edges in dark mode for better contrast
                        const whiteBase = 0.85 + Math.random() * 0.15; // 85-100% white (very bright base)
                        const blueHint = Math.random() * 0.1; // Subtle blue hint
                        const purpleHint = Math.random() * 0.05; // Very subtle purple hint

                        // RGB values (very bright with subtle hints)
                        const r = Math.max(0.8, whiteBase - purpleHint); // Very high red
                        const g = Math.max(0.8, whiteBase - purpleHint - blueHint); // Very high green
                        const b = Math.max(0.85, whiteBase); // Very high blue with slight boost

                        lineColors.push(r, g, b);
                    }
                }

                // Create line segments with colors for the connections
                const linesGeometry = new THREE.BufferGeometry().setFromPoints(lineSegments);
                linesGeometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));

                const linesMaterial = new THREE.LineBasicMaterial({
                    vertexColors: true,
                    transparent: true,
                    opacity: 0.25, // Slightly reduced for subtle network appearance
                });
                const lines = new THREE.LineSegments(linesGeometry, linesMaterial);
                graph.add(lines);

                // Create node points with color variation
                const pointsGeometry = new THREE.BufferGeometry().setFromPoints(nodes);

                // Add more saturated colors with blue and purple hints
                const colors = new Float32Array(nodes.length * 3);
                for (let i = 0; i < nodes.length; i++) {
                    const i3 = i * 3;
                    // Create deeper, more saturated colors
                    const blueValue = 0.7 + Math.random() * 0.3; // 70-100% blue
                    const purpleValue = Math.random() > 0.6; // Some nodes more purple

                    if (purpleValue) {
                        // Purple-leaning node
                        colors[i3] = 0.4 + Math.random() * 0.3; // Red component for purple
                        colors[i3 + 1] = 0.2 + Math.random() * 0.2; // Low green
                        colors[i3 + 2] = blueValue; // High blue
                    } else {
                        // Blue-leaning node
                        colors[i3] = 0.1 + Math.random() * 0.2; // Low red
                        colors[i3 + 1] = 0.3 + Math.random() * 0.3; // Some green for teal/cyan hints
                        colors[i3 + 2] = blueValue; // High blue
                    }
                }

                pointsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

                const pointsMaterial = new THREE.PointsMaterial({
                    size: 0.07, // Increased from 0.05 for better visibility
                    vertexColors: true,
                    transparent: true,
                    opacity: 0.8, // Increased from 0.6 for better visibility
                    sizeAttenuation: true,
                });
                const points = new THREE.Points(pointsGeometry, pointsMaterial);
                graph.add(points);

                // Add larger nodes at connection hubs
                const hubNodes = findHubNodes(nodePositions, 15); // Find top 15 most connected nodes
                const hubPointsGeometry = new THREE.BufferGeometry().setFromPoints(
                    hubNodes.map(index => nodes[index])
                );

                // Create more saturated colors for hub nodes
                const hubColors = new Float32Array(hubNodes.length * 3);
                for (let i = 0; i < hubNodes.length; i++) {
                    const i3 = i * 3;
                    // More intense blue or purple for hub nodes with higher saturation
                    if (Math.random() > 0.5) {
                        // Blue hub - more saturated
                        hubColors[i3] = 0.2; // Lower red
                        hubColors[i3 + 1] = 0.5; // Medium green for cyan hint
                        hubColors[i3 + 2] = 1; // Full blue
                    } else {
                        // Purple hub - more saturated
                        hubColors[i3] = 0.6; // Higher red
                        hubColors[i3 + 1] = 0.2; // Lower green
                        hubColors[i3 + 2] = 1; // Full blue
                    }
                }

                hubPointsGeometry.setAttribute('color', new THREE.BufferAttribute(hubColors, 3));

                const hubPointsMaterial = new THREE.PointsMaterial({
                    size: 0.15, // Increased from 0.12 for better visibility
                    vertexColors: true,
                    transparent: true,
                    opacity: 0.9, // Increased from 0.8 for better visibility
                    sizeAttenuation: true,
                });
                const hubPoints = new THREE.Points(hubPointsGeometry, hubPointsMaterial);
                graph.add(hubPoints);

                // Function to find nearby nodes
                function findNearbyNodes(nodeIndex: number, positions: { x: number; y: number; z: number }[], maxCount: number): number[] {
                    const current = positions[nodeIndex];
                    const distances: { index: number; distance: number }[] = [];

                    // Calculate distances to all other nodes
                    for (let i = 0; i < positions.length; i++) {
                        if (i !== nodeIndex) {
                            const other = positions[i];
                            const dx = current.x - other.x;
                            const dy = current.y - other.y;
                            const dz = current.z - other.z;
                            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

                            // Only connect if within distance threshold (creates more realistic network)
                            if (distance < 1.5) {
                                distances.push({ index: i, distance });
                            }
                        }
                    }

                    // Sort by distance and take the closest ones
                    distances.sort((a, b) => a.distance - b.distance);

                    // Take random number of connections up to maxCount
                    const connectionCount = Math.ceil(Math.random() * maxCount);
                    return distances.slice(0, Math.min(connectionCount, distances.length))
                        .map(d => d.index);
                }

                // Function to find the most connected nodes (hubs)
                function findHubNodes(positions: { x: number; y: number; z: number }[], count: number): number[] {
                    const connectionsCount: { index: number; count: number }[] = [];

                    // Count connections for each node
                    for (let i = 0; i < positions.length; i++) {
                        const connections = findNearbyNodes(i, positions, 50); // Check potential connections
                        connectionsCount.push({ index: i, count: connections.length });
                    }

                    // Sort by connection count (highest first)
                    connectionsCount.sort((a, b) => b.count - a.count);

                    // Return indices of the most connected nodes
                    return connectionsCount.slice(0, count).map(d => d.index);
                }

                // Handle window resize
                const handleResize = () => {
                    if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;

                    const width = containerRef.current.clientWidth;
                    const height = containerRef.current.clientHeight;

                    cameraRef.current.aspect = width / height;
                    cameraRef.current.updateProjectionMatrix();

                    rendererRef.current.setSize(width, height);

                    // Re-render after resize
                    if (rendererRef.current && sceneRef.current && cameraRef.current) {
                        rendererRef.current.render(sceneRef.current, cameraRef.current);
                    }
                };

                window.addEventListener('resize', handleResize);

                // Do an initial render to make sure something is visible before animation starts
                renderer.render(scene, camera);

                // Set loaded state BEFORE starting animation
                setIsLoaded(true);
                console.log("Three.js scene initialized");

                // After a short delay to ensure all rendering is complete, start animation
                setTimeout(() => {
                    console.log("Starting animation after initialization");
                    startAnimation();
                }, 50);

                // Cleanup
                return () => {
                    window.removeEventListener('resize', handleResize);

                    // Stop animation
                    isAnimatingRef.current = false;
                    if (frameIdRef.current) {
                        cancelAnimationFrame(frameIdRef.current);
                        frameIdRef.current = 0;
                    }

                    if (rendererRef.current && containerRef.current) {
                        try {
                            containerRef.current.removeChild(rendererRef.current.domElement);
                        } catch (e) {
                            console.error("Error removing renderer:", e);
                        }
                    }

                    // Dispose of geometries and materials
                    linesGeometry.dispose();
                    linesMaterial.dispose();
                    pointsGeometry.dispose();
                    pointsMaterial.dispose();
                    hubPointsGeometry.dispose();
                    hubPointsMaterial.dispose();
                };

            } catch (error) {
                console.error("Error initializing Three.js:", error);
            }
        }, 100); // Small delay to ensure DOM is ready

        return () => {
            clearTimeout(initTimeout);
        };
    }, []);

    return (
        <div className="w-full h-full">
            <div
                ref={containerRef}
                className="w-full h-full"
                style={{
                    minHeight: "600px",
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none" // This ensures mouse events pass through to elements below
                }}
            >
                {/* Loading or error message */}
                {!isLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                        Loading visualization...
                    </div>
                )}
            </div>
        </div>
    );
} 