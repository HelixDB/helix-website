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
    			'2xl': '1200px'
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
    			marquee: {
    				'0%': {
    					transform: 'translateX(0%)'
    				},
    				'100%': {
    					transform: 'translateX(-100%)'
    				}
    			},
    			'marquee-vertical': {
    				'0%': {
    					transform: 'translateY(0%)'
    				},
    				'100%': {
    					transform: 'translateY(-100%)'
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
    			},
    			'accordion-down': {
    				from: {
    					height: '0'
    				},
    				to: {
    					height: 'var(--radix-accordion-content-height)'
    				}
    			},
    			'accordion-up': {
    				from: {
    					height: 'var(--radix-accordion-content-height)'
    				},
    				to: {
    					height: '0'
    				}
    			},
    			orbit: {
    				'0%': {
    					transform: 'rotate(calc(var(--angle) * 1deg)) translateY(calc(var(--radius) * 1px)) rotate(calc(var(--angle) * -1deg))'
    				},
    				'100%': {
    					transform: 'rotate(calc(var(--angle) * 1deg + 360deg)) translateY(calc(var(--radius) * 1px)) rotate(calc((var(--angle) * -1deg) - 360deg))'
    				}
    			},
    			'gradient-shift': {
    				'0%, 100%': {
    					'background-position': '0% 50%'
    				},
    				'50%': {
    					'background-position': '100% 50%'
    				}
    			}
    		},
    		animation: {
    			scroll: 'scroll var(--animation-duration) linear infinite',
    			'shimmer-slide': 'shimmer-slide var(--speed) ease-in-out infinite alternate',
    			marquee: 'marquee 25s linear infinite',
    			'marquee-vertical': 'marquee-vertical 25s linear infinite',
    			'spin-around': 'spin-around calc(var(--speed) * 2) infinite linear',
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out',
    			'aurora-text': 'aurora 3s linear infinite',
    			orbit: 'orbit calc(var(--duration)*1s) linear infinite',
    			'gradient-slow': 'gradient-shift 8s ease infinite'
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
    		},
    		maskImage: {
    			'radial-gradient': 'radial-gradient(var(--tw-gradient-stops))'
    		},
    		backgroundSize: {
    			'gradient-size': '400% 400%'
    		}
    	}
    },
    plugins: [require("tailwindcss-animate")],
}