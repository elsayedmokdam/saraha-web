/**
 * @description Props for AppSelectOption component
 */
export interface AppSelectOptionsProps {
  /** @description The label of the option group */
  label?: string;
  /** @description The placeholder of the select */
  placeholder?: string;
  /** @description Array of options */
  values: { value: string; label: string }[];
}
