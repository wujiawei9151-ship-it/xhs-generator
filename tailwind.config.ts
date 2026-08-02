import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 小红书风格自定义色板
        xhs: {
          red: "#FF2442", // 品牌红（点缀用）
          pink: "#FF6B8B", // 主粉
          rose: "#FFE1E9", // 浅粉背景
          cream: "#FFF8F5", // 奶油底色
          coral: "#FF9770", // 珊瑚强调色
          ink: "#2B1A1F", // 深文字色（带一点玫瑰调）
          plum: "#7A4756", // 次级文字
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      backgroundImage: {
        "xhs-gradient": "linear-gradient(135deg, #FFE1E9 0%, #FFF8F5 55%, #FFE9DC 100%)",
        "xhs-card": "linear-gradient(160deg, #FFFFFF 0%, #FFF3F6 100%)",
        "xhs-button": "linear-gradient(90deg, #FF6B8B 0%, #FF2442 100%)",
      },
      boxShadow: {
        xhs: "0 10px 30px -10px rgba(255, 36, 66, 0.25)",
        "xhs-sm": "0 4px 14px -4px rgba(255, 107, 139, 0.3)",
      },
      borderRadius: {
        xhs: "1.25rem",
      },
      keyframes: {
        blob: {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(20px, -30px) scale(1.05)" },
          "66%": { transform: "translate(-15px, 15px) scale(0.97)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        blob: "blob 9s infinite ease-in-out",
        "fade-up": "fade-up 0.5s ease-out forwards",
        shimmer: "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
