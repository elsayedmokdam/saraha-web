"use client";

import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";

interface IsEmptyProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  links?: {
    label: string;
    href: string;
  }[];
}

export default function IsEmpty({
  icon,
  title,
  description,
  links = [],
}: IsEmptyProps) {
  return (
    <section className="w-full flex items-center justify-center px-4 py-16 md:py-24">
      <div className="max-w-xl w-full flex flex-col items-center text-center">
        {/* Icon */}
        <div className="w-28 h-28 rounded-full bg-muted border border-border flex items-center justify-center shadow-sm mb-8">
          <div className="text-5xl text-muted-foreground">{icon}</div>
        </div>

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          {title}
        </h2>

        {/* Description */}
        <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-md mb-10">
          {description}
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {links.map((link, index) => (
            <Link
              key={link.label}
              href={link.href}
              className={`
                group flex items-center gap-2 rounded-xl px-6 py-3
                text-sm md:text-base font-semibold transition-all duration-300
                ${
                  index === 0
                    ? "bg-main-color text-white hover:scale-[1.03] hover:shadow-lg"
                    : "border border-border bg-card text-foreground hover:border-main-color hover:text-main-color"
                }
              `}
            >
              <span>{link.label}</span>
              <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
