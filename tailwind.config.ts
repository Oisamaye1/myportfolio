import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-in-left": {
          "0%": {
            opacity: "0",
            transform: "translateX(-20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
        "fade-in-right": {
          "0%": {
            opacity: "0",
            transform: "translateX(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
        "zoom-in": {
          "0%": {
            opacity: "0",
            transform: "scale(0.9)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)",
          },
        },
        float: {
          "0%, 100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-20px)",
          },
        },
        "float-reverse": {
          "0%, 100%": {
            transform: "translateY(-20px)",
          },
          "50%": {
            transform: "translateY(0px)",
          },
        },
        "bounce-in": {
          "0%": {
            opacity: "0",
            transform: "scale(0.3) rotate(-10deg)",
          },
          "50%": {
            opacity: "1",
            transform: "scale(1.05) rotate(5deg)",
          },
          "70%": {
            transform: "scale(0.9) rotate(-2deg)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1) rotate(0deg)",
          },
        },
        "slide-in-diagonal": {
          "0%": {
            opacity: "0",
            transform: "translate(-100px, 100px) rotate(-10deg)",
          },
          "100%": {
            opacity: "1",
            transform: "translate(0, 0) rotate(0deg)",
          },
        },
        morph: {
          "0%, 100%": {
            borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
          },
          "50%": {
            borderRadius: "30% 60% 70% 40% / 50% 60% 30% 60%",
          },
        },
        glow: {
          "0%, 100%": {
            boxShadow: "0 0 20px hsl(var(--primary) / 0.5)",
          },
          "50%": {
            boxShadow: "0 0 40px hsl(var(--primary) / 0.8), 0 0 60px hsl(var(--primary) / 0.3)",
          },
        },
        "spin-slow": {
          from: {
            transform: "rotate(0deg)",
          },
          to: {
            transform: "rotate(360deg)",
          },
        },
        wiggle: {
          "0%, 100%": {
            transform: "rotate(-3deg)",
          },
          "50%": {
            transform: "rotate(3deg)",
          },
        },
        "slide-up-fade": {
          "0%": {
            opacity: "0",
            transform: "translateY(100px) scale(0.8)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0) scale(1)",
          },
        },
        "rotate-in": {
          "0%": {
            opacity: "0",
            transform: "rotate(-180deg) scale(0.5)",
          },
          "100%": {
            opacity: "1",
            transform: "rotate(0deg) scale(1)",
          },
        },
        elastic: {
          "0%": {
            transform: "scale(0)",
          },
          "50%": {
            transform: "scale(1.2)",
          },
          "75%": {
            transform: "scale(0.9)",
          },
          "100%": {
            transform: "scale(1)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "fade-in-left": "fade-in-left 0.6s ease-out forwards",
        "fade-in-right": "fade-in-right 0.6s ease-out forwards",
        "zoom-in": "zoom-in 0.6s ease-out forwards",
        float: "float 6s ease-in-out infinite",
        "float-reverse": "float-reverse 6s ease-in-out infinite",
        "bounce-in": "bounce-in 0.8s ease-out forwards",
        "slide-in-diagonal": "slide-in-diagonal 0.8s ease-out forwards",
        morph: "morph 8s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite",
        "spin-slow": "spin-slow 20s linear infinite",
        wiggle: "wiggle 1s ease-in-out infinite",
        "slide-up-fade": "slide-up-fade 0.8s ease-out forwards",
        "rotate-in": "rotate-in 0.8s ease-out forwards",
        elastic: "elastic 0.8s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
