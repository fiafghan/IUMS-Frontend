import { Cpu, Hash, Laptop } from "lucide-react";
import type { FormState } from "../../types/types";
import { InputField } from "./InputField";
import type { JSX } from "react";

export function Step3({ form, onChange }: { form: FormState; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }): JSX.Element {
  return (
    <div>
      <InputField label="Device Limit" icon={<Hash className="w-5 h-5 text-gray-500" />} 
      name="device_limit" type="number" placeholder="Number of devices allowed" value={form.device_limit} onChange={onChange} />
      <InputField label="Device Type" icon={<Laptop className="w-5 h-5 text-gray-500" />} 
      name="device_type" type="text" placeholder="Type of device" value={form.device_type} onChange={onChange} />
      <InputField label="MAC Address" icon={<Cpu className="w-5 h-5 text-gray-500" />} 
      name="mac_address" type="text" placeholder="00:00:00:00:00:00" value={form.mac_address} onChange={onChange} />
    </div>
  );
}