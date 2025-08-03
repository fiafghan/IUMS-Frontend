import type { JSX } from "react";
import type { InputProps } from "../../types/types";

export function InputField({
  label,
  icon,
  name,
  type,
  placeholder,
  value,
  onChange,
  disabled = false,
}: InputProps): JSX.Element {
  return (
    <div className="mb-6">
      <label htmlFor={name} className="block mb-1 text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="flex items-center gap-2 bg-gray-100 border border-gray-300 rounded-xl px-4
       py-2 focus-within:ring-2 focus-within:ring-blue-400 focus-within:ring-offset-1 transition">
        {icon}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          className="w-full bg-transparent text-gray-800 text-sm placeholder-gray-400 focus:outline-none"
          autoComplete="off"
          disabled={disabled}
        />
      </div>
    </div>
  );
}