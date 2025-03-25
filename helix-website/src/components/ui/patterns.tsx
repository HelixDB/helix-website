import React from 'react';

interface PatternProps {
    className?: string;
    color?: string;
    variant?: 'dots' | 'mesh' | 'helix' | 'waves';
    size?: number;
    mobileSize?: number;
}

export const Pattern: React.FC<PatternProps> = ({
    className = "",
    color = "currentColor",
    variant = 'dots',
    size = 40,
    mobileSize
}) => {
    // Use mobileSize if provided, otherwise use 60% of regular size for mobile
    const mobileSizeValue = mobileSize || Math.floor(size * 0.6);

    const patterns = {
        dots: (size: number) => (
            <pattern
                id={`dots-pattern-${size}`}
                x="0"
                y="0"
                width={size}
                height={size}
                patternUnits="userSpaceOnUse"
            >
                <circle cx={size / 2} cy={size / 2} r="1" fill={color} />
            </pattern>
        ),
        mesh: (size: number) => (
            <pattern
                id={`mesh-pattern-${size}`}
                x="0"
                y="0"
                width={size}
                height={size}
                patternUnits="userSpaceOnUse"
            >
                <path
                    d={`M0 ${size / 2}h${size}M${size / 2} 0v${size}`}
                    stroke={color}
                    strokeWidth="0.5"
                    fill="none"
                />
                <circle cx={size / 2} cy={size / 2} r="1" fill={color} />
            </pattern>
        ),
        helix: (size: number) => (
            <pattern
                id={`helix-pattern-${size}`}
                x="0"
                y="0"
                width={size * 2}
                height={size * 4}
                patternUnits="userSpaceOnUse"
            >
                <path
                    d={`
                        M ${size} 0 
                        C ${size * 1.5} ${size}, ${size * 0.5} ${size * 2}, ${size} ${size * 3}
                        M ${size} 0 
                        C ${size * 0.5} ${size}, ${size * 1.5} ${size * 2}, ${size} ${size * 3}
                    `}
                    stroke={color}
                    strokeWidth="0.5"
                    fill="none"
                />
                <circle cx={size} cy="0" r="1" fill={color} />
                <circle cx={size} cy={size * 3} r="1" fill={color} />
            </pattern>
        ),
        waves: (size: number) => (
            <pattern
                id={`waves-pattern-${size}`}
                x="0"
                y="0"
                width={size * 2}
                height={size}
                patternUnits="userSpaceOnUse"
            >
                <path
                    d={`M0 ${size / 2} C ${size / 2} ${size * 0.2}, ${size} ${size * 0.8}, ${size * 2} ${size / 2}`}
                    stroke={color}
                    strokeWidth="0.5"
                    fill="none"
                />
            </pattern>
        )
    };

    return (
        <div className={`absolute z-0 opacity-[0.03] pointer-events-none ${className}`}>
            <svg
                className="w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%"
            >
                <defs>
                    {/* Desktop pattern */}
                    {patterns[variant](size)}
                    {/* Mobile pattern */}
                    {patterns[variant](mobileSizeValue)}
                </defs>
                <rect
                    width="100%"
                    height="100%"
                    className="hidden md:block"
                    fill={`url(#${variant}-pattern-${size})`}
                />
                <rect
                    width="100%"
                    height="100%"
                    className="md:hidden block"
                    fill={`url(#${variant}-pattern-${mobileSizeValue})`}
                />
            </svg>
        </div>
    );
}; 