import type { JSX } from "react";
import type { FormState } from "../../types/types";
import { Briefcase, User, Building2, Building } from "lucide-react";
import { InputField } from "./InputField";
import { SelectField } from "./selectfield";
import { mapsid } from "../../deputy_enum";

export function Step2({
  form,
  onChange,
  directorateOptions,
  employmentTypeOptions,
}: {
  form: FormState;
  onChange: (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | { target: { name: string; value: string } }
  ) => void;
  directorateOptions: any[];
  employmentTypeOptions: string[];
}): JSX.Element {
  
  // This handles directorate selection and sets deputy ministry accordingly
    function handleDirectorateChange(e: React.ChangeEvent<HTMLSelectElement>) {
      const value = e.target.value;
      onChange({ target: { name: "directorate", value } });

      const selectedId = parseInt(value);
      if (!isNaN(selectedId)) {
        const deputyValue = mapsid[selectedId] ?? "";
        onChange({ target: { name: "deputyMinistry", value: deputyValue } });
      } else {
        onChange({ target: { name: "deputyMinistry", value: "" } });
      }
    }

  console.log("Current form.directorate:", form.directorate);
  const matchedDirectorate = directorateOptions.find((d) => d.directorate_id === Number(form.directorate));
  console.log("Matched directorate object:", matchedDirectorate);

  // Derive deputy ministry value with fallback
  const deputyMinistryValue = matchedDirectorate ? mapsid[matchedDirectorate.directorate_id] ?? "" : "";
  console.log("Derived Deputy Ministry value:", deputyMinistryValue);

  return (
    <div>
      <InputField
        label="Position"
        icon={<Briefcase className="w-5 h-5 text-gray-500" />}
        name="position"
        type="text"
        placeholder="Position"
        value={form.position}
        onChange={onChange}
      />

      <SelectField
        label="Employment Type"
        icon={<User className="w-5 h-5 text-gray-500" />}
        name="employment_type"
        value={form.employment_type}
        onChange={onChange}
        options={employmentTypeOptions.map((et) => ({ value: et, label: et }))}
      />

      <SelectField
        label="Directorate"
        icon={<Building2 className="w-5 h-5 text-gray-500" />}
        name="directorate"
        value={form.directorate}
        onChange={handleDirectorateChange}
        options={[
          { value: "", label: "Select Directorate" },
          ...directorateOptions.map((d) => ({
            value: d.directorate_id,
            label: d.name,
            key: d.directorate_id,
          })),
        ]}
      />

      <InputField
        label="Deputy Ministry"
        icon={<Building className="w-5 h-5 text-gray-500" />}
        name="deputyMinistry"
        value={deputyMinistryValue}
        type="text"
        placeholder="Deputy Ministry"
        disabled={true}
        onChange={() => {}}
      />
    </div>
  );
}
