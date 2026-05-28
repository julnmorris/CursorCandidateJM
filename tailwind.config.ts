import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#14120b",
        graphite: "#1b1811",
        panel: "#201d15",
        mist: "#edecec",
        muted: "#a7a19a",
        line: "rgba(237, 236, 236, 0.16)",
        acid: "#edecec",
        ember: "#c8b99c",
        violet: "#d8d3c7"
      },
      boxShadow: {
        glow: "0 0 80px rgba(237, 236, 236, 0.08)",
        card: "0 18px 50px rgba(0, 0, 0, 0.22)"
      },
      fontFamily: {
        sans: ["var(--font-cursor)", "system-ui", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
        mono: ["var(--font-cursor)", "system-ui", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
