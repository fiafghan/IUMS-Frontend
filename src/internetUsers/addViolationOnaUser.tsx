import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { route } from "../config";
import GradientSidebar from "../components/Sidebar";

interface ViolationType {
    id: number;
    name: string;
}

interface InternetUser {
    id: number;
    username: string;
}

export default function AddViolationForm() {
    const [form, setForm] = useState({
        internet_user_id: "",
        violation_type_id: "",
        comment: "",
    });

    const [violationTypes, setViolationTypes] = useState<ViolationType[]>([]);
    const [usersOptions, setUsersOptions] = useState<{ value: string; label: string }[]>([]);

    const [message, setMessage] = useState("");

    useEffect(() => {
        axios.get(`${route}/internet`)
            .then(res => {
                console.log("Internet users response:", res.data);
                const options = (res.data || []).map((user: InternetUser) => ({
                    value: String(user.id),
                    label: user.username,
                }));
                setUsersOptions(options);
            })
            .catch(() => setUsersOptions([]));

        axios.get(`${route}/violation`)
            .then(res => setViolationTypes(res.data.data || []))
            .catch(() => setViolationTypes([]));
    }, []);

    // وقتی کاربر در select انتخاب شد
    const handleUserChange = (selectedOption: { value: string; label: string } | null) => {
        setForm(prev => ({
            ...prev,
            internet_user_id: selectedOption ? selectedOption.value : "",
        }));
    };

    // وقتی نوع تخلف تغییر کرد
    const handleViolationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setForm(prev => ({
            ...prev,
            violation_type_id: e.target.value,
        }));
    };

    // تغییر در فیلد توضیحات
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
            const res = await axios.post(`${route}/violationOnaUser`, payload);
            if (res.status === 201) {
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
        <div  className="flex min-h-screen">
            <GradientSidebar />
        <div className="max-w-md mx-auto mt-5 p-5 bg-white rounded w-200">
            <h2 className="text-2xl font-bold mb-10 text-center bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
                Add Violation On A User
            </h2>

            <form onSubmit={handleSubmit} className="space-y-2">
                <div>
                    <label className="block mb-1 font-semibold">Internet User</label>
                    <Select
                        options={usersOptions}
                        onChange={handleUserChange}
                        value={usersOptions.find(opt => opt.value === form.internet_user_id) || null}
                        placeholder="Search and select user..."
                        isClearable
                    />
                </div>

                <div>
                    <label className="block mb-1 font-semibold">Violation Type</label>
                    <select
                        name="violation_type_id"
                        value={form.violation_type_id}
                        onChange={handleViolationChange}
                        required
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                    >
                        <option value="">Select violation type</option>
                        {violationTypes.map(v => (
                            <option key={v.id} value={v.id}>
                                {v.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block mb-1 font-semibold">Comment (optional)</label>
                    <textarea
                        name="comment"
                        value={form.comment}
                        onChange={handleCommentChange}
                        rows={3}
                        placeholder="Enter comment"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-400 to-blue-300 text-white py-2 rounded font-semibold hover:opacity-90 transition"
                >
                    Submit Violation
                </button>

                {message && (
                    <p className="text-center mt-3 font-medium text-red-600">{message}</p>
                )}
            </form>
        </div>
        </div>
    );
}
