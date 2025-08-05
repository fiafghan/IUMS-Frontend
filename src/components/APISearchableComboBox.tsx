import React, { useState, useEffect } from "react";

interface SearchableComboBoxProps {
  apiUrl: string;
  onChange: (selected: { value: string | number; label: string }) => void;
  placeholder?: string;
  valueField?: string; // defaults to "id"
  labelField?: string; // defaults to "name"
}

const APISearchableComboBox: React.FC<SearchableComboBoxProps> = ({
  apiUrl,
  onChange,
  placeholder = "Select...",
  valueField = "id",
  labelField = "name",
}) => {
  const [options, setOptions] = useState<Array<any>>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        setOptions(Array.isArray(data) ? data : []);
      } catch {
        setOptions([]);
      }
      setLoading(false);
    };
    fetchOptions();
  }, [apiUrl]);

  const filteredOptions = options.filter((item) =>
    item[labelField]?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (item: any) => {
    setSelected(item);
    setShowDropdown(false);
    onChange({ value: item[valueField], label: item[labelField] });
  };

  return (
    <div style={{ position: "relative", marginBottom: 16 }}>
      <input
        type="text"
        value={selected ? selected[labelField] : search}
        onChange={(e) => {
          setSearch(e.target.value);
          setSelected(null);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
        placeholder={placeholder}
        style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
        autoComplete="off"
      />
      {showDropdown && (
        <div
          style={{
            position: "absolute",
            zIndex: 1000,
            width: "100%",
            background: "#fff",
            border: "1px solid #ccc",
            borderTop: "none",
            maxHeight: 200,
            overflowY: "auto",
          }}
        >
          {loading ? (
            <div style={{ padding: 8 }}>Loading...</div>
          ) : filteredOptions.length === 0 ? (
            <div style={{ padding: 8 }}>No results</div>
          ) : (
            filteredOptions.map((item) => (
              <div
                key={item[valueField]}
                style={{
                  padding: 8,
                  cursor: "pointer",
                  background: selected && selected[valueField] === item[valueField] ? "#f0f0f0" : "#fff",
                }}
                onMouseDown={() => handleSelect(item)}
              >
                {item[labelField]}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default APISearchableComboBox;