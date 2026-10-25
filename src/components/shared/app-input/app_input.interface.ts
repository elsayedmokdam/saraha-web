import { InputHTMLAttributes } from "react";

/**
 * @description Props for AppInput component
 */
export interface AppInputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** @description The label of the input */
  label?: string;
  /** @description The icon of the input */
  icon?: React.ReactNode;
  /** @description The position of the icon */
  iconPosition?: "start" | "end";
  /** @description Legacy alias for iconPosition */
  position?: "start" | "end";
  /** @description The icon placed at the end of the input */
  endIcon?: React.ReactNode;
  /** @description The className of the input */
  className?: string;
  /** @description The className of the icon */
  iconClassName?: string;
  /** @description The className of the end icon wrapper */
  endIconClassName?: string;
}
