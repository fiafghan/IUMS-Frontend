import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Combobox } from "@headlessui/react";
import { Check, ChevronDown, X, Save } from "lucide-react";
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

	// Lists (authoritative lists fetched from APIs)
	const [allGroupsList, setAllGroupsList] = useState<Option[]>([]);
	const [allDirectoratesList, setAllDirectoratesList] = useState<Option[]>([]);
	const [allEmploymentList, setAllEmploymentList] = useState<Option[]>([]);
	const [allDeviceList, setAllDeviceList] = useState<Option[]>([]);

	// Selected values
	const [selectedDirectorate, setSelectedDirectorate] = useState<Option | null>(null);
	const [selectedGroup, setSelectedGroup] = useState<Option | null>(null);
	const [selectedEmployment, setSelectedEmployment] = useState<Option | null>(null);
	const [selectedDevice, setSelectedDevice] = useState<Option | null>(null);
	const [selectedDeputy, setSelectedDeputy] = useState<Option | null>(null);

	// Queries for filtering in combobox
	const [qDirectorate, setQDirectorate] = useState("");
	const [qGroup, setQGroup] = useState("");
	const [qEmployment, setQEmployment] = useState("");
	const [qDevice, setQDevice] = useState("");
	const [qDeputy, setQDeputy] = useState("");

	// Load base user into form
	useEffect(() => {
		if (!user) return;
		setEditForm({ ...user });
	}, [user]);

	// Fetch lists
	useEffect(() => {
		const run = async () => {
			try {
				const [groupsRes, dirRes, empRes, devRes] = await Promise.all([
					axios.get(`${route}/groups`, { headers: { Authorization: `Bearer ${token}` } }),
					axios.get(`${route}/directorate`, { headers: { Authorization: `Bearer ${token}` } }),
					axios.get(`${route}/employment-type`, { headers: { Authorization: `Bearer ${token}` } }),
					axios.get(`${route}/device-types`, { headers: { Authorization: `Bearer ${token}` } }),
				]);

				const groups: Option[] = (groupsRes.data as any[]).map((g) => ({ id: Number(g.id), name: String(g.name) }));
				const dirs: Option[] = (dirRes.data as any[]).map((d) => ({ id: Number(d.id), name: String(d.name) }));
				const emps: Option[] = (empRes.data as any[]).map((e) => ({ id: Number(e.id), name: String(e.name) }));
				const devs: Option[] = (devRes.data as any[]).map((d) => ({ id: Number(d.id), name: String(d.name) }));

				setAllGroupsList(groups);
				setAllDirectoratesList(dirs);
				setAllEmploymentList(emps);
				setAllDeviceList(devs);
			} catch (err) {
				console.error("Error fetching dropdown data:", err);
			}
		};
		run();
	}, [token]);

	// Preselects (use IDs when present; fallback to names)
	useEffect(() => {
		if (user && allDirectoratesList.length > 0) {
			const byName = allDirectoratesList.find((d) => String(d.name).toLowerCase() === String(user.directorate).toLowerCase());
			setSelectedDirectorate(byName ?? null);
		}
	}, [user, allDirectoratesList]);

	useEffect(() => {
		if (user && allGroupsList.length > 0) {
			const byName = allGroupsList.find((g) => String(g.name).toLowerCase() === String(user.groups).toLowerCase());
			setSelectedGroup(byName ?? null);
		}
	}, [user, allGroupsList]);

	useEffect(() => {
		if (user && allEmploymentList.length > 0) {
			const byId = allEmploymentList.find((e) => Number(e.id) === Number((user as any).employee_type_id));
			const byName = allEmploymentList.find((e) => e.name.toLowerCase() === String(user.employment_type || user.employee_type).toLowerCase());
			setSelectedEmployment(byId ?? byName ?? null);
		}
	}, [user, allEmploymentList]);

	useEffect(() => {
		if (user && allDeviceList.length > 0) {
			const deviceId = Number((user as any).device_type_id);
			let found = allDeviceList.find((d) => Number(d.id) === deviceId);
			if (!found && (user as any).device_type) {
				const name = String((user as any).device_type).toLowerCase();
				found = allDeviceList.find((d) => d.name.toLowerCase() === name);
			}
			setSelectedDevice(found || null);
		}
	}, [user, allDeviceList]);

	useEffect(() => {
		if (user && deputyMinistryOptions.length > 0) {
			const byName = deputyMinistryOptions.find((d) => String(d.name).toLowerCase() === String(user.deputy).toLowerCase());
			setSelectedDeputy(byName ?? null);
		}
	}, [user, deputyMinistryOptions]);

	const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setEditForm((prev) => ({ ...prev, [name]: value }));
	};

	const filteredDirectorates = useMemo(
		() => allDirectoratesList.filter((o) => o.name.toLowerCase().includes(qDirectorate.toLowerCase())),
		[qDirectorate, allDirectoratesList]
	);
	const filteredGroups = useMemo(
		() => allGroupsList.filter((o) => o.name.toLowerCase().includes(qGroup.toLowerCase())),
		[qGroup, allGroupsList]
	);
	const filteredEmployment = useMemo(
		() => allEmploymentList.filter((o) => o.name.toLowerCase().includes(qEmployment.toLowerCase())),
		[qEmployment, allEmploymentList]
	);
	const filteredDevices = useMemo(
		() => allDeviceList.filter((o) => o.name.toLowerCase().includes(qDevice.toLowerCase())),
		[qDevice, allDeviceList]
	);
	const filteredDeputies = useMemo(
		() => deputyMinistryOptions.filter((o) => o.name.toLowerCase().includes(qDeputy.toLowerCase())),
		[qDeputy, deputyMinistryOptions]
	);

	const canSave =
		Boolean(editForm.name) &&
		Boolean(editForm.lastname) &&
		Boolean(editForm.username) &&
		Boolean(editForm.phone) &&
		Boolean(editForm.email) &&
		Boolean(selectedDirectorate?.id) &&
		Boolean(selectedGroup?.id) &&
		Boolean(selectedEmployment?.id) &&
		Boolean(selectedDevice?.id) &&
		(editForm.device_limit === 0 || Boolean(editForm.device_limit));

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
			onSave({ ...payload, id: user.id });
			onClose();
		} catch (err) {
			console.error("Update failed:", err);
			alert("Failed to update user. Please check required fields and try again.");
		}
	};

	if (!isOpen) return null;

	const ComboBoxField = ({
		label,
		selected,
		setSelected,
		filtered,
		setQuery,
	}: {
		label: string;
		selected: Option | null;
		setSelected: (opt: Option | null) => void;
		filtered: Option[];
		query: string;
		setQuery: (s: string) => void;
	}) => (
		<div className="w-full">
			<label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
			<Combobox value={selected} onChange={(opt) => setSelected(opt)}>
				<div className="relative">
					<div className="relative w-full cursor-default overflow-hidden rounded-lg border bg-white text-left">
						<Combobox.Input
							className="w-full border-0 px-3 py-2 focus:ring-0 text-sm"
							displayValue={(opt: Option | null) => opt?.name || ""}
							onChange={(e) => setQuery(e.target.value)}
							placeholder={`Search ${label}...`}
						/>
						<Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
							<ChevronDown className="h-4 w-4 opacity-70" />
						</Combobox.Button>
					</div>
					{filtered.length > 0 && (
						<Combobox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none">
							{filtered.map((d) => (
								<Combobox.Option
									key={`${label}-${d.id}`}
									value={d}
									className={({ active }) => `relative cursor-pointer select-none px-3 py-2 ${active ? "bg-blue-50" : ""}`}
								>
									{({ selected }) => (
										<div className="flex items-center justify-between">
											<span className="truncate">{d.name}</span>
											{selected ? <Check className="h-4 w-4 text-blue-600" /> : null}
										</div>
									)}
								</Combobox.Option>
							))}
						</Combobox.Options>
					)}
				</div>
			</Combobox>
		</div>
	);

	return (
		<div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex justify-center items-center z-50 px-4">
			<div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl p-0 overflow-hidden">
				{/* Header */}
				<div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600">
					<h2 className="text-lg md:text-xl font-bold text-white">Edit Internet User</h2>
					<button onClick={onClose} className="p-2 rounded-full hover:bg-white/10">
						<X className="text-white" />
					</button>
				</div>

				{/* Body */}
				<div className="p-6">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						<input name="name" value={editForm.name || ""} onChange={handleEditChange} placeholder="Name" className="border px-3 py-2 rounded-md text-sm" />
						<input name="lastname" value={editForm.lastname || ""} onChange={handleEditChange} placeholder="Last Name" className="border px-3 py-2 rounded-md text-sm" />
						<input name="username" value={editForm.username || ""} onChange={handleEditChange} placeholder="Username" className="border px-3 py-2 rounded-md text-sm" />
						<input name="phone" value={editForm.phone || ""} onChange={handleEditChange} placeholder="Phone" className="border px-3 py-2 rounded-md text-sm" />
						<input name="email" type="email" value={editForm.email || ""} onChange={handleEditChange} placeholder="Email" className="border px-3 py-2 rounded-md text-sm" />

						<ComboBoxField
							label="Directorate"
							selected={selectedDirectorate}
							setSelected={setSelectedDirectorate}
							filtered={filteredDirectorates}
							query={qDirectorate}
							setQuery={setQDirectorate}
						/>

						<ComboBoxField
							label="Group"
							selected={selectedGroup}
							setSelected={setSelectedGroup}
							filtered={filteredGroups}
							query={qGroup}
							setQuery={setQGroup}
						/>

						<ComboBoxField
							label="Employment Type"
							selected={selectedEmployment}
							setSelected={setSelectedEmployment}
							filtered={filteredEmployment}
							query={qEmployment}
							setQuery={setQEmployment}
						/>

						<ComboBoxField
							label="Device Type"
							selected={selectedDevice}
							setSelected={setSelectedDevice}
							filtered={filteredDevices}
							query={qDevice}
							setQuery={setQDevice}
						/>

						<ComboBoxField
							label="Deputy Ministry"
							selected={selectedDeputy}
							setSelected={setSelectedDeputy}
							filtered={filteredDeputies}
							query={qDeputy}
							setQuery={setQDeputy}
						/>

						<select name="violation_type" value={String(editForm.violation_type || "")} onChange={handleEditChange} className="border px-3 py-2 rounded-md text-sm col-span-1 md:col-span-2 lg:col-span-3">
							<option value="" disabled>
								Select Violation Type
							</option>
							{violationTypes.map((v) => (
								<option key={v.id} value={v.name}>
									{v.name}
								</option>
							))}
						</select>

						<input
							type="number"
							name="violations_count"
							value={Number(editForm.violations_count || 0)}
							onChange={handleEditChange}
							placeholder="Violations Count"
							className="border px-3 py-2 rounded-md text-sm"
						/>
						<input
							type="number"
							name="device_limit"
							value={Number(editForm.device_limit || 0)}
							onChange={handleEditChange}
							placeholder="Device Limit"
							className="border px-3 py-2 rounded-md text-sm"
						/>
						<textarea name="comment" value={editForm.comment || ""} onChange={handleEditChange} placeholder="Comment" className="border px-3 py-2 rounded-md text-sm col-span-1 md:col-span-2 lg:col-span-3 min-h-[80px]" />
					</div>
				</div>

				{/* Footer */}
				<div className="px-6 py-4 bg-gray-50 flex items-center justify-end gap-3">
					<button onClick={onClose} className="px-4 py-2 rounded-md border hover:bg-white text-gray-700 text-sm">
						Cancel
					</button>
					<button
						onClick={handleSave}
						disabled={!canSave}
						className={`px-4 py-2 rounded-md text-white text-sm inline-flex items-center gap-2 ${canSave ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-300 cursor-not-allowed"}`}
					>
						<Save className="w-4 h-4" />
						Save
					</button>
				</div>
			</div>
		</div>
	);
}
