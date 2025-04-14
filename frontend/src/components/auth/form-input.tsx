import type React from "react";

interface FormInputProps {
  id: string;
  name: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  icon: React.ReactNode;
  error?: string;
  required?: boolean;
}

export default function FormInput({
  id,
  name,
  label,
  type,
  value,
  onChange,
  placeholder,
  icon,
  error,
  required = false,
}: FormInputProps) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-700 block">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className={`block w-full pl-10 pr-3 py-2 border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500`}
          placeholder={placeholder}
          required={required}
        />
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}
