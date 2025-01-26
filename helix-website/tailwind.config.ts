const { fontFamily } = require("tailwindcss/defaultTheme")

/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        "./src/app/**/*.{ts,tsx}",
        "./src/components/**/*.{ts,tsx}"],
    theme: {
    	container: {
    		center: true,
    		padding: '2rem',
    		screens: {
    			'2xl': '1400px'
    		}
    	},
    	extend: {
    		colors: {
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			primary: {
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			}
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		keyframes: {
    			scroll: {
    				from: {
    					transform: 'translateX(0)'
    				},
    				to: {
    					transform: 'translateX(calc(-50% - 1rem))'
    				}
    			},
    			'spin-around': {
    				'0%': {
    					transform: 'translateZ(0) rotate(0)'
    				},
    				'15%, 35%': {
    					transform: 'translateZ(0) rotate(90deg)'
    				},
    				'65%, 85%': {
    					transform: 'translateZ(0) rotate(270deg)'
    				},
    				'100%': {
    					transform: 'translateZ(0) rotate(360deg)'
    				}
    			},
    			'shimmer-slide': {
    				to: {
    					transform: 'translate(calc(100cqw - 100%), 0)'
    				}
    			}
    		},
    		animation: {
    			scroll: 'scroll var(--animation-duration) linear infinite',
    			'shimmer-slide': 'shimmer-slide var(--speed) ease-in-out infinite alternate',
    			'spin-around': 'spin-around calc(var(--speed) * 2) infinite linear'
    		},
    		fontFamily: {
    			sans: [
    				'var(--font-geist)',
                    ...fontFamily.sans
                ]
    		},
    		backgroundImage: {
    			'grid-pattern': 'linear-gradient(to right, rgb(50, 50, 50) 1px, transparent 1px), linear-gradient(to bottom, rgb(50, 50, 50) 1px, transparent 1px)',
    			'grid-pattern-light': 'linear-gradient(to right, rgb(200, 200, 200) 1px, transparent 1px), linear-gradient(to bottom, rgb(200, 200, 200) 1px, transparent 1px)'
    		}
    	}
    },
    plugins: [require("tailwindcss-animate")],
}