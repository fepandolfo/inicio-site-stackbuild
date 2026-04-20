/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(222 47% 5%)",
        foreground: "hsl(210 40% 98%)",
        card: "hsl(222 47% 7%)",
        "card-foreground": "hsl(210 40% 98%)",
        primary: "hsl(196 100% 55%)",
        "primary-foreground": "hsl(222 47% 5%)",
        "primary-glow": "hsl(196 100% 70%)",
        secondary: "hsl(218 70% 22%)",
        "secondary-foreground": "hsl(210 40% 98%)",
        muted: "hsl(222 30% 12%)",
        "muted-foreground": "hsl(215 20% 65%)",
        accent: "hsl(210 100% 50%)",
        "accent-foreground": "hsl(210 40% 98%)",
      },
      fontFamily: {
        sans: ["Space Grotesk", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, hsl(218 80% 18%), hsl(196 100% 55%))",
        "gradient-hero": "linear-gradient(135deg, hsl(222 47% 5%) 0%, hsl(218 70% 12%) 50%, hsl(196 80% 18%) 100%)",
        "gradient-text": "linear-gradient(135deg, hsl(210 40% 98%) 0%, hsl(196 100% 70%) 100%)",
        "gradient-card": "linear-gradient(145deg, hsl(222 47% 8% / 0.8), hsl(218 60% 12% / 0.4))",
        "gradient-glow": "radial-gradient(circle at center, hsl(196 100% 55% / 0.25), transparent 70%)",
        grid: "linear-gradient(hsl(196 100% 55% / 0.07) 1px, transparent 1px), linear-gradient(90deg, hsl(196 100% 55% / 0.07) 1px, transparent 1px)",
      },
      boxShadow: {
        "glow": "0 0 40px hsl(196 100% 55% / 0.4)",
        "glow-lg": "0 0 80px hsl(196 100% 55% / 0.3)",
        "elegant": "0 20px 60px -15px hsl(196 100% 30% / 0.5)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "fade-up": "fade-up 0.8s cubic-bezier(0.4, 0, 0.2, 1) both",
        shimmer: "shimmer 3s linear infinite",
        scan: "scan 8s linear infinite",
        spin: "spin 20s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "fade-up": {
          "from": { opacity: "0", transform: "translateY(24px)" },
          "to": { opacity: "1", transform: "translateY(0)" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        spin: {
          "from": { transform: "rotateX(18deg) rotateY(0deg)" },
          "to": { transform: "rotateX(18deg) rotateY(360deg)" },
        },
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
}
