"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { RiMoonLine, RiSunLine } from "react-icons/ri";

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  const current = theme === "system" ? systemTheme : theme;
  const isDark = current === "dark";
  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-full border text-sm transition-colors border-black/20 text-black/80 hover:text-black hover:border-black/40 dark:border-white/20 dark:text-white/90 dark:hover:text-white dark:hover:border-white/40"
    >
      {isDark ? <RiSunLine /> : <RiMoonLine />}
      <span>{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}


