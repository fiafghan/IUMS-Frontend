import { useState, useEffect, useMemo } from "react";
import type { JSX } from "react";
import axios from "axios";
import { Combobox, Tab } from "@headlessui/react";
import { Check, ChevronDown, X, Save, User, UserRound, BadgeCheck, Mail, Phone, Building2, Users, BriefcaseBusiness, 
    Landmark, AlertTriangle, HardDrive, StickyNote, Laptop, Smartphone, Tablet, Monitor } from "lucide-react";
import type { InternetUser, ViolationType} from "../types/types";
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
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
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

    // Simple device type management - just IDs as backend expects
    const [selectedDeviceTypes, setSelectedDeviceTypes] = useState<number[]>([]);
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

                // Map device type names to IDs after device list is loaded
                if (Array.isArray(u.device_type) && allDeviceList.length > 0) {
                    const deviceTypeIds = u.device_type
                        .map((name: string) => {
                            const deviceType = allDeviceList.find(dt => 
                                dt.name.toLowerCase() === name.toLowerCase()
                            );
                            return deviceType?.id;
                        })
                        .filter((id: number | undefined) => id !== undefined) as number[];
                    setSelectedDeviceTypes(deviceTypeIds);
                }

                // Preselect dropdowns if lists already loaded
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

                setEmailError("");
                setPhoneError("");
                setMacError("");
            } catch (e) {
                console.error("Failed to load user for edit:", e);
            }
        };

        fetchUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, user?.id, token, allDeviceList]);


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

    // Load base user into form (do not touch device rows here)
    useEffect(() => {
        if (!isOpen) return;
        setEditForm({ ...user });

        setEmailError("");
        setPhoneError("");
        setMacError("");
    }, [isOpen, user?.id]);

    // Update remaining limit calculation
    useEffect(() => {
        const limit = Number(editForm.device_limit) || 0;
        setRemainingLimit(limit - selectedDeviceTypes.length);
    }, [editForm.device_limit, selectedDeviceTypes.length]);

    // Fetch lists - Fix device types fetching
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
                
                // Fix: Device types are returned directly as array
                const devs: Option[] = (devRes.data as any[]).map((d: any) => ({ id: Number(d.id), name: String(d.name) }));

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

    // After device types load, map existing names to IDs automatically
    useEffect(() => {
        if (allDeviceList.length === 0) return;
        // This useEffect is no longer needed as device types are managed directly
    }, [allDeviceList]);

    // When a group is selected, apply it to all device rows for easier saving
    useEffect(() => {
        if (!selectedGroup?.id) return;
        // This useEffect is no longer needed as device types are managed directly
    }, [selectedGroup?.id, selectedGroup?.name]);

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

    // Simple device type management functions
    const addDeviceType = (deviceTypeId: number) => {
        if (remainingLimit <= 0 || selectedDeviceTypes.includes(deviceTypeId)) return;
        setSelectedDeviceTypes(prev => [...prev, deviceTypeId]);
    };

    const removeDeviceType = (deviceTypeId: number) => {
        setSelectedDeviceTypes(prev => prev.filter(id => id !== deviceTypeId));
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
        selectedDeviceTypes.length > 0 && // Check if device types are selected
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
            device_type_ids: selectedDeviceTypes, // Just send the array of device type IDs
            mac_address: editForm.mac_address ?? null,
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center 
        items-start md:items-center z-50 px-2 md:px-4 py-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full sm:w-[95vw] md:w-[90vw] 
            lg:w-[80vw] max-w-[1200px] max-h-[90vh] overflow-hidden transform scale-95 md:scale-100 flex flex-col">
                
                {/* Enhanced Header */}
                <div className="relative px-8 py-6 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 overflow-hidden flex-shrink-0">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/20 rounded-full translate-y-12 -translate-x-12"></div>
                    
                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
                                <User className="w-8 h-8 text-white" />
                            </div>
        <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-white">Edit Internet User</h2>
                                <p className="text-blue-100 mt-1 font-medium">Update user information and settings</p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose} 
                            className="p-3 rounded-2xl hover:bg-white/10 transition-all duration-200 hover:scale-105"
                        >
                            <X className="w-6 h-6 text-white" />
                        </button>
                    </div>
                </div>

                {/* Enhanced Body - Now Scrollable */}
                <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50">
                    <div className="p-8">
                        <Tab.Group>
                            <Tab.List className="flex gap-1 border-b border-slate-200 pb-2 mb-8 overflow-x-auto bg-white rounded-2xl p-2 shadow-sm sticky top-0 z-10">
                                {["Personal", "Organization", "Devices", "Violations"].map((tab) => (
                                    <Tab
                                        key={tab}
                                        className={({ selected }) =>
                                            `px-6 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                                                selected 
                                                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-105" 
                                                    : "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                                            }`
                                        }
                                    >
                                        {tab}
                                    </Tab>
                                ))}
                            </Tab.List>

                            <Tab.Panels>
                                {/* Enhanced Personal Tab */}
                                <Tab.Panel>
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                            <InputWithIcon
                                                label="Name"
                                                name="name"
                                                value={editForm.name || ""}
                                                placeholder="Enter full name"
                                                icon={<User className="w-5 h-5 text-blue-600" />}
                                                onChange={handleEditChange}
                                            />
                                            <InputWithIcon
                                                label="Last Name"
                                                name="lastname"
                                                value={editForm.lastname || ""}
                                                placeholder="Enter last name"
                                                icon={<UserRound className="w-5 h-5 text-blue-600" />}
                                                onChange={handleEditChange}
                                            />
                                            <InputWithIcon
                                                label="Username"
                                                name="username"
                                                value={editForm.username || ""}
                                                placeholder="Enter username"
                                                icon={<BadgeCheck className="w-5 h-5 text-blue-600" />}
                                                onChange={handleEditChange}
                                            />
                                            <InputWithIcon
                                                label="Email"
                                                name="email"
                                                type="email"
                                                value={editForm.email || ""}
                                                placeholder="Enter email address"
                                                icon={<Mail className="w-5 h-5 text-blue-600" />}
                                                onChange={handleEditChange}
                                                error={emailError}
                                                isLoading={isCheckingEmail}
                                            />
                                            <InputWithIcon
                                                label="Phone"
                                                name="phone"
                                                value={editForm.phone || ""}
                                                placeholder="+937xxxxxxxx"
                                                icon={<Phone className="w-5 h-5 text-blue-600" />}
                                                onChange={handleEditChange}
                                                error={phoneError}
                                                isLoading={isCheckingPhone}
                                            />
                                            <InputWithIcon
                                                label="Position"
                                                name="position"
                                                value={editForm.position || ""}
                                                placeholder="Enter job position"
                                                icon={<BriefcaseBusiness className="w-5 h-5 text-blue-600" />}
                                                onChange={handleEditChange}
                                            />
                                        </div>
                                    </div>
                                </Tab.Panel>

                                {/* Enhanced Organization Tab */}
                                <Tab.Panel>
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                            <ComboBoxField
                                                label="Directorate"
                                                selected={selectedDirectorate}
                                                setSelected={setSelectedDirectorate}
                                                filtered={filteredDirectorates}
                                                query={qDirectorate}
                                                setQuery={setQDirectorate}
                                                icon={<Building2 className="w-5 h-5 text-blue-600" />}
                                            />
                                            <ComboBoxField
                                                label="Group"
                                                selected={selectedGroup}
                                                setSelected={setSelectedGroup}
                                                filtered={filteredGroups}
                                                query={qGroup}
                                                setQuery={setQGroup}
                                                icon={<Users className="w-5 h-5 text-blue-600" />}
                                            />
                                            <ComboBoxField
                                                label="Employment Type"
                                                selected={selectedEmployment}
                                                setSelected={setSelectedEmployment}
                                                filtered={filteredEmployment}
                                                query={qEmployment}
                                                setQuery={setQEmployment}
                                                icon={<BriefcaseBusiness className="w-5 h-5 text-blue-600" />}
                                            />
                                            <ComboBoxField
                                                label="Deputy Ministry"
                                                selected={selectedDeputy}
                                                setSelected={setSelectedDeputy}
                                                filtered={filteredDeputies}
                                                query={qDeputy}
                                                setQuery={setQDeputy}
                                                icon={<Landmark className="w-5 h-5 text-blue-600" />}
                                            />
                                        </div>
                                    </div>
                                </Tab.Panel>

                                {/* Enhanced Devices Tab */}
                                <Tab.Panel>
                                    <div className="space-y-8">
                                        {/* Device Limit Section */}
                                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                                            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                                <HardDrive className="w-5 h-5 text-blue-600" />
                                                Device Management
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <InputWithIcon
                                                    label="Device Limit"
                                                    name="device_limit"
                                                    type="number"
                                                    value={editForm.device_limit ?? ""}
                                                    placeholder="Number of devices allowed"
                                                    icon={<HardDrive className="w-5 h-5 text-blue-600" />}
                                                    onChange={handleEditChange}
                                                />

                                                <div className="flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                                                    <div className="text-center">
                                                        <div className="text-4xl font-bold text-blue-600 mb-2">{remainingLimit}</div>
                                                        <div className="text-sm text-blue-700 font-medium">Devices Remaining</div>
                                                        <div className="text-xs text-blue-600 mt-1">Available for selection</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Device Type Selection */}
                                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                                            <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                                                <Laptop className="w-5 h-5 text-blue-600" />
                                                Select Device Types
                                            </h3>
                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                {allDeviceList.map((deviceType) => {
                                                    const isSelected = selectedDeviceTypes.includes(deviceType.id);
                                                    const canSelect = remainingLimit > 0 || isSelected;
                                                    
                                                    return (
                                                        <button
                                                            key={deviceType.id}
                                                            onClick={() => isSelected ? removeDeviceType(deviceType.id) : addDeviceType(deviceType.id)}
                                                            disabled={!canSelect}
                                                            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                                                                isSelected
                                                                    ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 shadow-md transform scale-105'
                                                                    : canSelect
                                                                    ? 'border-slate-200 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md'
                                                                    : 'border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed'
                                                            }`}
                                                        >
                                                            <div className="flex flex-col items-center gap-3 text-center">
                                                                <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-100' : 'bg-slate-100'}`}>
                                                                    {getDeviceIcon(deviceType.name)}
                </div>
                                                                <span className="text-sm font-medium">{deviceType.name}</span>
        </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Selected Devices Summary */}
                                        {selectedDeviceTypes.length > 0 && (
                                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
                                                <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                                                    <Check className="w-5 h-5 text-blue-600" />
                                                    Selected Device Types
                                                </h3>
                                                <div className="space-y-3">
                                                    {selectedDeviceTypes.map((deviceTypeId) => {
                                                        const deviceType = allDeviceList.find(dt => dt.id === deviceTypeId);
                                                        if (!deviceType) return null;

    return (
                                                            <div key={deviceTypeId} className="flex items-center justify-between bg-white rounded-xl p-4 border border-blue-100 shadow-sm">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="p-2 bg-blue-100 rounded-lg">
                                                                        {getDeviceIcon(deviceType.name)}
                                                                    </div>
                                                                    <span className="font-medium text-slate-900">{deviceType.name}</span>
                                                                </div>
                                                                <button
                                                                    onClick={() => removeDeviceType(deviceTypeId)}
                                                                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                                                >
                                                                    <X className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                
                                                <div className="mt-6 pt-4 border-t border-blue-200">
                <div className="grid grid-cols-2 gap-4">
                                                        <div className="text-center p-3 bg-white rounded-xl border border-blue-100">
                                                            <div className="text-2xl font-bold text-blue-600">{selectedDeviceTypes.length}</div>
                                                            <div className="text-sm text-blue-700">Total Selected</div>
                                                        </div>
                                                        <div className="text-center p-3 bg-white rounded-xl border border-blue-100">
                                                            <div className="text-2xl font-bold text-blue-600">{remainingLimit}</div>
                                                            <div className="text-sm text-blue-700">Remaining</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Tab.Panel>

                                {/* Enhanced Violations Tab */}
                                <Tab.Panel>
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                            <div className="xl:col-span-3 md:col-span-2 col-span-1">
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">Violation Type</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <AlertTriangle className="w-5 h-5 text-red-500" />
                                                    </div>
                                                    <select
                                                        name="violation_type"
                                                        value={String(editForm.violation_type || "")}
                                                        onChange={handleEditChange}
                                                        className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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
                                                icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
                                                onChange={handleEditChange}
                                            />
                                            <div className="xl:col-span-3 md:col-span-2 col-span-1">
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">Comment</label>
                                                <div className="relative">
                                                    <div className="absolute top-4 left-4 pointer-events-none">
                                                        <StickyNote className="w-5 h-5 text-slate-500" />
                                                    </div>
                                                    <textarea
                                                        name="comment"
                                                        value={editForm.comment || ""}
                                                        onChange={handleEditChange}
                                                        placeholder="Enter violation comment..."
                                                        className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl text-sm min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Tab.Panel>
                            </Tab.Panels>
                        </Tab.Group>
                    </div>
                </div>

                {/* Enhanced Footer - Always Visible */}
                <div className="px-8 py-6 bg-gradient-to-r from-slate-50 to-slate-100 border-t border-slate-200 flex items-center justify-between flex-shrink-0">
                    <div className="text-sm text-slate-600">
                        {canSave ? (
                            <span className="flex items-center gap-2 text-green-600">
                                <Check className="w-4 h-4" />
                                All required fields are filled
                            </span>
                        ) : (
                            <span className="flex items-center gap-2 text-amber-600">
                                <AlertTriangle className="w-4 h-4" />
                                Please fill all required fields
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={onClose} 
                            className="px-6 py-3 rounded-xl border border-slate-300 hover:bg-white text-slate-700 text-sm font-medium transition-all duration-200 hover:shadow-md"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!canSave}
                            className={`px-8 py-3 rounded-xl text-white text-sm font-medium inline-flex items-center gap-2 transition-all duration-200 ${
                                canSave 
                                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-105" 
                                    : "bg-slate-400 cursor-not-allowed"
                            }`}
                        >
                            <Save className="w-4 h-4" />
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}