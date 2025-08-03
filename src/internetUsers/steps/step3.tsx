import { Cpu, Hash, Laptop } from "lucide-react";
import type { FormState } from "../../types/types";
import { InputField } from "./InputField";
import type { JSX } from "react";
import { ApiDropdown } from "../../components/ApiDropDown";
import { DeviceType, getDeviceTypeLabel } from "../../enums/device_type_enum";
import { route } from "../../config";

// Map device types to options format
const deviceTypeOptions = [
  { id: DeviceType.MOBILE, name: getDeviceTypeLabel(DeviceType.MOBILE) },
  { id: DeviceType.COMPUTER, name: getDeviceTypeLabel(DeviceType.COMPUTER) },
  { id: DeviceType.TABLET, name: getDeviceTypeLabel(DeviceType.TABLET) }
];

export function Step3({ form, onChange }: { 
  form: FormState; 
  onChange: (e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: string } }) => void 
}): JSX.Element {
  return (
    <div>
      <InputField label="Device Limit" icon={<Hash className="w-5 h-5 text-gray-500" />} 
      name="device_limit" type="number" placeholder="Number of devices allowed" value={form.device_limit} onChange={onChange} />
      <ApiDropdown apiUrl={`${route}/device-types`} label="Device Type" name="device_type" value={form.device_type} onChange={onChange} icon={<Laptop className="w-5 h-5 text-gray-500" />} />
      <InputField label="MAC Address" icon={<Cpu className="w-5 h-5 text-gray-500" />} 
      name="mac_address" type="text" placeholder="00:00:00:00:00:00" value={form.mac_address} onChange={onChange} />
    </div>
  );
}