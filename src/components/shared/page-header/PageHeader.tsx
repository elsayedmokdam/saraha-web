import React from "react";

export interface PageName {
  name: string;
  href: string;
}

export interface PageHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  /** buttons / controls shown at the end of the bar */
  actions?: React.ReactNode;
  /** kept for backwards compatibility with the previous banner header (ignored) */
  pageName?: PageName[];
  bgColor?: string;
  iconBgColor?: string;
}

/** Compact app bar shown at the top of every page (sticky, follows the theme). */
export default function PageHeader({ icon, title, subtitle, actions }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-card/85 px-4 py-3 backdrop-blur md:px-6">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-xl text-accent-foreground">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-lg font-bold leading-tight text-foreground">{title}</h1>
        {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  );
}
