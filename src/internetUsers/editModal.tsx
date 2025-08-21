import { useState, useEffect, useMemo } from "react";
import type { JSX } from "react";
import axios from "axios";
import { Combobox, Tab } from "@headlessui/react";
import { Check, ChevronDown, X, Save, User, UserRound, BadgeCheck, Mail, Phone, Building2, Users, BriefcaseBusiness, Landmark, AlertTriangle, HardDrive, StickyNote, Plus, Laptop, Smartphone, Tablet, Monitor } from "lucide-react";
import type { InternetUser, ViolationType, SelectedDevice } from "../types/types";
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

function InputWithIcon({
    label,
    name,
    type = "text",
    value,
    placeholder,
    icon,
    onChange,
    error,
    isLoading,
}: {
    label: string;
    name: string;
    type?: string;
    value: string | number;
    placeholder: string;
    icon: JSX.Element;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    isLoading?: boolean;
}) {
    return (
        <div className="w-full">
            <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {icon}
                </div>
                <input
                    name={name}
                    type={type}
                    value={value as any}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`w-full pl-10 pr-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-300 ${error ? 'border-red-500' : 'border-gray-300'
                        }`}
                />
                {isLoading && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    </div>
                )}
            </div>
            {error && (
                <p className="text-xs text-red-600 mt-1">{error}</p>
            )}
        </div>
    );
}

function ComboBoxField({
    label,
    selected,
    setSelected,
    filtered,
    setQuery,
    icon,
}: {
    label: string;
    selected: { id: number; name: string } | null;
    setSelected: (opt: { id: number; name: string } | null) => void;
    filtered: { id: number; name: string }[];
    query: string;
    setQuery: (s: string) => void;
    icon: JSX.Element;
}) {
    return (
        <div className="w-full">
            <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
            <Combobox value={selected} onChange={(opt) => setSelected(opt)}>
                <div className="relative">
                    <div className="relative w-full cursor-default overflow-hidden rounded-lg border bg-white text-left">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            {icon}
                        </div>
                        <Combobox.Input
                            className="w-full border-0 pl-10 pr-8 py-2 focus:ring-0 text-sm"
                            displayValue={(opt: { id: number; name: string } | null) => opt?.name || ""}
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
}

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
    const [allGroupsList, setAllGroupsList] = useState<Option[]>([]);
    const [allDirectoratesList, setAllDirectoratesList] = useState<Option[]>([]);
    const [allEmploymentList, setAllEmploymentList] = useState<Option[]>([]);
    const [allDeviceList, setAllDeviceList] = useState<Option[]>([]);
    const [selectedDirectorate, setSelectedDirectorate] = useState<Option | null>(null);
    const [selectedGroup, setSelectedGroup] = useState<Option | null>(null);
    const [selectedEmployment, setSelectedEmployment] = useState<Option | null>(null);
    const [selectedDeputy, setSelectedDeputy] = useState<Option | null>(null);

    // New multiple device states
    const [selectedDevices, setSelectedDevices] = useState<SelectedDevice[]>([]);
    const [remainingLimit, setRemainingLimit] = useState(Number(user?.device_limit) || 0);

    // Queries for filtering in combobox
    const [qDirectorate, setQDirectorate] = useState("");
    const [qGroup, setQGroup] = useState("");
    const [qEmployment, setQEmployment] = useState("");
    const [qDeputy, setQDeputy] = useState("");

    // Validation states
    const [emailError, setEmailError] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [macError, setMacError] = useState("");
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);
    const [isCheckingPhone, setIsCheckingPhone] = useState(false);
    const [isCheckingMac, setIsCheckingMac] = useState(false);

    // Add debouncing for API calls
    const [emailTimeout, setEmailTimeout] = useState<number | null>(null);
    const [phoneTimeout, setPhoneTimeout] = useState<number | null>(null);
    const [macTimeout, setMacTimeout] = useState<number | null>(null);

    useEffect(() => {
        if (!isOpen || !user?.id) return;
      
        const fetchUser = async () => {
          try {
            const res = await axios.get(`${route}/internet-user-edit/${user.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
      
            const u = res.data?.data ?? res.data;
      
            setEditForm(prev => ({
              ...prev,
              id: u.id,
              name: u.name ?? prev.name,
              lastname: u.lastname ?? prev.lastname,
              username: u.username ?? prev.username,
              email: u.email ?? prev.email,
              phone: u.phone ?? prev.phone,
              position: u.position ?? prev.position,
              status: u.status ?? prev.status,
              device_limit: u.device_limit ?? prev.device_limit,
              mac_address: u.mac_address ?? prev.mac_address,
              employment_type: u.employment_type ?? prev.employment_type,
              violation_type: u.violation_type ?? prev.violation_type,
              violation_count: u.violation_count ?? prev.violation_count,
              comment: u.comment ?? prev.comment,
            }));
      
            // preselect dropdowns بدون overwrite فرم
            if (allDirectoratesList.length) {
              const d = allDirectoratesList.find(x => x.name?.toLowerCase() === String(u.directorate ?? "").toLowerCase()) || null;
              setSelectedDirectorate(d);
            }
            if (allGroupsList.length) {
              const g = allGroupsList.find(x => x.name?.toLowerCase() === String(u.groups ?? "").toLowerCase()) || null;
              setSelectedGroup(g);
            }
            if (allEmploymentList.length) {
              const eByName = allEmploymentList.find(x => x.name?.toLowerCase() === String(u.employment_type ?? "").toLowerCase()) || null;
              setSelectedEmployment(eByName);
            }
            if (deputyMinistryOptions.length) {
              const dep = deputyMinistryOptions.find(x => x.name?.toLowerCase() === String(u.deputy ?? "").toLowerCase()) || null;
              setSelectedDeputy(dep);
            }
      
            // Devices و خطاها
            setSelectedDevices([]);
            setEmailError("");
            setPhoneError("");
            setMacError("");
          } catch (e) {
            console.error("Failed to load user for edit:", e);
          }
        };
      
        fetchUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [isOpen, user?.id, token]);
      

    // Validation functions
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) return "";
        if (!email.includes('@')) return "Email must contain @ symbol";
        if (!emailRegex.test(email)) return "Please enter a valid email address";
        return "";
    };

    const validatePhone = (phone: string) => {
        const phoneRegex = /^\+93[0-9]{8}$/;
        if (!phone) return "";
        if (!phone.startsWith('+93')) return "Phone must start with +93";
        if (!phoneRegex.test(phone)) return "Phone must be in format: +937xxxxxxxx";
        return "";
    };

    const validateMacAddress = (mac: string) => {
        if (!mac) return "";
        // Allow partial MAC addresses during typing
        if (mac.length < 17) return "";
        const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
        if (!macRegex.test(mac)) return "MAC address must be in format: XX:XX:XX:XX:XX:XX";
        return "";
    };

    const formatMacAddress = (value: string) => {
        // Remove all non-alphanumeric characters
        const cleaned = value.replace(/[^0-9A-Fa-f]/g, '');
        // Limit to 12 characters (6 pairs)
        const limited = cleaned.slice(0, 12);
        // Add colons every 2 characters
        const formatted = limited.match(/.{1,2}/g)?.join(':') || '';
        return formatted.toUpperCase();
    };

    // API check functions
    const checkEmailExists = async (email: string) => {
        if (!email) return;
        setIsCheckingEmail(true);
        try {
            const response = await axios.post(`${route}/check-email-of-internet-users`,
                { email },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.exists) {
                setEmailError("This email is already registered");
            }
        } catch (err) {
            console.error("Error checking email:", err);
        } finally {
            setIsCheckingEmail(false);
        }
    };

    const checkPhoneExists = async (phone: string) => {
        if (!phone) return;
        setIsCheckingPhone(true);
        try {
            const response = await axios.post(`${route}/check-phone-of-internet-user`,
                { phone },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.exists) {
                setPhoneError("This phone number is already registered");
            }
        } catch (err) {
            console.error("Error checking phone:", err);
        } finally {
            setIsCheckingPhone(false);
        }
    };

    const checkMacExists = async (mac: string) => {
        if (!mac) return;
        setIsCheckingMac(true);
        try {
            const response = await axios.post(`${route}/check-mac-address`,
                { mac_address: mac },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.exists) {
                setMacError("This MAC address is already registered");
            }
        } catch (err) {
            console.error("Error checking MAC:", err);
        } finally {
            setIsCheckingMac(false);
        }
    };

    // Load base user into form and devices (only when modal opens or selected user changes)
    useEffect(() => {
        if (!isOpen) return;
        setEditForm({ ...user });

        // Load devices if they exist
        if (user.devices && Array.isArray(user.devices)) {
            const devices: SelectedDevice[] = user.devices.map((device: any) => ({
                id: device.id?.toString() || Date.now().toString(),
                deviceTypeId: device.device_type_id || 0,
                deviceTypeName: device.device_type?.name || "",
                groupId: device.group_id || 0,
                groupName: device.group?.name || "",
                macAddress: device.mac_address || "",
            }));
            setSelectedDevices(devices);
        } else {
            setSelectedDevices([]);
        }

        setEmailError("");
        setPhoneError("");
        setMacError("");
    }, [isOpen, user?.id]);

    // Update remaining limit when device limit changes
    useEffect(() => {
        const limit = Number(editForm.device_limit) || 0;
        setRemainingLimit(limit - selectedDevices.length);
    }, [editForm.device_limit, selectedDevices.length]);

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
        if (user && deputyMinistryOptions.length > 0) {
            const byName = deputyMinistryOptions.find((d) => String(d.name).toLowerCase() === String(user.deputy).toLowerCase());
            setSelectedDeputy(byName ?? null);
        }
    }, [user, deputyMinistryOptions]);

    // Device management functions
    const addDevice = () => {
        if (remainingLimit <= 0) return;

        const newDevice: SelectedDevice = {
            id: Date.now().toString(),
            deviceTypeId: 0,
            deviceTypeName: "",
            groupId: 0,
            groupName: "",
            macAddress: ""
        };

        setSelectedDevices(prev => [...prev, newDevice]);
    };

    const removeDevice = (deviceId: string) => {
        setSelectedDevices(prev => prev.filter(device => device.id !== deviceId));
    };

    const updateDevice = (deviceId: string, field: keyof SelectedDevice, value: any) => {
        setSelectedDevices(prev => prev.map(device => {
            if (device.id === deviceId) {
                if (field === 'deviceTypeId') {
                    const deviceType = allDeviceList.find(dt => dt.id === value);
                    return { ...device, deviceTypeId: value, deviceTypeName: deviceType?.name || "" };
                }
                if (field === 'groupId') {
                    const group = allGroupsList.find(g => g.id === value);
                    return { ...device, groupId: value, groupName: group?.name || "" };
                }
                return { ...device, [field]: value };
            }
            return device;
        }));
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

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        // Handle MAC address formatting
        if (name === 'mac_address') {
            const formatted = formatMacAddress(value);
            setEditForm((prev) => ({ ...prev, [name]: formatted }));

            // Clear previous error and validate
            setMacError("");
            const macValidation = validateMacAddress(formatted);
            if (macValidation) {
                setMacError(macValidation);
            } else if (formatted.length >= 8) { // Start checking when we have at least 4 characters (XX:XX)
                // Clear existing timeout
                if (macTimeout) {
                    clearTimeout(macTimeout);
                    setMacTimeout(null);
                }
                // Set new timeout for API call
                const timeout = setTimeout(() => checkMacExists(formatted), 500);
                setMacTimeout(timeout);
            }
            return;
        }

        // Handle phone formatting
        if (name === 'phone') {
            let formatted = value;
            if (!value.startsWith('+93') && value.length > 0) {
                formatted = '+93' + value.replace(/^\+93/, '');
            }
            setEditForm((prev) => ({ ...prev, [name]: formatted }));

            // Clear previous error and validate
            setPhoneError("");
            const phoneValidation = validatePhone(formatted);
            if (phoneValidation) {
                setPhoneError(phoneValidation);
            } else if (formatted.length >= 6) { // Start checking when we have +93 plus at least 3 digits
                // Clear existing timeout
                if (phoneTimeout) {
                    clearTimeout(phoneTimeout);
                    setPhoneTimeout(null);
                }
                // Set new timeout for API call
                const timeout = setTimeout(() => checkPhoneExists(formatted), 500);
                setPhoneTimeout(timeout);
            }
            return;
        }

        // Handle email validation
        if (name === 'email') {
            setEditForm((prev) => ({ ...prev, [name]: value }));

            // Clear previous error and validate
            setEmailError("");
            const emailValidation = validateEmail(value);
            if (emailValidation) {
                setEmailError(emailValidation);
            } else if (value.includes('@') && value.length >= 5) { // Start checking when we have @ and reasonable length
                // Clear existing timeout
                if (emailTimeout) {
                    clearTimeout(emailTimeout);
                    setEmailTimeout(null);
                }
                // Set new timeout for API call
                const timeout = setTimeout(() => checkEmailExists(value), 500);
                setEmailTimeout(timeout);
            }
            return;
        }

        // Handle other fields normally
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
        (editForm.device_limit === 0 || Boolean(editForm.device_limit)) &&
        selectedDevices.length > 0 && // Check if devices are selected
        selectedDevices.every(device => device.deviceTypeId > 0 && device.groupId > 0) && // Check if all devices have required fields
        !emailError &&
        !phoneError &&
        !macError &&
        !isCheckingEmail &&
        !isCheckingPhone &&
        !isCheckingMac;

    const handleSave = async () => {
        if (!user) return;

        const payload: any = {
            ...editForm,
            directorate_id: selectedDirectorate?.id,
            group_id: selectedGroup?.id,
            employee_type_id: selectedEmployment?.id,
            deputy: selectedDeputy?.name,
            devices: selectedDevices.map(device => ({
                device_type_id: device.deviceTypeId,
                group_id: device.groupId,
                mac_address: device.macAddress || null,
            })),
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

    useEffect(() => {
        return () => {
            if (emailTimeout) {
                clearTimeout(emailTimeout);
                setEmailTimeout(null);
            }
            if (phoneTimeout) {
                clearTimeout(phoneTimeout);
                setPhoneTimeout(null);
            }
            if (macTimeout) {
                clearTimeout(macTimeout);
                setMacTimeout(null);
            }
        };
    }, [emailTimeout, phoneTimeout, macTimeout]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex justify-center 
        items-start md:items-center z-50 px-2 md:px-4 py-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full sm:w-[95vw] md:w-[90vw] 
            lg:w-[80vw] max-w-[1000px] max-h-[88vh] overflow-auto transform scale-90 md:scale-95 p-0">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-400 to-blue-200">
                    <h2 className="text-lg md:text-xl font-bold text-white">Edit Internet User</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10">
                        <X className="text-white" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <Tab.Group>
                        <Tab.List className="flex gap-2 border-b pb-2 mb-4 overflow-x-auto">
                            {["Personal", "Organization", "Devices", "Violations"].map((t) => (
                                <Tab
                                    key={t}
                                    className={({ selected }) =>
                                        `px-4 py-2 rounded-t-md text-sm whitespace-nowrap ${selected ? "bg-blue-600 text-white" : "bg-blue-400 text-white hover:bg-gray-200"
                                        }`
                                    }
                                >
                                    {t}
                                </Tab>
                            ))}
                        </Tab.List>

                        <Tab.Panels>
                            {/* Personal */}
                            <Tab.Panel>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                    <InputWithIcon
                                        label="Name"
                                        name="name"
                                        value={editForm.name || ""}
                                        placeholder="Name"
                                        icon={<User className="w-4 h-4 text-gray-500" />}
                                        onChange={handleEditChange}
                                    />
                                    <InputWithIcon
                                        label="Last Name"
                                        name="lastname"
                                        value={editForm.lastname || ""}
                                        placeholder="Last Name"
                                        icon={<UserRound className="w-4 h-4 text-gray-500" />}
                                        onChange={handleEditChange}
                                    />
                                    <InputWithIcon
                                        label="Username"
                                        name="username"
                                        value={editForm.username || ""}
                                        placeholder="Username"
                                        icon={<BadgeCheck className="w-4 h-4 text-gray-500" />}
                                        onChange={handleEditChange}
                                    />
                                    <InputWithIcon
                                        label="Email"
                                        name="email"
                                        type="email"
                                        value={editForm.email || ""}
                                        placeholder="Email"
                                        icon={<Mail className="w-4 h-4 text-gray-500" />}
                                        onChange={handleEditChange}
                                        error={emailError}
                                        isLoading={isCheckingEmail}
                                    />
                                    <InputWithIcon
                                        label="Phone"
                                        name="phone"
                                        value={editForm.phone || ""}
                                        placeholder="+937xxxxxxxx"
                                        icon={<Phone className="w-4 h-4 text-gray-500" />}
                                        onChange={handleEditChange}
                                        error={phoneError}
                                        isLoading={isCheckingPhone}
                                    />
                                </div>
                            </Tab.Panel>

                            {/* Organization */}
                            <Tab.Panel>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                    <ComboBoxField
                                        label="Directorate"
                                        selected={selectedDirectorate}
                                        setSelected={setSelectedDirectorate}
                                        filtered={filteredDirectorates}
                                        query={qDirectorate}
                                        setQuery={setQDirectorate}
                                        icon={<Building2 className="w-4 h-4 text-gray-500" />}
                                    />
                                    <ComboBoxField
                                        label="Group"
                                        selected={selectedGroup}
                                        setSelected={setSelectedGroup}
                                        filtered={filteredGroups}
                                        query={qGroup}
                                        setQuery={setQGroup}
                                        icon={<Users className="w-4 h-4 text-gray-500" />}
                                    />
                                    <ComboBoxField
                                        label="Employment Type"
                                        selected={selectedEmployment}
                                        setSelected={setSelectedEmployment}
                                        filtered={filteredEmployment}
                                        query={qEmployment}
                                        setQuery={setQEmployment}
                                        icon={<BriefcaseBusiness className="w-4 h-4 text-gray-500" />}
                                    />
                                    <ComboBoxField
                                        label="Deputy Ministry"
                                        selected={selectedDeputy}
                                        setSelected={setSelectedDeputy}
                                        filtered={filteredDeputies}
                                        query={qDeputy}
                                        setQuery={setQDeputy}
                                        icon={<Landmark className="w-4 h-4 text-gray-500" />}
                                    />
                                </div>
                            </Tab.Panel>

                            {/* Devices */}
                            <Tab.Panel>
                                <div className="space-y-6">
                                    {/* Device Limit and Summary */}
                                    <div className="grid grid-cols-2 gap-5">
                                        <InputWithIcon
                                            label="Device Limit"
                                            name="device_limit"
                                            type="number"
                                            value={editForm.device_limit ?? ""}
                                            placeholder="Number of devices allowed"
                                            icon={<HardDrive className="w-4 h-4 text-gray-500" />}
                                            onChange={handleEditChange}
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
                                                                {allDeviceList.map((type) => (
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
                                                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                            <select
                                                                value={device.groupId || ""}
                                                                onChange={(e) => updateDevice(device.id, 'groupId', Number(e.target.value))}
                                                                className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
                                                            >
                                                                <option value="">Select Group Type</option>
                                                                {allGroupsList.map((group) => (
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
                                                            <HardDrive className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
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
                                                {allDeviceList.map(type => {
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
                                </div>
                            </Tab.Panel>

                            {/* Violations */}
                            <Tab.Panel>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                    <div className="xl:col-span-3 md:col-span-2 col-span-1">
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Violation Type</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <AlertTriangle className="w-4 h-4 text-gray-500" />
                                            </div>
                                            <select
                                                name="violation_type"
                                                value={String(editForm.violation_type || "")}
                                                onChange={handleEditChange}
                                                className="w-full pl-10 pr-3 py-2 border rounded-md text-sm"
                                            >
                                                <option value="" disabled>Select Violation Type</option>
                                                {violationTypes.map((v) => (
                                                    <option key={v.id} value={v.name}>{v.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <InputWithIcon
                                        label="Violations Count"
                                        name="violation_count"
                                        type="number"
                                        value={editForm.violation_count ?? ""}
                                        placeholder="0"
                                        icon={<AlertTriangle className="w-4 h-4 text-gray-500" />}
                                        onChange={handleEditChange}
                                    />
                                    <div className="xl:col-span-3 md:col-span-2 col-span-1">
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Comment</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 pt-[6px] pointer-events-none">
                                                <StickyNote className="w-4 h-4 text-gray-500" />
                                            </div>
                                            <textarea
                                                name="comment"
                                                value={editForm.comment || ""}
                                                onChange={handleEditChange}
                                                placeholder="Comment"
                                                className="w-full pl-10 pr-3 py-2 border rounded-md text-sm min-h-[80px]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Tab.Panel>
                        </Tab.Panels>
                    </Tab.Group>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 flex items-center justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-md border hover:bg-white text-gray-700 text-sm">
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!canSave}
                        className={`px-4 py-2 rounded-md text-white text-sm inline-flex items-center gap-2 ${canSave ? "bg-blue-400 hover:bg-blue-300" : "bg-blue-300 cursor-not-allowed"}`}
                    >
                        <Save className="w-4 h-4" />
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
