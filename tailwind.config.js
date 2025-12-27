import typography from "@tailwindcss/typography";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#a8956b',
          dark: '#8c7a57'
        },
        neutral: {
          bg: '#f5f4f0',
          surface: '#f0eeea',
          text: '#1f2226',
          muted: '#4f5358',
          mid: '#6a6e73',
          light: '#dedad5',
          darkBg: '#2a2d31',
          darkSurface: '#35383c',
          darkText: '#e8e6e3'
        },
        border: {
          light: '#d5d2cc',
          mid: '#e5e4e0',
          dark: '#c5c3bf'
        }
      }
    },
  },
  plugins: [typography],
};
