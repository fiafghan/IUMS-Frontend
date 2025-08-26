
import type { JSX } from "react";
import type { FormState } from "../../types/types";
import { Briefcase, User, Building2, Building } from "lucide-react";
import { InputField } from "./InputField";
import { SelectField } from "./selectfield";
import { mapsid } from "../../enums/deputy_enum";


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
  employmentTypeOptions: { id: string, name: string }[];
}): JSX.Element {

  // This handles directorate selection and sets deputy ministry accordingly
  function handleDirectorateChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selectedDirectorateId = e.target.value;
    
    // 1. Update the directorate in the form state
    onChange({ target: { name: "directorate", value: selectedDirectorateId } });
    
    // 2. Find the directorate object from directorateOptions using selectedDirectorateId
    const selectedDirectorate = directorateOptions.find(
      (d) => d.id === Number(selectedDirectorateId)
    );
    
    // 3. If found, get its deputy ministry ID and update form.deputyMinistry
    if (selectedDirectorate) {
      // directorate_id corresponds to deputy ministry ID from your seeder
      const deputyMinistryId = selectedDirectorate.directorate_id;
      
      if (deputyMinistryId !== undefined && deputyMinistryId !== null) {
        onChange({ target: { name: "deputyMinistry", value: deputyMinistryId.toString() } });
      } else {
        // Clear deputy ministry if none found
        onChange({ target: { name: "deputyMinistry", value: "" } });
      }
    } else {
      // If no directorate selected, clear deputy ministry
      onChange({ target: { name: "deputyMinistry", value: "" } });
    }
  }
  

  const deputyMinistryValue = mapsid[parseInt(form.deputyMinistry)] ?? "";


  return (
    <div className="grid grid-cols-3 gap-5">
      <InputField
        label="Position"
        icon={<Briefcase className="w-5 h-5  text-white bg-gradient-to-br 
          scale-150 from-pink-500 to-blue-600 rounded-sm p-1" />}
        name="position"
        type="text"
        placeholder="Position"
        value={form.position}
        onChange={onChange}
      />

      <SelectField
        label="Employment Type"
        icon={<User className="w-5 h-5  text-white bg-gradient-to-br 
          scale-150 from-blue-500 to-pink-600 rounded-sm p-1" />}
        name="employment_type"
        value={form.employment_type}
        onChange={onChange}
        options={employmentTypeOptions.map((et) => ({ value: et.id, label: et.name }))} />

      <SelectField
        label="Directorate"
        icon={<Building2 className="w-5 h-5  text-white bg-gradient-to-br 
          scale-150 from-blue-500 to-blue-600 rounded-sm p-1" />}
        name="directorate"
        value={form.directorate}
        onChange={handleDirectorateChange}
        options={[
          { value: "", label: "Select Directorate" },
          ...directorateOptions.map((d) => ({
            value: d.id,
            label: d.name,
            key: d.name,
          })),
        ]}
      />

      <InputField
        label="Deputy Ministry"
        icon={<Building className="w-5 h-5  text-white bg-gradient-to-br
          scale-150 from-green-500 to-blue-600 rounded-sm p-1" />}
        name="deputyMinistry"
        value={deputyMinistryValue}
        type="text"
        placeholder="Deputy Ministry"
        disabled={true}
        onChange={() => { }}
      />
    </div>
  );
}