import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#070707",
        panel: "#101010",
        line: "rgba(255,255,255,0.1)",
        ember: "#f97316",
        mint: "#3ddc97",
        aqua: "#8ab4f8"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(249, 115, 22, 0.18)",
        panel: "0 18px 50px rgba(0, 0, 0, 0.28)"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
