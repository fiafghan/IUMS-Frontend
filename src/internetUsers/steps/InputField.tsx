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
    <div className="mb-5">
      <label htmlFor={name} className="block mb-2 text-sm font-semibold text-slate-700 tracking-wide">
        {label}
      </label>
      <div
        className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm
        focus-within:ring-2 focus-within:ring-slate-500/30 focus-within:border-slate-300 transition-all duration-200"
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-600">
          {icon}
        </div>
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          className="w-full bg-transparent text-slate-900 text-sm h-10 placeholder-slate-400 focus:outline-none"
          autoComplete="off"
          disabled={disabled}
        />
      </div>
    </div>
  );
}