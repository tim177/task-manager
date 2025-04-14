import type React from "react";
import FormError from "./form-error";

interface AuthInputProps {
  id: string;
  name: string;
  label: string;
  type: string;
  placeholder: string;
  icon: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  touched?: boolean;
  required?: boolean;
}

export default function AuthInput({
  id,
  name,
  label,
  type,
  placeholder,
  icon,
  value,
  onChange,
  onBlur,
  error,
  touched = false,
  required = false,
}: AuthInputProps) {
  const hasError = error && touched;

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700 block" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
          {icon}
        </div>
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          placeholder={placeholder}
          required={required}
          onBlur={onBlur}
          onChange={onChange}
          className={`bloack w-full pl-10 pr-3 py-2 border ${
            hasError
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : "border-gray-500 focus:ring-teal-500 focus:border-teal-500"
          } rounded-lg text-sm`}
          aria-invalid={hasError ? "true" : "false"}
        />
      </div>
      <FormError error={error} visible={touched} />
    </div>
  );
}
