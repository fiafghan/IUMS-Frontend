import { Cpu, Group, Hash, Laptop } from "lucide-react";
import type { FormState } from "../../types/types";
import { InputField } from "./InputField";
import { useEffect, useState, type JSX } from "react";
import { DeviceType, getDeviceTypeLabel } from "../../enums/device_type_enum";
import axios from "axios";
import { route } from "../../config";
import { ApiDropdown } from "../../components/ApiDropDown";

// Map device types to options format
const deviceTypeOptions = [
  { id: DeviceType.MOBILE, name: getDeviceTypeLabel(DeviceType.MOBILE) },
  { id: DeviceType.COMPUTER, name: getDeviceTypeLabel(DeviceType.COMPUTER) },
  { id: DeviceType.TABLET, name: getDeviceTypeLabel(DeviceType.TABLET) }
];




export function Step3({ form, onChange }: {
  form: FormState;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | { target: { name: string; value: string } }) => void;
}): JSX.Element {

  const [macError, setMacError] = useState<string | null>(null);

  const checkMacAddress = (mac: string) => {
    if (!mac) {
      setMacError(null);
      return;
    }
    axios.post(`${route}/check-mac-address`, { mac_address: mac })
      .then(res => {
        if (res.data.exists) {
          setMacError(res.data.message);
        } else {
          setMacError(null);
        }
      })
      .catch(() => {
        setMacError(null);
      });
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      checkMacAddress(form.mac_address);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [form.mac_address]);
  return (
    <div className="grid grid-cols-3 gap-5">
      <InputField
        label="Device Limit"
        icon={<Hash className="w-5 h-5 text-blue-400" />}
        name="device_limit"
        type="number"
        placeholder="Number of devices allowed"
        value={form.device_limit}
        onChange={onChange}
      />

      <ApiDropdown
        apiUrl={`${route}/groups`} // your actual API endpoint to fetch device types
        label="Group Type"
        name="group_id"
        value={form.group_id}
        onChange={onChange}
        icon={<Group className="w-5 h-5 text-blue-400" />}
        placeholder="Select Group Type"
        className="mb-4"
      // valueField and labelField default to "id" and "name", so no need to specify here if your API matches
      />

      <div>
        <label className="block text-sm font-medium text-gray-700">Device Type</label>
        <div className="relative w-full">
          <Laptop className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none" size={20} />
          <select
            name="device_type"
            value={form.device_type}
            onChange={onChange}
            className="block w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-300 rounded-xl focus-within:ring-2 
            focus-within:ring-blue-400 focus-within:ring-offset-1 transition"
          >
            <option value="">Select Device Type</option>
            {deviceTypeOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <InputField
        label="MAC Address"
        icon={<Cpu className="w-5 h-5 text-blue-400" />}
        name="mac_address"
        type="text"
        placeholder="00:00:00:00:00:00"
        value={form.mac_address}
        onChange={(e) => {
          let mac = e.target.value
            .toUpperCase()
            .replace(/[^0-9A-F]/g, "")     // only from 0 to 9 and A to F
            .match(/.{1,2}/g)?.join(":") || ""; // after each two characters put : 

          if (mac.length > 17) mac = mac.slice(0, 17); // طول بیش از حد نرود

          onChange({ target: { name: "mac_address", value: mac } });
        }}
      />

      {macError && <p className="text-red-600 text-sm mt-1">{macError}</p>}
    </div>
  );
}