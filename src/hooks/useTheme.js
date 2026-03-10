import { useEffect, useState } from "react";

export function useTheme() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const saved = localStorage.getItem("theme");

    if (saved === "dark") {
      html.classList.add("dark");
      setIsDark(true);
    } else {
      html.classList.add("light");
    }
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;

    html.classList.toggle("dark");
    html.classList.toggle("light");

    const newTheme = html.classList.contains("dark") ? "dark" : "light";

    setIsDark(newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  return { isDark, toggleTheme };
}
