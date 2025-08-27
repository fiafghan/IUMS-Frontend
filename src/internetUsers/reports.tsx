import { useState, useRef } from "react";
import { FileText, BarChart2, Search } from "lucide-react";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar
} from "recharts";
import { useReactToPrint } from "react-to-print";
import GradientSidebar from "../components/Sidebar";
import axios from "axios";
import { route } from "../config";

export default function Reports() {
    const [activeTab, setActiveTab] = useState<"individual" | "general">("individual");
    const [username, setUsername] = useState("");
    const [userData, setUserData] = useState<any | null>(null);
    const [generalData, setGeneralData] = useState<any[] | null>(null);
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: "IUMS-Report",
    });


    const handleSearchIndividual = async () => {
        if (!username.trim()) {
            setUserData(null);
            return alert("Please enter a username");
        }

        try {
            const { token } = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
            if (!token) return alert("User is not logged in or token missing");

            const res = await axios.get(`${route}/reports/individual`, {
                params: { username },
                headers: { Authorization: `Bearer ${token}` },
            });

            const apiData = res.data?.data;

            if (!apiData || !apiData.name) {
                setUserData(null);
                return alert("User not found or incomplete data");
            }

            setUserData({
                name: apiData.name || "",
                lastname: apiData.lastname || "",
                directorate: apiData.directorate || "",
                deputyMinistry: apiData.deputy || "",
                violations: apiData.violations ?? 0,
                trend: Array.isArray(apiData.trend)
                    ? apiData.trend.map((t: any) => ({
                        date: t.date || "",
                        violations: t.violations ?? 0,
                    }))
                    : [],
            });
        } catch (err: any) {
            console.error("Error fetching individual report:", err);
            setUserData(null);
            alert(err.response?.data?.message || "Failed to fetch individual report");
        }
    };



    const handleSearchGeneral = async () => {
        try {
            const res = await axios.get(`${route}/reports/general`);
            setGeneralData(res.data);
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to fetch general report");
        }
    };


    // Compute max and min violations for General Report
    const maxDirectorate = generalData
        ? generalData.reduce((max, d) => (d.violations > max.violations ? d : max), generalData[0])
        : null;
    const minDirectorate = generalData
        ? generalData.reduce((min, d) => (d.violations < min.violations ? d : min), generalData[0])
        : null;

    // -----------------------------
    // JSX
    // -----------------------------
    return (
        <div className="min-h-screen flex bg-white">
            <GradientSidebar />
            <div className="flex justify-center items-center min-h-screen bg-slate-200 mx-auto mt-5 mb-5">
                <div
                    className="bg-white shadow-xl overflow-hidden"
                    style={{ width: "210mm", height: "297mm" }}
                    ref={printRef}
                >
                    <div className="p-6 border-b border-slate-300">
                        <h1 className="text-3xl font-bold print:text-center text-slate-700">
                            Reports
                        </h1>
                        <p className="text-slate-600 print:hidden">View and manage all reports here.</p>
                    </div>

                    <div className="flex gap-4 px-6 pt-4 border-b border-slate-200">
                        <button
                            onClick={() => setActiveTab("individual")}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${activeTab === "individual"
                                ? "text-slate-900 border-b-2 border-slate-700"
                                : "text-slate-500 hover:text-slate-600"
                                }`}
                        >
                            <FileText className="w-5 h-5" />
                            Individual Reports
                        </button>

                        <button
                            onClick={() => setActiveTab("general")}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${activeTab === "general"
                                ? "text-slate-900 border-b-2 border-slate-700"
                                : "text-slate-500 hover:text-slate-700"
                                }`}
                        >
                            <BarChart2 className="w-5 h-5" />
                            General Reports
                        </button>
                    </div>

                    <div className="p-6 overflow-y-auto h-[calc(297mm-130px)]">
                        {/* Individual Reports */}
                        {activeTab === "individual" && (
                            <div>
                                <h2 className="text-xl font-semibold mb-4 text-slate-800">
                                    Individual Reports
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Start Date
                                        </label>
                                        <input type="date" className="w-full border border-slate-300 rounded-lg px-3 py-2 print:border-none print:shadow-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            End Date
                                        </label>
                                        <input type="date" className="w-full border border-slate-300 rounded-lg px-3 py-2 print:border-none print:shadow-none" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Username
                                        </label>
                                        <div className="flex">
                                            <input
                                                type="text"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                placeholder="Enter username..."
                                                className="flex-1 border border-slate-300 rounded-l-lg px-3 py-2"
                                            />
                                            <button
                                                onClick={handleSearchIndividual}
                                                className="px-4 bg-slate-700 text-white rounded-r-lg print:hidden hover:bg-slate-500 flex items-center gap-2"
                                            >
                                                <Search className="w-4 h-4" /> Search
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {userData ? (
                                    <div className="mb-6 bg-slate-50 p-4 rounded-xl shadow">
                                        <h3 className="text-lg font-semibold mb-2 text-slate-800">
                                            User Information
                                        </h3>
                                        <p><span className="font-medium">Name:</span> {userData.name}</p>
                                        <p><span className="font-medium">Lastname:</span> {userData.lastname}</p>
                                        <p><span className="font-medium">Directorate:</span> {userData.directorate}</p>
                                        <p><span className="font-medium">Deputy Ministry:</span> {userData.deputyMinistry}</p>
                                        <p><span className="font-medium">Number of Violations:</span> {userData.violations}</p>
                                    </div>
                                ) : (<p>No user data available.</p>)}

                                {userData && (
                                    <div className="bg-slate-50 p-4 rounded-xl shadow h-80">
                                        <h3 className="text-lg font-semibold mb-4 text-slate-800">
                                            Violations Trend
                                        </h3>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={userData.trend}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="date" />
                                                <YAxis />
                                                <Tooltip />
                                                <Line type="monotone" dataKey="violations" stroke="#020b29" strokeWidth={2} dot={{ r: 4 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* General Reports */}
                        {activeTab === "general" && (
                            <div>
                                <h2 className="text-xl font-semibold mb-4 text-slate-800">
                                    General Reports
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Start Date
                                        </label>
                                        <input type="date" className="w-full border border-slate-300 rounded-lg px-3 py-2 print:border-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            End Date
                                        </label>
                                        <input type="date" className="w-full border border-slate-300 rounded-lg px-3 py-2 print:border-none" />
                                    </div>
                                    <div className="flex items-end print:hidden">
                                        <button
                                            onClick={handleSearchGeneral}
                                            className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-500 flex items-center gap-2"
                                        >
                                            <Search className="w-4 h-4" /> Search
                                        </button>
                                    </div>
                                </div>

                                {generalData && (
                                    <div className="mb-6 bg-slate-50 p-4 rounded-xl shadow">
                                        <h3 className="text-lg font-semibold mb-3 text-slate-800">
                                            Directorate Violations Summary
                                        </h3>
                                        <ul className="list-disc ml-6 mb-3 text-slate-700">
                                            {generalData.map((d, i) => (
                                                <li key={i}>
                                                    {d.directorate}: <span className="font-medium">{d.violations}</span> violations
                                                </li>
                                            ))}
                                        </ul>
                                        {maxDirectorate && (
                                            <p className="text-green-700 font-medium">
                                                Maximum Violations: {maxDirectorate.directorate} ({maxDirectorate.violations})
                                            </p>
                                        )}
                                        {minDirectorate && (
                                            <p className="text-red-700 font-medium">
                                                Minimum Violations: {minDirectorate.directorate} ({minDirectorate.violations})
                                            </p>
                                        )}
                                    </div>
                                )}

                                {generalData && (
                                    <div className="bg-slate-50 p-4 rounded-xl shadow h-80">
                                        <h3 className="text-lg font-semibold mb-4 text-slate-800">
                                            Violations per Directorate
                                        </h3>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={generalData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="directorate" />
                                                <YAxis />
                                                <Tooltip />
                                                <Bar dataKey="violations" fill="#020b29" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="mt-10 flex">
                            <button
                                onClick={handlePrint}
                                className="px-6 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-500 print:hidden"
                            >
                                Print Report
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
