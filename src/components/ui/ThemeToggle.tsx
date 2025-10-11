"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { RiComputerLine, RiMoonLine, RiSunLine } from "react-icons/ri";

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => setMounted(true), []);
  
  if (!mounted) return null;
  
  const current = theme === "system" ? systemTheme : theme;
  const isDark = current === "dark";
  
  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };
  
  const getIcon = () => {
    if (theme === "system") {
      return <RiComputerLine />;
    }
    return isDark ? <RiSunLine /> : <RiMoonLine />;
  };
  
 
  
  return (
    <button
      aria-label="Toggle theme"
      onClick={cycleTheme}
      className="inline-flex items-center justify-center w-10 h-10 rounded-full border transition-colors border-black/20 text-black/80 hover:text-black hover:border-black/40 dark:border-white/20 dark:text-white/90 dark:hover:text-white dark:hover:border-white/40"
    >
      {getIcon()}
    </button>
  );
}


