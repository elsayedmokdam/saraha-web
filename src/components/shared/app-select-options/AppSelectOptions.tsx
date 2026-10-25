"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppSelectOptionsProps } from "./app_select_options.interface";

export function AppSelectOptions({
  placeholder,
  label,
  values,
  value,
  onChange,
}: AppSelectOptionsProps & {
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <Select value={value || undefined} onValueChange={onChange}>
      <SelectTrigger className="w-full rounded-xl bg-card border-input py-6">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          {label && <SelectLabel>{label}</SelectLabel>}

          {values?.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default AppSelectOptions;
