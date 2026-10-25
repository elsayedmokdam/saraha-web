"use client";

import { useTheme } from "next-themes";
import { FaCheckCircle, FaMoon, FaPalette, FaSun } from "react-icons/fa";
import { FiMonitor } from "react-icons/fi";
import { useMounted } from "@/hooks/useMounted";

interface AppearanceProps {
  /** optional overrides (the component uses next-themes by default) */
  theme?: string;
  setTheme?: (theme: string) => void;
}

/** A miniature of the chat UI painted with FIXED colours, so each card shows its own theme. */
function Preview({ mode }: { mode: "light" | "dark" }) {
  const c =
    mode === "light"
      ? { bg: "#efecf8", bar: "#ffffff", text: "#1b1a2b", sub: "#c9c6dc", inBubble: "#ffffff", out: "#7c3aed" }
      : { bg: "#0a090f", bar: "#16151f", text: "#ececf5", sub: "#3a3850", inBubble: "#1e1d2b", out: "#6d3fe0" };

  return (
    <div className="overflow-hidden rounded-lg border border-border" style={{ background: c.bg }}>
      <div className="flex items-center gap-2 px-2.5 py-2" style={{ background: c.bar }}>
        <span className="size-3.5 rounded-full" style={{ background: c.out }} />
        <span className="h-1.5 w-12 rounded" style={{ background: c.text, opacity: 0.8 }} />
      </div>
      <div className="space-y-1.5 p-2.5">
        <div className="h-4 w-3/5 rounded-lg rounded-tl-sm" style={{ background: c.inBubble }} />
        <div className="ml-auto h-4 w-1/2 rounded-lg rounded-tr-sm" style={{ background: c.out }} />
        <div className="h-4 w-2/5 rounded-lg rounded-tl-sm" style={{ background: c.inBubble }} />
      </div>
    </div>
  );
}

export default function Appearance({ theme: externalTheme, setTheme: externalSetTheme }: AppearanceProps) {
  const { theme: contextTheme, setTheme: contextSetTheme } = useTheme();
  // the stored theme only exists in the browser: show the selection after hydration to avoid a mismatch
  const mounted = useMounted();
  const current = mounted ? (externalTheme ?? contextTheme) : undefined;
  const change = externalSetTheme ?? contextSetTheme;

  const options = [
    { value: "light", title: "Light", text: "Bright and clean", icon: <FaSun className="size-4" />, iconClass: "bg-amber-100 text-amber-500 dark:bg-amber-500/15 dark:text-amber-300", preview: <Preview mode="light" /> },
    { value: "dark", title: "Dark", text: "Easy on the eyes", icon: <FaMoon className="size-4" />, iconClass: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300", preview: <Preview mode="dark" /> },
    {
      value: "system",
      title: "System",
      text: "Match your device",
      icon: <FiMonitor className="size-4" />,
      iconClass: "bg-muted text-muted-foreground",
      preview: (
        <div className="grid grid-cols-2 overflow-hidden rounded-lg">
          <div className="[&>div]:rounded-r-none"><Preview mode="light" /></div>
          <div className="[&>div]:rounded-l-none"><Preview mode="dark" /></div>
        </div>
      ),
    },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm sm:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
          <FaPalette className="size-5" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-card-foreground">Appearance &amp; Theme</h2>
          <p className="text-xs text-muted-foreground">Customize how the application looks on your device</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {options.map((o) => {
          const active = current === o.value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => change(o.value)}
              aria-pressed={active}
              className={`group relative w-full cursor-pointer rounded-xl border p-4 text-left transition-all duration-200 ${
                active
                  ? "border-main-color bg-main-color/5 ring-2 ring-main-color/25"
                  : "border-border bg-card hover:border-main-color/50"
              }`}
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex size-10 items-center justify-center rounded-xl ${o.iconClass}`}>{o.icon}</div>
                  <div>
                    <h3 className="text-xs font-semibold text-card-foreground">{o.title}</h3>
                    <p className="text-[11px] text-muted-foreground">{o.text}</p>
                  </div>
                </div>
                {active && <FaCheckCircle className="size-5 text-main-color" />}
              </div>
              {o.preview}
            </button>
          );
        })}
      </div>
    </div>
  );
}
