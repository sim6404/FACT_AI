import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    // border colors
    { pattern: /^border-(amber|orange|cyan|emerald|red|purple|slate|green|blue)-(300|400|500|600|700)\/(10|20|25|30|40|50)$/ },
    // text colors
    { pattern: /^text-(amber|orange|cyan|emerald|red|purple|slate|green|blue)-(300|400|500)$/ },
    // bg colors
    { pattern: /^bg-(amber|orange|cyan|emerald|red|purple|slate|green|blue)-(400|500|600|700|800|900)\/(10|15|20|30|40|50|60)$/ },
    // standalone solid bg
    { pattern: /^bg-(amber|orange|cyan|emerald|red|purple|green|slate|blue)-(400|500|600)$/ },
    // stroke (SVG)
    { pattern: /^stroke-(emerald|amber|red|cyan|orange)-(400|500|600)$/ },
    // ring
    { pattern: /^ring-(amber|emerald|red|orange)-(500)$/ },
  ],
  theme: {
    extend: {
      colors: {
        // 영동테크 브랜드 앰버/골드
        brand: {
          50:  "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",   // 주 브랜드 컬러 (로고 앰버)
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
          950: "#451a03",
        },
        // 다크 차콜 서피스 (로고 블록 기반)
        surface: {
          DEFAULT: "#141414",   // 주 배경 (로고 블랙)
          card:    "#1e1e1e",   // 카드 배경
          border:  "#383838",   // 테두리
          hover:   "#2a2a2a",   // 호버
        },
        // 영동테크 그린 (자동차 제품 링크 색)
        ydtech: {
          green:  "#4A8C3A",
          amber:  "#D4920A",
          dark:   "#1C1C1C",
        },
        accent: {
          cyan:   "#06b6d4",
          purple: "#8b5cf6",
          green:  "#10b981",
          amber:  "#f59e0b",
          red:    "#ef4444",
          orange: "#f97316",
        },
      },
      fontFamily: {
        sans: ["Pretendard", "Noto Sans KR", "Inter", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      backgroundImage: {
        // 영동테크 브랜드 그라디언트
        "gradient-brand":  "linear-gradient(135deg, #1C1C1C 0%, #2A2A2A 50%, #141414 100%)",
        "gradient-card":   "linear-gradient(145deg, #1e1e1e, #2a2a2a)",
        "gradient-accent": "linear-gradient(135deg, #D4920A, #f59e0b)",  // 앰버 그라디언트
        "gradient-ydtech": "linear-gradient(135deg, #D4920A 0%, #b45309 50%, #1C1C1C 100%)",
      },
      boxShadow: {
        "card":      "0 4px 24px rgba(0,0,0,0.5)",
        "glow":      "0 0 20px rgba(212,146,10,0.3)",    // 앰버 글로우
        "glow-amber":"0 0 20px rgba(212,146,10,0.4)",
        "glow-gold": "0 0 30px rgba(245,158,11,0.2)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in":    "fadeIn 0.3s ease-in-out",
        "slide-up":   "slideUp 0.3s ease-out",
        "shimmer":    "shimmer 2s infinite",
      },
      keyframes: {
        fadeIn:  { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: { "0%": { transform: "translateY(10px)", opacity: "0" }, "100%": { transform: "translateY(0)", opacity: "1" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
      },
    },
  },
  plugins: [],
};

export default config;
