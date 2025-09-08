import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import AsyncSelect from "react-select/async";
import { route } from "../config";
import GradientSidebar from "../components/Sidebar";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, User, Shield, FileText, AlertCircle, CheckCircle } from "lucide-react";

interface ViolationType {
    id: number;
    name: string;
}


export default function AddViolationForm() {
    const [form, setForm] = useState({
        internet_user_id: "",
        violation_type_id: "",
        comment: "",
    });

    const [violationTypes, setViolationTypes] = useState<ViolationType[]>([]);
    const [selectedUserOption, setSelectedUserOption] = useState<{ value: string; label: string } | null>(null);
    const searchTimerRef = useRef<number | null>(null);

    const [message, setMessage] = useState("");

    useEffect(() => {
        const { token } = JSON.parse(localStorage.getItem("loggedInUser") || "{}");

        axios.get(`${route}/violation`,{headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }})
            .then(res => setViolationTypes(res.data.data || []))
            .catch(() => setViolationTypes([]));
    }, []);

    const handleUserChange = (selectedOption: { value: string; label: string } | null) => {
        setSelectedUserOption(selectedOption);
        setForm(prev => ({
            ...prev,
            internet_user_id: selectedOption ? selectedOption.value : "",
        }));
    };

    // Async loader with debounce; queries backend and limits results to reduce payload/render cost
    const loadUserOptions = (inputValue: string, callback: (options: { value: string; label: string }[]) => void) => {
        // Require minimal input to avoid loading everything
        if (!inputValue || inputValue.trim().length < 2) {
            callback([]);
            return;
        }
        // Debounce network calls
        if (searchTimerRef.current) window.clearTimeout(searchTimerRef.current);
        searchTimerRef.current = window.setTimeout(async () => {
            try {
                const { token } = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
                // Call backend with query so server filters and we don't fetch all users
                const res = await axios.get(`${route}/getSpecifiedUserForViolation`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { search: inputValue }
                });

                // Support multiple possible response shapes
                const raw = Array.isArray(res.data)
                    ? res.data
                    : Array.isArray(res.data?.data)
                        ? res.data.data
                        : Array.isArray(res.data?.user_violations)
                            ? res.data.user_violations
                            : [];

                // Fallback client-side filter in case backend ignores the search param
                const norm = inputValue.toLowerCase();
                const filtered = raw.filter((u: any) => String(u.username || "").toLowerCase().includes(norm));

                const options = filtered
                    .slice(0, 20) // cap results for performance
                    .map((u: any) => ({ value: String(u.id), label: String(u.username) }));

                callback(options);
            } catch (e) {
                callback([]);
            }
        }, 300);
    };

    const handleViolationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setForm(prev => ({
            ...prev,
            violation_type_id: e.target.value,
        }));
    };

    const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setForm(prev => ({
            ...prev,
            comment: e.target.value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        if (!form.internet_user_id || !form.violation_type_id) {
            setMessage("Please select user and violation type.");
            return;
        }

        try {
            const payload = {
                internet_user_id: Number(form.internet_user_id),
                violation_type_id: Number(form.violation_type_id),
                comment: form.comment,
            };
            const { token } = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
            const res = await axios.post(`${route}/violationOnaUser`, payload,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            if (res.status === 201) {
               const Toast = Swal.mixin({
                       toast: true,
                       position: "bottom-end",          // bottom-right
                       showConfirmButton: false,        // no OK button
                       timer: 2000,                     // auto close (ms)
                       timerProgressBar: true,
                       showCloseButton: true,           // small "x" to dismiss
                       iconColor: "#22c55e",            // Tailwind green-500
                       background: "#0f172a",           // slate-900
                       color: "#e2e8f0",                // slate-300
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
                       title: "The Violation was successfully added!",
                       icon: "success",
                     });
               
                setMessage("Violation created successfully!");
                setForm({ internet_user_id: "", violation_type_id: "", comment: "" });
            } else {
                setMessage("Failed to create violation.");
            }
        } catch {
            setMessage("Server error occurred.");
        }
    };

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-red-50 to-orange-50">
            <div className="fixed top-0 left-0 bottom-0 w-64 border-r border-slate-200 bg-white shadow-lg z-20">
                <GradientSidebar />
            </div>

            <main className="flex-1 ml-64 p-8 overflow-auto">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-4 bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl shadow-lg">
                            <AlertTriangle className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-red-900 to-orange-900 bg-clip-text text-transparent">
                                Add Violation
                            </h1>
                            <p className="text-slate-600 mt-1 font-medium">
                                Record violations for internet users
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Main Form Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="max-w-2xl mx-auto"
                >
                    <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
                        {/* Card Header */}
                        <div className="px-8 py-6 bg-gradient-to-r from-red-600 to-orange-600">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/10 rounded-xl">
                                    <Shield className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Add Violation on User</h2>
                                    <p className="text-red-100 text-sm">Select user and violation details</p>
                                </div>
                            </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-8">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* User Selection */}
                                <motion.div
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5, duration: 0.5 }}
                                    className="space-y-3"
                                >
                                    <label className="block text-sm font-semibold text-slate-700 items-center gap-2">
                                        <User className="w-4 h-4 text-red-600" />
                                        Select Internet User
                                    </label>
                                    <div className="relative">
                                        <AsyncSelect
                                            cacheOptions
                                            defaultOptions={false}
                                            loadOptions={loadUserOptions}
                                            onChange={handleUserChange}
                                            value={selectedUserOption}
                                            placeholder="Search users..."
                                            components={{ DropdownIndicator: null, IndicatorSeparator: null }}
                                            isClearable
                                            className="react-select-container"
                                            classNamePrefix="react-select"
                                            styles={{
                                                control: (provided, state) => ({
                                                    ...provided,
                                                    backgroundColor: '#f8fafc',
                                                    borderColor: state.isFocused ? '#ef4444' : '#e2e8f0',
                                                    borderRadius: '12px',
                                                    padding: '8px 4px',
                                                    borderWidth: '1px',
                                                    boxShadow: state.isFocused ? '0 0 0 2px rgba(239, 68, 68, 0.2)' : 'none',
                                                    '&:hover': {
                                                        borderColor: '#cbd5e1'
                                                    }
                                                }),
                                                option: (provided, state) => ({
                                                    ...provided,
                                                    backgroundColor: state.isSelected ? '#ef4444' : state.isFocused ? '#fef2f2' : 'white',
                                                    color: state.isSelected ? 'white' : '#374151',
                                                    padding: '12px 16px',
                                                    cursor: 'pointer'
                                                }),
                                                menu: (provided) => ({
                                                    ...provided,
                                                    borderRadius: '12px',
                                                    border: '1px solid #e2e8f0',
                                                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                                                })
                                            }}
                                        />
                                    </div>
                                </motion.div>

                                {/* Violation Type Selection */}
                                <motion.div
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.7, duration: 0.5 }}
                                    className="space-y-3"
                                >
                                    <label className="block text-sm font-semibold text-slate-700 items-center gap-2">
                                        <AlertCircle className="w-4 h-4 text-red-600" />
                                        Violation Type
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="violation_type_id"
                                            value={form.violation_type_id}
                                            onChange={handleViolationChange}
                                            required
                                            className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 hover:bg-white hover:border-slate-300"
                                        >
                                            <option value="">Select violation type</option>
                                            {violationTypes.map(v => (
                                                <option key={v.id} value={v.id}>
                                                    {v.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </motion.div>

                                {/* Comment Field */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.9, duration: 0.5 }}
                                    className="space-y-3"
                                >
                                    <label className="block text-sm font-semibold text-slate-700 items-center gap-2">
                                        <FileText className="w-4 h-4 text-red-600" />
                                        Comment (Optional)
                                    </label>
                                    <textarea
                                        name="comment"
                                        value={form.comment}
                                        onChange={handleCommentChange}
                                        rows={4}
                                        placeholder="Enter additional details about the violation..."
                                        className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 hover:bg-white hover:border-slate-300 resize-none"
                                    />
                                </motion.div>

                                {/* Message Display */}
                                <AnimatePresence>
                                    {message && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className={`p-4 rounded-xl border ${
                                                message.includes("successfully") 
                                                    ? "bg-green-50 border-green-200 text-green-700"
                                                    : "bg-red-50 border-red-200 text-red-700"
                                            }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                {message.includes("successfully") ? (
                                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                                ) : (
                                                    <AlertCircle className="w-5 h-5 text-red-600" />
                                                )}
                                                <span className="text-sm font-medium">{message}</span>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Submit Button */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.1, duration: 0.5 }}
                                    className="pt-4"
                                >
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={!form.internet_user_id || !form.violation_type_id}
                                        className={`w-full py-4 rounded-xl font-medium transition-all duration-200 ${
                                            !form.internet_user_id || !form.violation_type_id
                                                ? "bg-slate-300 cursor-not-allowed text-slate-500"
                                                : "bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl"
                                        }`}
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <AlertTriangle className="w-5 h-5" />
                                            Submit Violation
                                        </div>
                                    </motion.button>
                                </motion.div>
                            </form>
                        </div>
                    </div>

                    {/* Information Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.3, duration: 0.6 }}
                        className="mt-8 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
                    >
                        <div className="px-6 py-4 bg-gradient-to-r from-slate-100 to-slate-200">
                            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-slate-600" />
                                Violation Process
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="space-y-3 text-sm text-slate-600">
                                <p>• Select the user who committed the violation</p>
                                <p>• Choose the appropriate violation type</p>
                                <p>• Add optional comments for context</p>
                                <p>• Submit to record the violation</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </main>
        </div>
    );
}
