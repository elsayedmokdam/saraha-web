"use client";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { AppInputProps } from "./app_input.interface";

export default function AppInput({
  placeholder,
  label,
  icon,
  iconPosition = "start",
  position,
  endIcon,
  className = "",
  iconClassName = "",
  endIconClassName = "",
  ...rest
}: AppInputProps) {
  const align = position ?? iconPosition;

  return (
    <Field className="gap-5">
      {label && <FieldLabel>{label}</FieldLabel>}

      <InputGroup
        className={`bg-card w-full border py-6 px-2 border-input ${className}`}
      >
        {icon && align === "start" && (
          <InputGroupAddon align="inline-start" className={iconClassName}>
            {icon}
          </InputGroupAddon>
        )}

        <InputGroupInput
          placeholder={placeholder}
          className="placeholder:text-muted-foreground/70 text-sm py-6 px-2"
          {...rest}
        />

        {icon && align === "end" && (
          <InputGroupAddon align="inline-end" className={iconClassName}>
            {icon}
          </InputGroupAddon>
        )}

        {endIcon && (
          <InputGroupAddon align="inline-end" className={endIconClassName}>
            {endIcon}
          </InputGroupAddon>
        )}
      </InputGroup>
    </Field>
  );
}
