/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: [
	  './pages/**/*.{ts,tsx}',
	  './components/**/*.{ts,tsx}',
	  './app/**/*.{ts,tsx}',
	  './src/**/*.{ts,tsx}',
	],
	theme: {
	  container: {
		center: true,
		padding: "2rem",
		screens: {
		  "2xl": "1400px",
		},
	  },
	  extend: {
		colors: {
		  border: "hsl(var(--border))",
		  input: "hsl(var(--input))",
		  ring: "hsl(var(--ring))",
		  background: "hsl(var(--background))",
		  foreground: "hsl(var(--foreground))",
		  primary: {
			DEFAULT: "hsl(var(--primary))",
			foreground: "hsl(var(--primary-foreground))",
		  },
		  secondary: {
			DEFAULT: "hsl(var(--secondary))",
			foreground: "hsl(var(--secondary-foreground))",
		  },
		  destructive: {
			DEFAULT: "hsl(var(--destructive))",
			foreground: "hsl(var(--destructive-foreground))",
		  },
		  muted: {
			DEFAULT: "hsl(var(--muted))",
			foreground: "hsl(var(--muted-foreground))",
		  },
		  accent: {
			DEFAULT: "hsl(var(--accent))",
			foreground: "hsl(var(--accent-foreground))",
		  },
		  popover: {
			DEFAULT: "hsl(var(--popover))",
			foreground: "hsl(var(--popover-foreground))",
		  },
		  card: {
			DEFAULT: "hsl(var(--card))",
			foreground: "hsl(var(--card-foreground))",
		  },
		  'brand-blue': '#2563EB',
		  'brand-indigo': '#4F46E5',
		  'brand-purple': '#7C3AED',
		  'brand-pink': '#EC4899',
		  'brand-gradient-start': '#2563EB',
		  'brand-gradient-end': '#7C3AED',
		},
		borderRadius: {
		  lg: "var(--radius)",
		  md: "calc(var(--radius) - 2px)",
		  sm: "calc(var(--radius) - 4px)",
		},
		boxShadow: {
		  'glass': '0 4px 16px 0 rgba(31, 38, 135, 0.25)',
		  'glass-lg': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
		  'brand': '0 4px 20px rgba(124, 58, 237, 0.15)',
		},
		keyframes: {
		  "accordion-down": {
			from: { height: 0 },
			to: { height: "var(--radix-accordion-content-height)" },
		  },
		  "accordion-up": {
			from: { height: "var(--radix-accordion-content-height)" },
			to: { height: 0 },
		  },
		  "slide-left-to-right": {
			"0%": { transform: "translateX(0)" },
			"100%": { transform: "translateX(calc(-50% - 0.75rem))" }
		  },
		  "slide-right-to-left": {
			"0%": { transform: "translateX(calc(-50% - 0.75rem))" },
			"100%": { transform: "translateX(0)" }
		  },
		  "fade-in": {
			"0%": { opacity: 0 },
			"100%": { opacity: 1 }
		  },
		  "float": {
			"0%, 100%": { transform: "translateY(0)" },
			"50%": { transform: "translateY(-10px)" }
		  },
          "fadeIn": {
            "0%": { opacity: 0 },
            "100%": { opacity: 1 }
          },
          "slideLeft": {
            "0%": { transform: "translateX(0)" },
            "100%": { transform: "translateX(calc(-50% - 0.75rem))" }
          },
          "slideRight": {
            "0%": { transform: "translateX(calc(-50% - 0.75rem))" },
            "100%": { transform: "translateX(0)" }
          }
		},
		animation: {
		  "accordion-down": "accordion-down 0.2s ease-out",
		  "accordion-up": "accordion-up 0.2s ease-out",
		  "slide-left-to-right": "slide-left-to-right 30s linear infinite",
		  "slide-right-to-left": "slide-right-to-left 30s linear infinite",
		  "fade-in": "fade-in 0.5s ease-out forwards",
		  "float": "float 3s ease-in-out infinite"
		},
	  },
	},
	plugins: [require("tailwindcss-animate")],
  } 