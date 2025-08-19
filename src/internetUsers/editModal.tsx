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
    deputyMinistryOptions,
}: Props) {
    const token = JSON.parse(localStorage.getItem("loggedInUser") || "{}")?.token;

    const [editForm, setEditForm] = useState<Partial<InternetUser>>({});

    // Dropdown lists
    const [directorateList, setDirectorateList] = useState<Option[]>([]);
    const [, setGroupsList] = useState<Option[]>([]);
    const [, setEmploymentList] = useState<Option[]>([]);
    const [deviceList, setDeviceList] = useState<Option[]>([]);

    // Selected options
    const [selectedDirectorate, setSelectedDirectorate] = useState<Option | null>(null);
    const [selectedGroup, setSelectedGroup] = useState<Option | null>(null);
    const [selectedEmployment, setSelectedEmployment] = useState<Option | null>(null);
    const [selectedDevice, setSelectedDevice] = useState<Option | null>(null);
    const [selectedDeputy, setSelectedDeputy] = useState<Option | null>(null);
    const [allGroupsList, setAllGroupsList] = useState<Option[]>([]);
    const [allDirectoratesList, setAllDirectoratesList] = useState<Option[]>([]);
    const [allEmploymentList, setAllEmploymentList] = useState<Option[]>([]);
    const [allDeviceList, setAllDeviceList] = useState<Option[]>([]);




    useEffect(() => {
        const fetchAllGroups = async () => {
            try {
                const res = await axios.get(`${route}/groups`, { headers: { Authorization: `Bearer ${token}` } });
                const data: any[] = res.data;
                setAllGroupsList(data.map(g => ({ id: g.id, name: g.name })));
            } catch (err) {
                console.error("Error fetching all groups:", err);
            }
        };
        fetchAllGroups();
    }, [token]);

    useEffect(() => {
        const fetchAllDirectorates = async () => {
            try {
                const res = await axios.get(`${route}/directorate`, { headers: { Authorization: `Bearer ${token}` } });
                const data: any[] = res.data;
                setAllDirectoratesList(data.map(d => ({ id: d.id, name: d.name })));
            } catch (err) {
                console.error("Error fetching all directorates:", err);
            }
        };
        fetchAllDirectorates();
    }, [token]);


    // Load user into form
    useEffect(() => {
        if (!user) return;
        setEditForm({ ...user });
    }, [user]);

    // Fetch dropdowns
    useEffect(() => {
        const fetchDropdowns = async () => {
            try {
                const res = await axios.get<InternetUser[]>(`${route}/internet`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = res.data;

                const dirs: Option[] = Array.from(
                    new Set(data.map(d => d.directorate_id))
                ).map(id => {
                    const d = data.find(x => x.directorate_id === id)!;
                    return { id, name: d.directorate };
                });
                setDirectorateList(dirs);

                const groups: Option[] = Array.from(
                    new Set(data.map(d => d.group_id))
                ).map(id => {
                    const g = data.find(x => x.group_id === id)!;
                    return { id, name: g.groups };
                });
                setGroupsList(groups);

                const emps: Option[] = Array.from(
                    new Set(data.map(d => d.employee_type_id))
                ).map(id => {
                    const e = data.find(x => x.employee_type_id === id)!;
                    return { id, name: e.employee_type };
                });
                setEmploymentList(emps);

                const devices: Option[] = Array.from(
                    new Set(data.map(d => d.device_type_id))
                ).map(id => {
                    const dev = data.find(x => x.device_type_id === id)!;
                    return { id, name: String(dev.device_type_id) };
                });
                setDeviceList(devices);

            } catch (err) {
                console.error("Error fetching dropdowns:", err);
            }
        };

        fetchDropdowns();
    }, [token]);

    // Sync selected options with user - separate useEffect for each
    useEffect(() => {
        if (user && directorateList.length > 0) {
            setSelectedDirectorate(
                allDirectoratesList.find(d => d.name.toLowerCase() === user.directorate.toLowerCase()) || null
            );
        }
    }, [user, directorateList]);

    useEffect(() => {
        const fetchAllEmploymentTypes = async () => {
            try {
                const res = await axios.get(`${route}/employment-type`, { headers: { Authorization: `Bearer ${token}` } });
                const data: any[] = res.data;
                setAllEmploymentList(data.map(e => ({ id: e.id, name: e.name })));
            } catch (err) {
                console.error("Error fetching employment types:", err);
            }
        };
        fetchAllEmploymentTypes();
    }, [token]);


    useEffect(() => {
        if (user && allGroupsList.length > 0) {
            setSelectedGroup(allGroupsList.find(g => g.name === user.groups) || null);
        }
    }, [user, allGroupsList]);

    useEffect(() => {
        if (user && allEmploymentList.length > 0) {
            const empId = Number((user as any).employee_type_id);
            let found = allEmploymentList.find(e => Number(e.id) === empId);
            if (!found && (user as any).employment_type) {
                const name = String((user as any).employment_type).toLowerCase();
                found = allEmploymentList.find(e => e.name.toLowerCase() === name);
            }
            setSelectedEmployment(found || null);
        }
    }, [user, allEmploymentList]);

    useEffect(() => {
        const fetchAllDeviceTypes = async () => {
            try {
                const res = await axios.get(`${route}/device-types`, { headers: { Authorization: `Bearer ${token}` } });
                const data: any[] = res.data;
                setAllDeviceList(data.map(d => ({ id: d.id, name: d.name })));
            } catch (err) {
                console.error("Error fetching device types:", err);
            }
        };
        fetchAllDeviceTypes();
    }, [token]);

    useEffect(() => {
        if (user && allDeviceList.length > 0) {
            const deviceId = typeof (user as any).device_type_id === "string" ? Number((user as any).device_type_id) : (user as any).device_type_id;
            let found = allDeviceList.find(d => d.id === deviceId);

            if (!found && (user as any).device_type) {
                const name = String((user as any).device_type).toLowerCase();
                found = allDeviceList.find(d => d.name.toLowerCase() === name);
            }
            setSelectedDevice(found || null);
        }
    }, [user, allDeviceList]);

    useEffect(() => {
        if (user && deputyMinistryOptions.length > 0) {
            setSelectedDeputy(
                deputyMinistryOptions.find(d => d.name === user.deputy) || null
            );
        }
    }, [user, deputyMinistryOptions]);

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (!user) return;

        const payload: Partial<InternetUser> = {
            ...editForm,
            directorate_id: selectedDirectorate?.id,
            group_id: selectedGroup?.id,
            employee_type_id: selectedEmployment?.id,
            device_type_id: selectedDevice?.id,
            deputy: selectedDeputy?.name,
        };

        try {
            await axios.put(`${route}/internet/${user.id}`, payload, { headers: { Authorization: `Bearer ${token}` } });
            onSave(payload);
            onClose();
        } catch (err) {
            console.error("Update failed:", err);
            alert("Failed to update user. Check console.");
        }
    };

    if (!isOpen) return null;

    const ComboBoxField = ({
        label,
        selected,
        setSelected,
        filtered,
    }: {
        label: string;
        selected: Option | null;
        setSelected: (opt: Option | null) => void;
        filtered: Option[];
    }) => (
        <div>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <Combobox value={selected} onChange={opt => setSelected(opt)}>
                <div className="relative mt-1">
                    <div className="relative w-full cursor-default overflow-hidden rounded-md border bg-white text-left">
                        <Combobox.Input
                            className="w-full border-0 px-3 py-2 focus:ring-0 text-sm"
                            displayValue={(opt: Option | null) => opt?.name || ""}
                        />
                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronDown className="h-4 w-4 opacity-70" />
                        </Combobox.Button>
                    </div>
                    <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none">
                        {filtered.map(d => (
                            <Combobox.Option key={d.id} value={d} className={({ active }) => `relative cursor-pointer select-none px-3 py-2 ${active ? "bg-blue-100" : ""}`}>
                                {({ selected }) => (
                                    <div className="flex items-center justify-between">
                                        <span>{d.name}</span>
                                        {selected ? <Check className="h-4 w-4" /> : null}
                                    </div>
                                )}
                            </Combobox.Option>
                        ))}
                    </Combobox.Options>
                </div>
            </Combobox>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-6 max-h-[90vh] overflow-auto">
                <h2 className="text-xl font-bold text-blue-800 mb-4">Edit User</h2>
                <div className="grid grid-cols-2 gap-4">
                    <input name="name" value={editForm.name || ""} onChange={handleEditChange} placeholder="Name" className="border px-2 py-1 rounded-md" />
                    <input name="lastname" value={editForm.lastname || ""} onChange={handleEditChange} placeholder="Last Name" className="border px-2 py-1 rounded-md" />
                    <input name="username" value={editForm.username || ""} onChange={handleEditChange} placeholder="Username" className="border px-2 py-1 rounded-md" />
                    <input name="phone" value={editForm.phone || ""} onChange={handleEditChange} placeholder="Phone" className="border px-2 py-1 rounded-md" />

                    <ComboBoxField label="Directorate" selected={selectedDirectorate} setSelected={setSelectedDirectorate} filtered={allDirectoratesList} />
                    <ComboBoxField label="Group" selected={selectedGroup} setSelected={setSelectedGroup} filtered={allGroupsList} />
                    <ComboBoxField label="Employment" selected={selectedEmployment} setSelected={setSelectedEmployment} filtered={allEmploymentList} />
                    <ComboBoxField label="Device Type" selected={selectedDevice} setSelected={setSelectedDevice} filtered={allDeviceList} />
                    <ComboBoxField label="Deputy Ministry" selected={selectedDeputy} setSelected={setSelectedDeputy} filtered={deputyMinistryOptions} />
                    {/* violation type */}
                    <label htmlFor="violation_type" className="block text-sm font-medium text-gray-700">Violation Type</label>
                    <select name="violation_type" value={editForm.violation_type || ""} onChange={handleEditChange} className="border px-2 py-1 rounded-md col-span-2">
                        {violationTypes.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
                    </select>
                    {/* violations count */}
                    <label htmlFor="violations_count" className="block text-sm font-medium text-gray-700">Violations Count</label>
                    <input type="number" name="violations_count" value={editForm.violations_count || 0} onChange={handleEditChange} placeholder="Violations Count" className="border px-2 py-1 rounded-md" />
                    {/* device limit */}
                    <label htmlFor="device_limit" className="block text-sm font-medium text-gray-700">Device Limit</label>
                    <input type="number" name="device_limit" value={editForm.device_limit || 0} onChange={handleEditChange} placeholder="Device Limit" className="border px-2 py-1 rounded-md" />
                    {/* comment */}
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Comment</label>
                    <textarea name="comment" value={editForm.comment || ""} onChange={handleEditChange} placeholder="Comment" className="border px-2 py-1 rounded-md col-span-2" />
                </div>
                <div className="mt-4 flex justify-end gap-4">
                    <button onClick={onClose} className="px-4 py-2 rounded-md border hover:bg-gray-100">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600">Save</button>
                </div>
            </div>
        </div>
    );
}
