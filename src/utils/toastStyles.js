import store from "@/store/store";

export function getToastStyles(type = "default") {
  const theme = store.getState().theme.mode;
  const isDark = theme === "dark";

  const baseStyle = {
    background: isDark ? "#27272a" : "#fafafa", // zinc-800 / zinc-50
    color: isDark ? "#e4e4e7" : "#27272a", // zinc-200 / zinc-800
    minWidth: "140px",
    padding: "8px 14px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "500",
    boxShadow: isDark 
      ? "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)"
      : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  };

  const styles = {
    success: {
      ...baseStyle,
      border: isDark ? "1px solid #3f3f46" : "1px solid #d4d4d8", // zinc-700 / zinc-300
      background: isDark ? "#27272a" : "#f0fdf4", // zinc-800 / green-50
      color: isDark ? "#86efac" : "#166534", // green-300 / green-800
    },
    error: {
      ...baseStyle,
      border: isDark ? "1px solid #3f3f46" : "1px solid #d4d4d8", // zinc-700 / zinc-300
      background: isDark ? "#27272a" : "#fef2f2", // zinc-800 / red-50
      color: isDark ? "#fca5a5" : "#991b1b", // red-300 / red-800
    },
    default: {
      ...baseStyle,
      border: isDark ? "1px solid #3f3f46" : "1px solid #d4d4d8", // zinc-700 / zinc-300
    },
  };

  return styles[type] || styles.default;
}
