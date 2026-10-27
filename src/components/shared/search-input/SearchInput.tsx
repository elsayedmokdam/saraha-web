"use client";

import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";

interface SearchInputProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
  initialValue?: string;
}

export default function SearchInput({
  onSearch,
  placeholder = "Search...",
  debounceMs = 400,
  className = "",
  initialValue = "",
}: SearchInputProps) {
  const [query, setQuery] = useState(initialValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query.trim());
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs, onSearch]);

  return (
    <div className={`relative`}>
      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoComplete="off"
        type="search"
        placeholder={placeholder}
        className={`w-full rounded-xl border border-transparent bg-muted py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-main-color focus:outline-none ${className}`}
      />
    </div>
  );
}
