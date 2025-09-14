import { useState, useEffect, useMemo } from "react";
import type { JSX } from "react";
import axios from "axios";
import { Combobox, Tab } from "@headlessui/react";
import {
    Check, ChevronDown, X, Save, User, UserRound, BadgeCheck, Mail, Phone, Building2, Users, BriefcaseBusiness,
    Landmark, AlertTriangle, HardDrive, Laptop, Smartphone, Tablet, Monitor
} from "lucide-react";
import type { InternetUser } from "../types/types";
import { route } from "../config";
import Swal from "sweetalert2";
import { mapsid } from "../enums/deputy_enum";

type Option = { id: number; name: string };

type Props = {
    user: InternetUser;
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedUser: Partial<InternetUser>) => void;
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
    disabled,
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
    disabled?: boolean;
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
                    disabled={disabled}
                    className={`w-full pl-10 pr-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-300 ${error ? 'border-red-500' : 'border-gray-300'
                        } ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
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
    onSave
}: Props) {
    const token = JSON.parse(localStorage.getItem("loggedInUser") || "{}")?.token;

    const [editForm, setEditForm] = useState<Partial<InternetUser>>({});
    const [allGroupsList, setAllGroupsList] = useState<Option[]>([]);
    const [allDirectoratesList, setAllDirectoratesList] = useState<Option[]>([]);
    const [directorateOptionsFull, setDirectorateOptionsFull] = useState<any[]>([]);
    const [allEmploymentList, setAllEmploymentList] = useState<Option[]>([]);
    const [allDeviceList, setAllDeviceList] = useState<Option[]>([]);
    const [selectedDirectorate, setSelectedDirectorate] = useState<Option | null>(null);
    const [selectedGroup, setSelectedGroup] = useState<Option | null>(null);
    const [selectedEmployment, setSelectedEmployment] = useState<Option | null>(null);
    const [deputyMinistryId, setDeputyMinistryId] = useState<number | null>(null);
    const deputyMinistryName = useMemo(() => {
        return deputyMinistryId ? (mapsid[Number(deputyMinistryId)] ?? "") : "";
    }, [deputyMinistryId]);

    const [selectedDevices, setSelectedDevices] = useState<Array<{ rowId: string; device_type_id: number; mac_address: string }>>([]);
    const [remainingLimit, setRemainingLimit] = useState(Number(user?.device_limit) || 0);

    const [qDirectorate, setQDirectorate] = useState("");
    const [qGroup, setQGroup] = useState("");
    const [qEmployment, setQEmployment] = useState("");

    const [emailError, setEmailError] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [macError, setMacError] = useState("");
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);
    const [isCheckingPhone, setIsCheckingPhone] = useState(false);
    const [isCheckingMac, setIsCheckingMac] = useState(false);

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

                console.log('API user edit response:', res.data);
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
                    // Normalize status into the constrained union type expected by InternetUser
                    status: (() => {
                      const raw = (u.status ?? user?.status ?? prev.status) as any;
                      if (raw === 'active' || raw === 1 || raw === '1') return 1 as 1;
                      if (raw === 'deactive' || raw === 0 || raw === '0') return 0 as 0;
                      return undefined;
                    })(),
                    device_limit: u.device_limit ?? prev.device_limit,
                    employment_type: u.employment_type ?? prev.employment_type,
                    device_type_id: Array.isArray(u.device_type_id) ? u.device_type_id : prev.device_type_id ?? [],
                    device_type: Array.isArray(u.device_type) ? u.device_type : prev.device_type ?? [],
                    device_macs: (u.device_macs && typeof u.device_macs === 'object') ? u.device_macs : prev.device_macs ?? {},
                }));

                if (Array.isArray(u.devices)) {
                    const typeCounts: Record<number, number> = {};
                    setSelectedDevices(u.devices.map((d: any) => {
                        const tId = Number(d.device_type_id);
                        const count = (typeCounts[tId] = (typeCounts[tId] || 0) + 1);
                        return {
                            rowId: `${u.id || 'u'}-${tId}-${count}`,
                            device_type_id: tId,
                            mac_address: String(d.mac_address || ''),
                        };
                    }));
                } else {
                    const ids: number[] = Array.isArray(u.device_type_id) ? u.device_type_id.map((x: any) => Number(x)) : [];
                    const macs = (u.device_macs && typeof u.device_macs === 'object') ? u.device_macs : {};
                    const rows: Array<{ rowId: string; device_type_id: number; mac_address: string }> = [];
                    const typeCounts: Record<number, number> = {};
                    ids.forEach((id: number) => {
                        const count = (typeCounts[id] = (typeCounts[id] || 0) + 1);
                        const entry = (macs as any)[id];
                        let mac = '';
                        if (Array.isArray(entry)) {
                            mac = String(entry[count - 1] || '');
                        } else if (count === 1) {
                            mac = String(entry || '');
                        } else {
                            mac = '';
                        }
                        rows.push({ rowId: `${u.id || 'u'}-${id}-${count}`, device_type_id: id, mac_address: mac });
                    });
                    setSelectedDevices(rows);
                }

                if (allDirectoratesList.length) {
                    const d = allDirectoratesList.find(x => x.name?.toLowerCase() === String(u.directorate ?? "").toLowerCase()) || null;
                    setSelectedDirectorate(d);
                    if (d && directorateOptionsFull.length) {
                        const full = directorateOptionsFull.find((fd: any) => Number(fd.id) === Number(d.id));
                        const depId = full?.directorate_id;
                        setDeputyMinistryId(depId != null ? Number(depId) : null);
                    }
                }
                if (allGroupsList.length) {
                    const g = allGroupsList.find(x => x.name?.toLowerCase() === String(u.groups ?? "").toLowerCase()) || null;
                    setSelectedGroup(g);
                }
                if (allEmploymentList.length) {
                    const eByName = allEmploymentList.find(x => x.name?.toLowerCase() === String(u.employment_type ?? "").toLowerCase()) || null;
                    setSelectedEmployment(eByName);
                }
                if (u.deputy && !deputyMinistryId) {
                    const entry = Object.entries(mapsid).find(([, v]) => String(v).toLowerCase() === String(u.deputy).toLowerCase());
                    setDeputyMinistryId(entry ? Number(entry[0]) : null);
                }

            } catch (e) {
                console.error("Failed to load user for edit:", e);
            }
        };
        fetchUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, user?.id, token, allDeviceList]);

    useEffect(() => {
        if (!isOpen || !editForm || allDeviceList.length === 0) return;

        const limit = Number(editForm.device_limit) || 0;
        setRemainingLimit(limit - selectedDevices.length);
    }, [isOpen, editForm, allDeviceList]);

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
                const rawDirs: any[] = dirRes.data as any[];
                const dirs: Option[] = rawDirs.map((d) => ({ id: Number(d.id), name: String(d.name) }));
                const emps: Option[] = (empRes.data as any[]).map((e) => ({ id: Number(e.id), name: String(e.name) }));

                const devs: Option[] = (devRes.data as any[]).map((d: any) => ({ id: Number(d.id), name: String(d.name) }));

                setAllGroupsList(groups);
                setAllDirectoratesList(dirs);
                setDirectorateOptionsFull(rawDirs);
                setAllEmploymentList(emps);
                setAllDeviceList(devs);
            } catch (err) {
                console.error("Error fetching dropdown data:", err);
            }
        };
        run();
    }, [token]);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) return "";
        if (!email.includes('@')) return "Email must contain @ symbol";
        if (!emailRegex.test(email)) return "Please enter a valid email address";
        return "";
    };

    const validatePhone = (phone: string) => {
        const phoneRegex = /^\+937[0-9]{8}$/;
        if (!phone) return "";
        if (!phone.startsWith('+93')) return "Phone must start with +93";
        if (!phoneRegex.test(phone)) return "Phone must be in format: +937xxxxxxxx";
        return "";
    };

    const validateMacAddress = (mac: string) => {
        if (!mac) return "";
        if (mac.length < 17) return "";
        const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
        if (!macRegex.test(mac)) return "MAC address must be in format: XX:XX:XX:XX:XX:XX";
        return "";
    };

    const formatMacAddress = (value: string) => {
        const cleaned = value.replace(/[^0-9A-Fa-f]/g, '');
        const limited = cleaned.slice(0, 12);
        const formatted = limited.match(/.{1,2}/g)?.join(':') || '';
        return formatted.toUpperCase();
    };

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

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === 'mac_address') {
            const formatted = formatMacAddress(value);
            setSelectedDevices(prev => prev.map(r => r.rowId === name ? { ...r, mac_address: formatted } : r));

            setMacError("");
            const macValidation = validateMacAddress(formatted);
            if (macValidation) {
                setMacError(macValidation);
            } else if (formatted.length >= 8) {
                if (macTimeout) {
                    clearTimeout(macTimeout);
                    setMacTimeout(null);
                }
                const timeout = setTimeout(() => checkMacExists(formatted), 500);
                setMacTimeout(timeout);
            }
            return;
        }

        if (name === 'phone') {
            // Keep only digits from the input to derive formatting
            const digitsOnly = value.replace(/\D/g, '');

            // If user cleared the field, keep it empty (prevents re-adding +93 on backspace)
            if (digitsOnly.length === 0) {
                setEditForm((prev) => ({ ...prev, [name]: '' }));
                setPhoneError('');
                return;
            }

            // Drop leading country code if user typed it; we'll add +93 ourselves
            const withoutCode = digitsOnly.startsWith('93') ? digitsOnly.slice(2) : digitsOnly;

            // Always enforce starting with 7, then allow up to 8 more digits
            // Remove a leading 7 if present to build the tail cleanly
            const tail = withoutCode.replace(/^7/, '');
            const limitedTail = tail.slice(0, 8);
            const formatted = '+937' + limitedTail;

            setEditForm((prev) => ({ ...prev, [name]: formatted }));

            setPhoneError("");
            const phoneValidation = validatePhone(formatted);
            if (phoneValidation) {
                setPhoneError(phoneValidation);
            } else if (formatted.length >= 6) {
                if (phoneTimeout) {
                    clearTimeout(phoneTimeout);
                    setPhoneTimeout(null);
                }
                const timeout = setTimeout(() => checkPhoneExists(formatted), 500);
                setPhoneTimeout(timeout);
            }
            return;
        }

        if (name === 'email') {
            setEditForm((prev) => ({ ...prev, [name]: value }));

            setEmailError("");
            const emailValidation = validateEmail(value);
            if (emailValidation) {
                setEmailError(emailValidation);
            } else if (value.includes('@') && value.length >= 5) {
                if (emailTimeout) {
                    clearTimeout(emailTimeout);
                    setEmailTimeout(null);
                }
                const timeout = setTimeout(() => checkEmailExists(value), 500);
                setEmailTimeout(timeout);
            }
            return;
        }

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
        selectedDevices.length > 0 &&
        !emailError &&
        !phoneError &&
        !macError &&
        !isCheckingEmail &&
        !isCheckingPhone &&
        !isCheckingMac;

    const handleSave = async () => {
        if (!user) return;

        const devices = selectedDevices.map(row => ({
            device_type_id: row.device_type_id,
            mac_address: formatMacAddress(row.mac_address).toUpperCase(),
        }));
        const device_type_ids = selectedDevices.map(row => row.device_type_id);

        const payload: any = {
            ...editForm,
            status: Number((editForm as any).status ?? user?.status ?? 0),
            device_limit: Number((editForm as any).device_limit ?? 0),
            directorate_id: selectedDirectorate?.id,
            group_id: selectedGroup?.id,
            employee_type_id: selectedEmployment?.id,
            deputy: deputyMinistryName,
            device_type_ids,
            devices,
        };

        console.log('Update payload', { device_type_ids, devices });

        try {
            await axios.put(`${route}/internet/${user.id}`, payload, { headers: { Authorization: `Bearer ${token}` } });
            const Toast = Swal.mixin({
                toast: true,
                position: "bottom-end",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                showCloseButton: true,
                iconColor: "#22c55e",
                background: "#0f172a",
                color: "#e2e8f0",
                customClass: {
                    popup: "rounded-2xl shadow-2xl ring-1 ring-white/10",
                    title: "text-sm font-medium tracking-wide",
                    timerProgressBar: "bg-white/40",
                },
                didOpen: (toast) => {
                    toast.addEventListener("mouseenter", Swal.stopTimer);
                    toast.addEventListener("mouseleave", Swal.resumeTimer);
                },
            });

            Toast.fire({
                title: "User updated successfully!",
                icon: "success",
            });
            onSave({ ...payload, id: user.id });
            onClose();
        } catch (err) {
            console.error("Update failed:", err);
            const Toast = Swal.mixin({
                toast: true,
                position: "bottom-end",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                showCloseButton: true,
                iconColor: "#22c55e",
                background: "#0f172a",
                color: "#e2e8f0",
                customClass: {
                    popup: "rounded-2xl shadow-2xl ring-1 ring-white/10",
                    title: "text-sm font-medium tracking-wide",
                    timerProgressBar: "bg-white/40",
                },
                didOpen: (toast) => {
                    toast.addEventListener("mouseenter", Swal.stopTimer);
                    toast.addEventListener("mouseleave", Swal.resumeTimer);
                },
            });

            Toast.fire({
                title: "Failed to update user. Please check required fields and try again!",
                icon: "error",
            });
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

    const genRowId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const addDeviceType = (deviceTypeId: number) => {
        if (remainingLimit <= 0) return;
        setSelectedDevices(prev => ([...prev, { rowId: genRowId(), device_type_id: deviceTypeId, mac_address: "" }]));
    };
    const removeDeviceRow = (rowId: string) => {
        setSelectedDevices(prev => prev.filter(row => row.rowId !== rowId));
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

    const handleSelectDirectorate = (opt: Option | null) => {
        setSelectedDirectorate(opt);
        if (opt) {
            const full = directorateOptionsFull.find((fd: any) => Number(fd.id) === Number(opt.id));
            const depId = full?.directorate_id;
            setDeputyMinistryId(depId != null ? Number(depId) : null);
        } else {
            setDeputyMinistryId(null);
        }
    };

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

                {/* Enhanced Body */}
                <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50">
                    <div className="p-8">
                        <Tab.Group>
                            <Tab.List className="flex gap-1 border-b border-slate-200 pb-2 mb-8 overflow-x-auto bg-white rounded-2xl p-2 shadow-sm sticky top-0 z-10">
                                {["Personal", "Organization", "Devices"].map((tab) => (
                                    <Tab
                                        key={tab}
                                        className={({ selected }) =>
                                            `px-6 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${selected
                                                ? "bg-gradient-to-r from-slate-800 to-slate-600 text-blue-300 shadow-lg transform scale-105"
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
                                                icon={<User className="w-5 h-5 text-blue-300 bg-slate-800 p-1 rounded-full" />}
                                                onChange={handleEditChange}
                                            />
                                            <InputWithIcon
                                                label="Last Name"
                                                name="lastname"
                                                value={editForm.lastname || ""}
                                                placeholder="Enter last name"
                                                icon={<UserRound className="w-5 h-5 text-blue-300 bg-slate-800 p-1 rounded-full" />}
                                                onChange={handleEditChange}
                                            />
                                            <InputWithIcon
                                                label="Username"
                                                name="username"
                                                value={editForm.username || ""}
                                                placeholder="Enter username"
                                                icon={<BadgeCheck className="w-5 h-5 text-blue-300 bg-slate-800 p-1 rounded-full" />}
                                                onChange={handleEditChange}
                                            />
                                            <InputWithIcon
                                                label="Email"
                                                name="email"
                                                type="email"
                                                value={editForm.email || ""}
                                                placeholder="Enter email address"
                                                icon={<Mail className="w-5 h-5 text-blue-300 bg-slate-800 p-1 rounded-full" />}
                                                onChange={handleEditChange}
                                                error={emailError}
                                                isLoading={isCheckingEmail}
                                            />
                                            <InputWithIcon
                                                label="Phone"
                                                name="phone"
                                                value={editForm.phone || ""}
                                                placeholder="+937xxxxxxxx"
                                                icon={<Phone className="w-5 h-5 text-blue-300 bg-slate-800 p-1 rounded-full" />}
                                                onChange={handleEditChange}
                                                error={phoneError}
                                                isLoading={isCheckingPhone}
                                            />
                                            <InputWithIcon
                                                label="Position"
                                                name="position"
                                                value={editForm.position || ""}
                                                placeholder="Enter job position"
                                                icon={<BriefcaseBusiness className="w-5 h-5 text-blue-300 bg-slate-800 p-1 rounded-full" />}
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
                                                setSelected={handleSelectDirectorate}
                                                filtered={filteredDirectorates}
                                                query={qDirectorate}
                                                setQuery={setQDirectorate}
                                                icon={<Building2 className="w-5 h-5 text-blue-300 bg-slate-800 p-1 rounded-full" />}
                                            />
                                            <ComboBoxField
                                                label="Group"
                                                selected={selectedGroup}
                                                setSelected={setSelectedGroup}
                                                filtered={filteredGroups}
                                                query={qGroup}
                                                setQuery={setQGroup}
                                                icon={<Users className="w-5 h-5 text-blue-300 bg-slate-800 p-1 rounded-full" />}
                                            />
                                            <ComboBoxField
                                                label="Employment Type"
                                                selected={selectedEmployment}
                                                setSelected={setSelectedEmployment}
                                                filtered={filteredEmployment}
                                                query={qEmployment}
                                                setQuery={setQEmployment}
                                                icon={<BriefcaseBusiness className="w-5 h-5 text-blue-300 bg-slate-800 p-1 rounded-full" />}
                                            />
                                            <InputWithIcon
                                                label="Deputy Ministry"
                                                name="deputyMinistry"
                                                value={deputyMinistryName}
                                                placeholder="Deputy Ministry"
                                                icon={<Landmark className="w-5 h-5 text-blue-300 bg-slate-800 p-1 rounded-full" />}
                                                onChange={() => { /* non-editable */ }}
                                                disabled={true}
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
                                                <HardDrive className="w-5 h-5 text-blue-300 bg-slate-800 p-1 rounded-full" />
                                                Device Management
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <InputWithIcon
                                                    label="Device Limit"
                                                    name="device_limit"
                                                    type="number"
                                                    value={editForm.device_limit ?? ""}
                                                    placeholder="Number of devices allowed"
                                                    icon={<HardDrive className="w-5 h-5 text-blue-300 bg-slate-800 p-1 rounded-full" />}
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
                                                    const isSelected = selectedDevices.some(row => row.device_type_id === deviceType.id);
                                                    const canSelect = remainingLimit > 0;

                                                    return (
                                                        <button
                                                            key={deviceType.id}
                                                            onClick={() => addDeviceType(deviceType.id)}
                                                            disabled={!canSelect}
                                                            className={`p-4 rounded-xl border-2 transition-all duration-200 ${isSelected
                                                                ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 shadow-md transform scale-105'
                                                                : canSelect
                                                                    ? 'border-slate-200 hover:border-blue-400 hover:bg-blue-50'
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
                                        {selectedDevices.length > 0 && (
                                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
                                                <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                                                    <Check className="w-5 h-5 text-blue-600" />
                                                    Selected Device Types
                                                </h3>
                                                <div className="space-y-3">
                                                    {selectedDevices.map((row) => {
                                                        const deviceType = allDeviceList.find(dt => dt.id === row.device_type_id);
                                                        if (!deviceType) return null;

                                                        return (
                                                            <div key={row.rowId} className="flex items-center justify-between bg-white rounded-xl p-4 border border-blue-100 shadow-sm">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="p-2 bg-blue-100 rounded-lg">
                                                                        {getDeviceIcon(deviceType.name)}
                                                                    </div>
                                                                    <span className="font-medium text-slate-900">{deviceType.name}</span>
                                                                </div>
                                                                {/* MAC Address */}
                                                                <div className="mt-4">
                                                                    <InputWithIcon
                                                                        label="MAC Address"
                                                                        name={`mac_address_${row.rowId}`}
                                                                        value={row.mac_address || ""}
                                                                        placeholder="XX:XX:XX:XX:XX:XX"
                                                                        icon={<HardDrive className="w-5 h-5 text-blue-300 bg-slate-800 p-1 rounded-full" />}
                                                                        onChange={e => {
                                                                            const formatted = formatMacAddress(e.target.value);
                                                                            setSelectedDevices(prev => prev.map(r => r.rowId === row.rowId ? { ...r, mac_address: formatted } : r));
                                                                        }}
                                                                    />
                                                                </div>

                                                                <button
                                                                    onClick={() => removeDeviceRow(row.rowId)}
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
                                                            <div className="text-2xl font-bold text-blue-600">{selectedDevices.length}</div>
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
                            className={`px-8 py-3 rounded-xl text-blue-300 text-sm font-medium inline-flex items-center gap-2 transition-all duration-200 ${canSave
                                ? "bg-gradient-to-r from-slate-800 to-slate-600 hover:to-slate-400 shadow-lg hover:shadow-xl transform hover:scale-105"
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