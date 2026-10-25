"use client";

interface SegmentedTabsProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string; icon?: React.ReactNode }[];
}

export default function SegmentedTabs<T extends string>({
  value,
  onChange,
  options,
}: SegmentedTabsProps<T>) {
  return (
    <div className="inline-flex rounded-xl bg-muted p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition cursor-pointer ${
            value === option.value
              ? "bg-card text-main-color shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {option.icon}
          {option.label}
        </button>
      ))}
    </div>
  );
}
