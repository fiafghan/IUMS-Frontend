import type { JSX } from "react";
import type { SelectProps } from "../../types/types";

export function SelectField({
  label,
  icon,
  name,
  value,
  options,
  onChange,
}: SelectProps): JSX.Element {
  return (
    <div className="mb-6">
      <label htmlFor={name} className="block mb-1 text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="flex items-center gap-2 bg-gray-100 border border-gray-300 rounded-xl 
      px-4 py-2 focus-within:ring-2 focus-within:ring-blue-400 focus-within:ring-offset-1 transition">
        {icon}
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full bg-transparent text-gray-800 text-sm focus:outline-none"
        >
          <option value="">Select {label}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}