import { useState, useEffect } from "react";
import axios from "axios";
import { Combobox } from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";
import type { InternetUser, ViolationType } from "../types/types";
import { route } from "../config";

type Option = { id: number; name: string };

type Props = {
  user: InternetUser;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedUser: Partial<InternetUser>) => void;
  violationTypes: ViolationType[];
  deputyMinistryOptions: Option[];
};

export default function EditUserModal({
  user,
  isOpen,
  onClose,
  onSave,
  violationTypes,
}: Props) {
  const [editForm, setEditForm] = useState<Partial<InternetUser>>({});
  const token = JSON.parse(localStorage.getItem("loggedInUser") || "{}")?.token;

  // All dropdown lists
  const [directorateList, setDirectorateList] = useState<Option[]>([]);
  const [groupsList, setGroupsList] = useState<Option[]>([]);
  const [employmentList, setEmploymentList] = useState<Option[]>([]);
  const [deviceList, setDeviceList] = useState<Option[]>([]);

  // Selected options
  const [selectedDirectorate, setSelectedDirectorate] = useState<Option | null>(
    null
  );
  const [selectedGroup, setSelectedGroup] = useState<Option | null>(null);
  const [selectedEmployment, setSelectedEmployment] = useState<Option | null>(
    null
  );
  const [selectedDevice, setSelectedDevice] = useState<Option | null>(null);

  // Query states for search
  const [dirQuery, setDirQuery] = useState("");
  const [groupQuery, setGroupQuery] = useState("");
  const [empQuery, setEmpQuery] = useState("");
  const [devQuery, setDevQuery] = useState("");

  // Load user into form
  useEffect(() => {
    if (user) {
      setEditForm({
        ...user,
        directorate_id: Number(user.directorate_id),
        group_id: Number(user.group_id),
        employee_type_id: Number(user.employee_type_id),
        device_type_id: Number(user.device_type_id),
        violation_type_id: Number(user.violation_type_id),
        violations_count: Number(user.violations_count),
        device_limit: Number(user.device_limit),
      });
    }
  }, [user]);

  // Fetch dropdown data
  useEffect(() => {
    async function fetchDropdownData() {
      try {
        const token = JSON.parse(localStorage.getItem("loggedInUser") || "{}")
          ?.token;

        const [dirsRes, groupsRes, empRes, devRes] = await Promise.all([
          axios.get(`${route}/directorate`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${route}/groups`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${route}/employment-type`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${route}/device-types`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setDirectorateList(dirsRes.data);
        setGroupsList(groupsRes.data);
        setEmploymentList(empRes.data);
        setDeviceList(devRes.data);
      } catch (err) {
        console.error("Error fetching dropdown data:", err);
      }
    }

    fetchDropdownData();
  }, []);

  // Sync selected options with user
  useEffect(() => {
    if (!user) return;

    if (directorateList.length > 0) {
      const found = directorateList.find(
        (d) => d.id === Number(user.directorate_id)
      );
      setSelectedDirectorate(found || null);
    }

    if (groupsList.length > 0) {
      const found = groupsList.find((g) => g.id === Number(user.group_id));
      setSelectedGroup(found || null);
    }

    if (employmentList.length > 0) {
      const found = employmentList.find(
        (e) => e.id === Number(user.employee_type_id)
      );
      setSelectedEmployment(found || null);
    }

    if (deviceList.length > 0) {
      const found = deviceList.find(
        (d) => d.id === Number(user.device_type_id)
      );
      setSelectedDevice(found || null);
    }
  }, [user, directorateList, groupsList, employmentList, deviceList]);

  // Input handler
  const handleEditChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Save
  const handleSave = async () => {
    if (!user) return;

    const payload = {
      ...editForm,
      directorate_id: Number(editForm.directorate_id),
      group_id: Number(editForm.group_id),
      employee_type_id: Number(editForm.employee_type_id),
      device_type_id: Number(editForm.device_type_id),
      violation_type_id: Number(editForm.violation_type_id),
      violations_count: Number(editForm.violations_count),
      device_limit: Number(editForm.device_limit),
    };

    try {
      await axios.put(`${route}/internet/${user.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onSave(payload);
      onClose();
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update user. Check console for details.");
    }
  };

  if (!isOpen) return null;

  // Filtering for search
  const filteredDirectorates =
    dirQuery === ""
      ? directorateList
      : directorateList.filter((d) =>
          d.name.toLowerCase().includes(dirQuery.toLowerCase())
        );

  const filteredGroups =
    groupQuery === ""
      ? groupsList
      : groupsList.filter((g) =>
          g.name.toLowerCase().includes(groupQuery.toLowerCase())
        );

  const filteredEmployment =
    empQuery === ""
      ? employmentList
      : employmentList.filter((e) =>
          e.name.toLowerCase().includes(empQuery.toLowerCase())
        );

  const filteredDevices =
    devQuery === ""
      ? deviceList
      : deviceList.filter((d) =>
          d.name.toLowerCase().includes(devQuery.toLowerCase())
        );

  // Helper: reusable combobox
  const ComboBoxField = ({
    label,
    selected,
    setSelected,
    setQuery,
    filtered,
    name,
  }: {
    label: string;
    selected: Option | null;
    setSelected: (opt: Option | null) => void;
    setQuery: (q: string) => void;
    filtered: Option[];
    name: string;
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <Combobox
        value={selected}
        onChange={(opt: Option | null) => {
          setSelected(opt);
          setEditForm((prev) => ({
            ...prev,
            [name]: opt ? Number(opt.id) : undefined,
          }));
        }}
      >
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-md border bg-white text-left">
            <Combobox.Input
              className="w-full border-0 px-3 py-2 focus:ring-0 text-sm"
              displayValue={(opt: Option | null) => (opt ? opt.name : "")}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${label}...`}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDown className="h-4 w-4 opacity-70" />
            </Combobox.Button>
          </div>

          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none">
            {filtered.length === 0 ? (
              <div className="cursor-default select-none px-3 py-2 text-gray-500">
                No results found
              </div>
            ) : (
              filtered.map((d) => (
                <Combobox.Option
                  key={d.id}
                  value={d}
                  className={({ active }) =>
                    `relative cursor-pointer select-none px-3 py-2 ${
                      active ? "bg-blue-100" : ""
                    }`
                  }
                >
                  {({ selected }) => (
                    <div className="flex items-center justify-between">
                      <span>{d.name}</span>
                      {selected ? <Check className="h-4 w-4" /> : null}
                    </div>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </div>
      </Combobox>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl flex flex-col lg:flex-row p-6 max-h-[90vh] overflow-auto">
        {/* Left Preview */}
        <div className="lg:w-1/2 w-full bg-gradient-to-br from-blue-100 to-blue-200 p-6 flex flex-col justify-center">
          <h2 className="text-xl font-bold text-blue-800 mb-2">Edit User</h2>
          <ul className="space-y-1 text-[12px] text-blue-900 overflow-auto pr-2 max-h-[70vh]">
            {Object.entries(user).map(([key, value]) => (
              <li key={key}>
                <strong className="capitalize">{key.replace("_", " ")}:</strong>{" "}
                {value ?? "-"}
              </li>
            ))}
          </ul>
        </div>

        {/* Right Form */}
        <div className="lg:w-1/2 w-full p-6 bg-white flex-1">
          <div className="grid grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                name="name"
                value={editForm.name || ""}
                onChange={handleEditChange}
                className="w-full border px-2 py-1 rounded-md"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                name="lastname"
                value={editForm.lastname || ""}
                onChange={handleEditChange}
                className="w-full border px-2 py-1 rounded-md"
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                name="username"
                value={editForm.username || ""}
                onChange={handleEditChange}
                className="w-full border px-2 py-1 rounded-md"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                name="phone"
                value={editForm.phone || ""}
                onChange={handleEditChange}
                className="w-full border px-2 py-1 rounded-md"
              />
            </div>

            {/* Directorate */}
            <ComboBoxField
              label="Directorate"
              selected={selectedDirectorate}
              setSelected={setSelectedDirectorate}
              setQuery={setDirQuery}
              filtered={filteredDirectorates}
              name="directorate_id"
            />

            {/* Group */}
            <ComboBoxField
              label="Group"
              selected={selectedGroup}
              setSelected={setSelectedGroup}
              setQuery={setGroupQuery}
              filtered={filteredGroups}
              name="group_id"
            />

            {/* Employment Type */}
            <ComboBoxField
              label="Employment Type"
              selected={selectedEmployment}
              setSelected={setSelectedEmployment}
              setQuery={setEmpQuery}
              filtered={filteredEmployment}
              name="employee_type_id"
            />

            {/* Device Type */}
            <ComboBoxField
              label="Device Type"
              selected={selectedDevice}
              setSelected={setSelectedDevice}
              setQuery={setDevQuery}
              filtered={filteredDevices}
              name="device_type_id"
            />

            {/* Device Limit */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Device Limit
              </label>
              <input
                type="number"
                name="device_limit"
                value={editForm.device_limit || 0}
                onChange={handleEditChange}
                className="w-full border px-2 py-1 rounded-md"
              />
            </div>

            {/* Mac Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mac Address
              </label>
              <input
                name="mac_address"
                value={editForm.mac_address || ""}
                onChange={handleEditChange}
                className="w-full border px-2 py-1 rounded-md"
              />
            </div>

            {/* Violation Type */}
            <select
              name="violation_type_id"
              value={editForm.violation_type_id || ""}
              onChange={handleEditChange}
              className="border px-2 py-1 rounded-md"
            >
              {violationTypes.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>

            {/* Violations Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Violations Count
              </label>
              <input
                type="number"
                name="violations_count"
                value={editForm.violations_count || 0}
                onChange={handleEditChange}
                className="w-full border px-2 py-1 rounded-md"
              />
            </div>

            {/* Comment */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Comment
              </label>
              <textarea
                name="comment"
                value={editForm.comment || ""}
                onChange={handleEditChange}
                className="w-full border px-2 py-1 rounded-md"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex justify-end gap-4 border-t pt-4 border-gray-200">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
