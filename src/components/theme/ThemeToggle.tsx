"use client";

import { useTheme } from "next-themes";
import { FiCheck, FiMonitor, FiMoon, FiSun } from "react-icons/fi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const OPTIONS = [
  { value: "light", label: "Light", icon: FiSun },
  { value: "dark", label: "Dark", icon: FiMoon },
  { value: "system", label: "System", icon: FiMonitor },
] as const;

interface ThemeToggleProps {
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
}

/** Sun / moon button with a Light · Dark · System menu. */
export default function ThemeToggle({ side = "bottom", className = "" }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Change theme"
          title="Theme"
          className={`flex size-10 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-muted hover:text-foreground cursor-pointer ${className}`}
        >
          {/* both icons are in the DOM: CSS picks one, so there is no hydration mismatch */}
          <FiSun className="size-5 dark:hidden" />
          <FiMoon className="hidden size-5 dark:block" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side={side} align="end" className="w-40 rounded-xl p-1">
        {OPTIONS.map(({ value, label, icon: Icon }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => setTheme(value)}
            className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2"
          >
            <Icon className="size-4" />
            <span className="flex-1">{label}</span>
            {theme === value && <FiCheck className="size-4 text-main-color" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
