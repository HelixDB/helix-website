import React from 'react';

interface MeshPatternProps {
    className?: string;
    color?: string;
}

export const MeshPattern: React.FC<MeshPatternProps> = ({
    className = "",
    color = "currentColor"
}) => {
    return (
        <div className={`absolute inset-0 z-0 opacity-[0.03] pointer-events-none ${className}`}>
            <svg
                className="w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%"
            >
                <defs>
                    <pattern
                        id="mesh-pattern"
                        x="0"
                        y="0"
                        width="40"
                        height="40"
                        patternUnits="userSpaceOnUse"
                    >
                        <path
                            d="M0 20h40M20 0v40"
                            stroke={color}
                            strokeWidth="0.5"
                            fill="none"
                        />
                        <circle
                            cx="20"
                            cy="20"
                            r="1"
                            fill={color}
                        />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#mesh-pattern)" />
            </svg>
        </div>
    );
}; 