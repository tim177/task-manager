"use client";

import type React from "react";
import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import FormError from "./form-error";

interface PasswordInputProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  touched?: boolean;
  required?: boolean;
}

export default function PasswordInput({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  error,
  touched = false,
  required = false,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const hasError = error && touched;

  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-700 block">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Lock className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type={showPassword ? "text" : "password"}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`block w-full pl-10 pr-10 py-2 border ${
            hasError
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300 focus:ring-teal-500 focus:border-teal-500"
          } rounded-lg text-sm`}
          placeholder="••••••••"
          required={required}
          aria-invalid={hasError ? "true" : "false"}
          aria-describedby={hasError ? `${id}-error` : undefined}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5 text-gray-400" />
          ) : (
            <Eye className="h-5 w-5 text-gray-400" />
          )}
        </button>
      </div>
      <FormError error={error} visible={touched} />
    </div>
  );
}
