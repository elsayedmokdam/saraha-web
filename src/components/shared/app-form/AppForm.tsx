"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, forwardRef, useImperativeHandle } from "react";
import { ImSpinner } from "react-icons/im";
import { FaArrowRight } from "react-icons/fa6";

import { FieldLabel, FieldError } from "@/components/ui/field";
import { AppFormProps } from "./app_form.interface";
import AppButton from "../app-button/AppButton";

export interface AppFormRef {
  submit: (cb: (data: any) => void) => void;
  getValues: () => any;
  reset: (values?: any) => void;
  isValid: boolean;
}

// Function to create a form and to allow to the form to accept a ref
const AppForm = forwardRef<AppFormRef, AppFormProps>(
  (
    {
      fields,
      components,
      onSubmit,
      schema,
      defaultValues,
      buttonText = "Submit",
      buttonClassName = "bg-main-color text-white font-semibold px-6 py-6 rounded-xl w-full flex items-center justify-center gap-2 transition",
      submitButton = true,
      resetButton = false,
      formClassName = "space-y-4",
      layoutClassName = "",
      children,
    },
    ref,
  ) => {
    const resolver = useMemo(() => {
      if (!schema) return undefined;
      return zodResolver(schema as any);
    }, [schema]);

    const {
      control,
      handleSubmit,
      getValues,
      reset,
      watch,
      formState: { isSubmitting, isValid },
    } = useForm({
      defaultValues,
      mode: "all",
      resolver,
    });

    // Expose functions to parent and it is mean that anyone use the ref can call them
    useImperativeHandle(ref, () => ({
      submit: (cb) => handleSubmit(cb)(),
      getValues,
      reset,
      isValid,
    }));

    const values = watch();

    const visibleFields = useMemo(() => {
      return (
        fields?.filter((f) => !f.hidden && (!f.showWhen || f.showWhen(values))) ??
        []
      );
    }, [fields, values]);

    return (
      <form onSubmit={handleSubmit(onSubmit)} className={formClassName}>
        {/* Fields */}
        <div className={layoutClassName}>
          {visibleFields.map((fieldItem) => {
            const Component = components?.[fieldItem.type];

            if (!Component) {
              if (process.env.NODE_ENV === "development") {
                console.warn(
                  `[AppForm] Missing component for type: ${fieldItem.type}`,
                );
              }
              return null;
            }

            return (
              <Controller
                key={fieldItem.name}
                name={fieldItem.name as any}
                control={control}
                render={({ field, fieldState }) => (
                  <div data-invalid={fieldState.invalid}>
                    {fieldItem.label && (
                      <FieldLabel>{fieldItem.label}</FieldLabel>
                    )}

                    <Component
                      {...field}
                      {...fieldItem.props}
                      value={field.value ?? ""}
                      placeholder={fieldItem.placeholder}
                    />

                    {fieldState.error && (
                      <FieldError
                        className="mt-1"
                        errors={[fieldState.error]}
                      />
                    )}
                  </div>
                )}
              />
            );
          })}
        </div>

        {/* Extra content */}
        {children}

        {/* Actions */}
        {(submitButton || resetButton) && (
          <div className="flex flex-col gap-3 mt-6 sm:flex-row sm:gap-2">
            {submitButton && (
              <AppButton
                type="submit"
                disabled={isSubmitting}
                className={`${buttonClassName} ${
                  isSubmitting
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:bg-main-color/90"
                }`}
              >
                <span>{buttonText}</span>

                {isSubmitting ? (
                  <ImSpinner className="animate-spin" />
                ) : (
                  <FaArrowRight />
                )}
              </AppButton>
            )}

            {resetButton && (
              <AppButton
                type="button"
                onClick={() => reset()}
                className="w-full bg-muted text-foreground px-6 py-6 rounded-xl hover:bg-gray-300 transition"
              >
                Reset
              </AppButton>
            )}
          </div>
        )}
      </form>
    );
  },
);

AppForm.displayName = "AppForm";
export default AppForm;
