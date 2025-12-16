import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function ThemeProvider({ children }) {
  const mode = useSelector((state) => state.theme.mode);

  useEffect(() => {
    const isDark = mode === "dark";
    document.documentElement.classList.toggle("dark", isDark);

    localStorage.setItem("theme", mode);
  }, [mode]);

  return children;
}
