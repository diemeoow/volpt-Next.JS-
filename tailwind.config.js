/** @type {import('tailwindcss').Config} */

const config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./views/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["SF Pro Display", "Inter", "sans-serif"],
      },
      colors: {
        glass: {
          100: "rgba(255, 255, 255, 0.1)",
          200: "rgba(255, 255, 255, 0.2)",
          300: "rgba(255, 255, 255, 0.3)",
          border: "rgba(255, 255, 255, 0.4)",
          text: "rgba(0, 0, 0, 0.8)",
          textMuted: "rgba(0, 0, 0, 0.6)",
        },
      },
      backgroundImage: {
        aurora:
          "linear-gradient(125deg, #FF9A9E 0%, #FECFEF 20%, #E0C3FC 40%, #8EC5FC 60%, #E0C3FC 80%, #ffffff 100%)",
        "liquid-blob":
          "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4), transparent 70%)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        blob: "blob 10s infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
