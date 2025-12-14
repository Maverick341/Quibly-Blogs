import { useDispatch, useSelector } from "react-redux";
import { toggleMode } from "@/store/themeSlice";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.theme.mode);
  const isDarkMode = mode === "dark";

  return (
    <button
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => dispatch(toggleMode())}
      className="inline-flex items-center justify-center rounded-md p-2 transition-colors duration-150 ease-out text-[#4f5358] hover:text-[#8c7a57] dark:text-[#c5c3bf] dark:hover:text-[#a8956b] hover:bg-black/5 dark:hover:bg-white/5"
    >
      {isDarkMode ? (
        <Sun size={18} strokeWidth={1.75} />
      ) : (
        <Moon size={18} strokeWidth={1.75} />
      )}
    </button>
  );
}
