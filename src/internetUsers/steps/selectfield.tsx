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
    <div className="mb-5">
      <label htmlFor={name} className="block mb-2 text-sm font-semibold text-slate-700 tracking-wide">
        {label}
      </label>
      <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-slate-500/30 focus-within:border-slate-300 transition-all duration-200">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-600">
          {icon}
        </div>
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full bg-transparent text-slate-900 text-sm focus:outline-none h-10"
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