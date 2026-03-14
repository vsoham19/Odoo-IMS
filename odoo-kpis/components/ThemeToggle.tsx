"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={cn("inline-flex h-9 min-w-16 whitespace-nowrap items-center justify-center gap-2 rounded-full px-4 border border-transparent", className)} />;
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className={cn(
        "inline-flex h-9 min-w-fit whitespace-nowrap items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold shadow-lg ring-2 ring-offset-2 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2",
        "bg-amber-400 text-amber-950 ring-amber-500/50 hover:bg-amber-300",
        "dark:bg-amber-500 dark:text-amber-950 dark:ring-amber-400/50 dark:hover:bg-amber-400",
        className
      )}
    >
      {theme === "dark" ? (
        <Sun size={20} aria-hidden />
      ) : (
        <Moon size={20} aria-hidden />
      )}
      <span className="leading-none">{theme === "dark" ? "Light" : "Dark"}</span>
    </button>
  );
}
