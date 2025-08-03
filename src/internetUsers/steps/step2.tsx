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
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  directorateOptions: any[];
  deputyMinistryOptions: any[];
  employmentTypeOptions: string[];
}): JSX.Element {

const automated_deputy = mapsid[directorateOptions.find((d) => d.id === parseInt(form.directorate))?.directorate_id ?? 0] || ""

  return (
    <div>
      <InputField label="Position" icon={<Briefcase className="w-5 h-5 text-gray-500" />} 
        name="position" type="text" placeholder="Position" value={form.position} onChange={onChange} />
      
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
          onChange={(e) => {
            // Call special handler to update deputy ministry as well
            onChange(e); // update directorate id
          }}
          options={directorateOptions.map((d) => ({ value: d.id.toString(), label: d.name }))}
        />

        <InputField
          label="Deputy Ministry"
          icon={<Building className="w-5 h-5 text-gray-500" />}
          name="deputyMinistry"
          value={automated_deputy}
          onChange={onChange}
          type="text"
          placeholder="Deputy Ministry"
          disabled
        />

    </div>
  );
}