import { Cpu, Group, Hash, Laptop, Plus, X, Monitor, Smartphone, Tablet } from "lucide-react";
import type { FormState } from "../../types/types";
import { InputField } from "./InputField";
import { useEffect, useState, type JSX } from "react";
import axios from "axios";
import { route } from "../../config";

export type SelectedDevice = {
  id: string;
  deviceTypeId: number;
  deviceTypeName: string;
  groupId: number;
  groupName: string;
  macAddress: string;
};

export function Step3({ form, onChange }: {
  form: FormState;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> |
  { target: { name: string; value: string | SelectedDevice[] } }) => void;
}): JSX.Element {


  const [macError, setMacError] = useState<string | null>(null);
  const [deviceTypes, setDeviceTypes] = useState<{ id: number; name: string }[]>([]);
  const [groups, setGroups] = useState<{ id: number; name: string }[]>([]);
  const [selectedDevices, setSelectedDevices] = useState<SelectedDevice[]>(form.selectedDevices || []);
  const [remainingLimit, setRemainingLimit] = useState(Number(form.device_limit) || 0);

  const checkMacAddress = (mac: string) => {
    if (!mac) {
      setMacError(null);
      return;
    }
    const { token } = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
    axios.post(`${route}/check-mac-address`, { mac_address: mac }, {
      headers: { Authorization: `Bearer ${token}` }
    })
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
    const fetchData = async () => {
      try {
        const { token } = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
        const [deviceRes, groupRes] = await Promise.all([
          axios.get(`${route}/device-types`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${route}/groups`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        setDeviceTypes(deviceRes.data);
        setGroups(groupRes.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      checkMacAddress(form.mac_address);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [form.mac_address]);

  // Update remaining limit when device limit changes
  useEffect(() => {
    const limit = Number(form.device_limit) || 0;
    setRemainingLimit(limit - selectedDevices.length);
  }, [form.device_limit, selectedDevices.length]);

  // Instead, update the form when devices change, but only when needed
  const updateSelectedDevices = (newDevices: SelectedDevice[]) => {
    setSelectedDevices(newDevices);
    // Update the form only when devices actually change
    onChange({
      target: {
        name: 'selectedDevices',
        value: newDevices
      }
    });
  };

  // Update the addDevice function
  const addDevice = () => {
    if (selectedDevices.length >= form.device_limit) return;

    const newDevice: SelectedDevice = {
      id: Date.now().toString(),
      deviceTypeId: 0,
      deviceTypeName: "",
      groupId: 0,
      groupName: "",
      macAddress: ""
    };

    const newDevices = [...selectedDevices, newDevice];
    setSelectedDevices(newDevices);
    onChange({ target: { name: "selectedDevices", value: newDevices } });
  };



  // Update the removeDevice function
  const removeDevice = (deviceId: string) => {
    updateSelectedDevices(selectedDevices.filter(device => device.id !== deviceId));
  };

  // Update the updateDevice function
  const updateDevice = (deviceId: string, field: keyof SelectedDevice, value: any) => {
    const updatedDevices = selectedDevices.map(device => {
      if (device.id === deviceId) {
        if (field === 'deviceTypeId') {
          const deviceType = deviceTypes.find(dt => dt.id === value);
          return { ...device, deviceTypeId: value, deviceTypeName: deviceType?.name || "" };
        }
        if (field === 'groupId') {
          const group = groups.find(g => g.id === value);
          return { ...device, groupId: value, groupName: group?.name || "" };
        }
        return { ...device, [field]: value };
      }
      return device;
    });

    updateSelectedDevices(updatedDevices);
    onChange({ target: { name: 'selectedDevices', value: updatedDevices } });
  };

  const getDeviceIcon = (deviceTypeName: string) => {
    switch (deviceTypeName.toLowerCase()) {
      case 'mobile':
      case 'smartphone':
        return <Smartphone className="w-4 h-4" />;
      case 'computer':
      case 'laptop':
      case 'desktop':
        return <Laptop className="w-4 h-4" />;
      case 'tablet':
        return <Tablet className="w-4 h-4" />;
      case 'all in one':
        return <Monitor className="w-4 h-4" />;
      default:
        return <Laptop className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Device Limit and Summary */}
      <div className="grid grid-cols-2 gap-5">
        <InputField
          label="Device Limit"
          icon={<Hash className="w-5 h-5 text-white bg-blue-400 rounded-md p-1" />}
          name="device_limit"
          type="number"
          placeholder="Number of devices allowed"
          value={form.device_limit}
          onChange={onChange}
        />

        <div className="flex items-center justify-center bg-gray-50 rounded-lg p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{remainingLimit}</div>
            <div className="text-sm text-gray-600">Devices Remaining</div>
          </div>
        </div>
      </div>

      {/* Add Device Button */}
      <div className="flex justify-center">
        <button
          onClick={addDevice}
          disabled={remainingLimit <= 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium ${remainingLimit > 0
            ? 'bg-blue-600 hover:bg-blue-700'
            : 'bg-gray-400 cursor-not-allowed'
            }`}
        >
          <Plus className="w-4 h-4" />
          Add Device ({remainingLimit} remaining)
        </button>
      </div>

      {/* Selected Devices */}
      <div className="space-y-4">
        {selectedDevices.map((device, index) => (
          <div key={device.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Device {index + 1}</h3>
              <button
                onClick={() => removeDevice(device.id)}
                className="text-red-600 hover:text-red-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Device Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Device Type
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    {getDeviceIcon(device.deviceTypeName)}
                  </div>
                  <select
                    value={device.deviceTypeId || ""}
                    onChange={(e) => updateDevice(device.id, 'deviceTypeId', Number(e.target.value))}
                    className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">Select Device Type</option>
                    {deviceTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Group Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Group Type
                </label>
                <div className="relative">
                  <Group className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={device.groupId || ""}
                    onChange={(e) => updateDevice(device.id, 'groupId', Number(e.target.value))}
                    className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">Select Group Type</option>
                    {groups.map((group) => (
                      <option key={group.id} value={group.id}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* MAC Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  MAC Address
                </label>
                <div className="relative">
                  <Cpu className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={device.macAddress}
                    onChange={(e) => {
                      let mac = e.target.value
                        .toUpperCase()
                        .replace(/[^0-9A-F]/g, "")
                        .match(/.{1,2}/g)?.join(":") || "";

                      if (mac.length > 17) mac = mac.slice(0, 17);
                      updateDevice(device.id, 'macAddress', mac);
                    }}
                    placeholder="00:00:00:00:00:00"
                    className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      {selectedDevices.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">Device Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {deviceTypes.map(type => {
              const count = selectedDevices.filter(d => d.deviceTypeId === type.id).length;
              if (count === 0) return null;
              return (
                <div key={type.id} className="flex items-center gap-2">
                  {getDeviceIcon(type.name)}
                  <span className="text-blue-700">{type.name}: {count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {macError && <p className="text-red-600 text-sm mt-1">{macError}</p>}
    </div>
  );
}