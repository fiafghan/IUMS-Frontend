import { Cpu, Hash } from "lucide-react";
import type { FormState } from "../../types/types";
import { InputField } from "./InputField";
import { useEffect, useState, type JSX } from "react";
import { DeviceType, getDeviceTypeLabel } from "../../enums/device_type_enum";
import axios from "axios";
import { route } from "../../config";

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
    <div>
      <InputField
        label="Device Limit"
        icon={<Hash className="w-5 h-5 text-gray-500" />}
        name="device_limit"
        type="number"
        placeholder="Number of devices allowed"
        value={form.device_limit}
        onChange={onChange}
      />
      <div>
        <label className="block text-sm font-medium text-gray-700">Device Type</label>
        <select
          name="device_type"
          value={form.device_type}
          onChange={onChange}
          className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select Device Type</option>
          {deviceTypeOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      </div>
      <InputField
        label="MAC Address"
        icon={<Cpu className="w-5 h-5 text-gray-500" />}
        name="mac_address"
        type="text"
        placeholder="00:00:00:00:00:00"
        value={form.mac_address}
        onChange={onChange}
      />
      {macError && <p className="text-red-600 text-sm mt-1">{macError}</p>}
    </div>
  );
}