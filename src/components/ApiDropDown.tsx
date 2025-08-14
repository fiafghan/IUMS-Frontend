import { useEffect, useState } from "react";

interface ApiDropdownProps {
  apiUrl: string;
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  icon: React.ReactNode;
  placeholder?: string;
  className?: string;
  valueField?: string;
  labelField?: string;
  filterOptions?: (options: Array<Record<string, any>>) => Array<{ value: string | number; label: string }>;
}

export function ApiDropdown({
  apiUrl,
  label,
  name,
  value,
  onChange,
  icon,
  placeholder = "Select an option",
  className = "",
  valueField = "id",
  labelField = "name",
  filterOptions,
}: ApiDropdownProps) {
  const [options, setOptions] = useState<Array<Record<string, any>>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { token } = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
    const fetchOptions = async () => {
      try {
        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch options: ${response.statusText}`);
        }
        const data = await response.json();
        setOptions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching dropdown options:", err);
        setError("Failed to load options");
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [apiUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Create a synthetic event that matches the expected type
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        name,
        value: e.target.value,
      },
    } as React.ChangeEvent<HTMLSelectElement>;

    onChange(syntheticEvent);
  };

  // Use filterOptions if provided, otherwise use raw options
  const displayOptions = filterOptions ? filterOptions(options) : options.map(option => ({
    value: option[valueField],
    label: option[labelField]
  }));

  return (
    <div className={`mb-6 ${className}`}>
      <label className="block mb-1 text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="flex items-center gap-2 bg-gray-100 border border-gray-300 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-blue-400 focus-within:ring-offset-1 transition">
        {icon}
        <select
          name={name}
          value={value}
          onChange={handleChange}
          disabled={loading || !!error}
          className="w-full bg-transparent text-gray-800 text-sm focus:outline-none"
        >
          <option value="">{loading ? "Loading..." : placeholder}</option>
          {displayOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}