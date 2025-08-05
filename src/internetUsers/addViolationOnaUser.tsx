// src/internetUsers/addvaiolationonauser.tsx
import React, { useEffect, useState } from "react";
import APISearchableComboBox from "../components/APISearchableComboBox";
import { route } from "../config";

const AddVaiolationOnAUser: React.FC = () => {
    const [form, setForm] = useState({
        userId: "",
        violationType: "",
        status: "",
        numberOfViolations: "1",
        comment: "",
    });


    const [violationTypes, setViolationTypes] = useState<{ id: number; name: string }[]>([]);

    useEffect(() => {
        fetch(`${route}/violation`)
            .then(res => res.json())
            .then(res => setViolationTypes(res.data || []));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const [, setSelectedUser] = useState<{ value: string | number; label: string } | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Replace this with your POST logic if needed
        console.log("Submitted violation:", form);
        alert("Violation submitted! (Check console for data)");
    };

    return (
        <div className="max-w-xs mx-auto mt-8 p-4 border border-gray-200 rounded-lg bg-white shadow space-y-3">
            <h2 className="text-lg font-semibold mb-2 text-center">Add Violation On A User</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
                <APISearchableComboBox
                    apiUrl={`${route}/internet`}
                    labelField="username"
                    onChange={(selectedUser) => {
                        setSelectedUser(selectedUser);
                        setForm({ ...form, userId: String(selectedUser.value) });
                    }}
                />
                <select
                    name="violationType"
                    value={form.violationType}
                    onChange={handleChange}
                    className="block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 text-sm"
                >
                    <option value="">Select violation type</option>
                    {violationTypes.map(v => (
                        <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                </select>
                <select
                    name="numberOfViolations"
                    value={form.numberOfViolations}
                    onChange={handleChange}
                    className="block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 text-sm"
                >
                    <option value="1">1</option>
                    <option value="2">2</option>
                </select>
                <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 text-sm"
                >
                    <option value="">Select status</option>
                    <option value="1">Active</option>
                    <option value="0">Deactive</option>
                </select>
                <textarea
                    name="comment"
                    value={form.comment}
                    onChange={handleChange}
                    rows={2}
                    className="block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 text-sm resize-none"
                    placeholder="Enter comment"
                />
                <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 text-white rounded-md font-semibold text-sm hover:bg-blue-700 transition"
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default AddVaiolationOnAUser;