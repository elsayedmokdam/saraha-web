import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  bgColor?: string;
  iconBg?: string;
}

export default function FeatureCard({
  icon,
  title,
  subtitle,
  bgColor = "bg-card",
  iconBg = "bg-main-color/10 text-main-color",
}: FeatureCardProps) {
  return (
    <div
      className={`flex items-center gap-4 p-5 rounded-xl shadow-sm border border-border ${bgColor} hover:shadow-md transition`}
    >
      <div
        className={`flex shrink-0 items-center justify-center w-12 h-12 rounded-full text-xl ${iconBg}`}
      >
        {icon}
      </div>
      <div className="flex flex-col">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}
