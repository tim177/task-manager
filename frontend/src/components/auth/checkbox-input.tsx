import React from "react";
import FormError from "./form-error";

interface CheckBoxInputProps {
  id: string;
  name: string;
  label: React.ReactNode;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  touched?: boolean;
  required?: boolean;
}

export default function CheckBoxInput({
  id,
  name,
  label,
  checked,
  onChange,
  onBlur,
  error,
  touched = false,
  required = false,
}: CheckBoxInputProps) {
  const hasError = error && touched;

  return (
    <div className="space-y-1">
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id={id}
            type="checkbox"
            name={name}
            checked={checked}
            onChange={onChange}
            onBlur={onBlur}
            className={`h-4 w-4 ${
              hasError
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-gray-500 focus:border-teal-500 focus:ring-teal-500"
            } rounded`}
            required={required}
            aria-invalid={hasError ? "true" : "false"}
          />
        </div>
        <div className="ml-2 text-sm">
          <label htmlFor={id} className="text-gray-700">
            {label}
          </label>
        </div>
      </div>
      <FormError error={error} visible={touched} />
    </div>
  );
}
