import React, { useEffect, useState } from "react";
import axios from "axios";

interface DropdownProps {
  url: string;
  valueField?: string;     // default: 'id'
  labelField?: string;     // default: 'name'
  onChange: (value: string | number) => void;
  placeholder?: string;
  defaultValue?: string | number;
  label?: string;          // ✅ Add this
}


interface OptionType {
  [key: string]: any;
}

const Dropdown: React.FC<DropdownProps> = ({
  url,
  valueField = "id",
  labelField = "name",
  onChange,
  placeholder = "Select an option",
  defaultValue,
  label, // ✅ Add this
}) => {
  const [options, setOptions] = useState<OptionType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get(url)
      .then(res => {
        const data = res.data;
        if (Array.isArray(data)) {
          setOptions(data);
        } else {
          console.error("Expected an array but got:", data);
          setOptions([]);
        }
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to load options");
        setLoading(false);
      });
  }, [url]);

  if (loading) return <p className="text-blue-500">Loading options...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

return (
  <div className="w-full">
    {label && (
      <label className="block mb-1 text-sm font-medium text-gray-700">
        {label}
      </label>
    )}
    <select
      className="flex items-center gap-2 bg-gray-100 border border-gray-300 rounded-xl 
                      px-4 py-2 focus-within:ring-2 focus-within:ring-blue-400 
                      focus-within:ring-offset-1 transition w-full mb-3"
      defaultValue={defaultValue || ""}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="" disabled>{placeholder}</option>
      {Array.isArray(options) && options.map((item) => (
        <option key={item[valueField]} value={item[valueField]}>
          {item[labelField]}
        </option>
      ))}
    </select>
  </div>
);
}


export default Dropdown;
