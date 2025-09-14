import { useState, useRef, useEffect } from "react";
import { FileText, BarChart2, Home } from "lucide-react";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar
} from "recharts";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import { route } from "../config";
import Select from "react-select";
import { useNavigate } from "react-router-dom";



const AngleTick = ({ x, y, payload }: any) => (
    <g transform={`translate(${x},${y})`}>
        <text dy={12} textAnchor="end" transform="rotate(-90)" fontSize={8}>
            {payload.value}
        </text>
    </g>
);

export default function Reports() {
    const [activeTab, setActiveTab] = useState<"individual" | "general">("individual");
    const [userData, setUserData] = useState<any | null>(null);
    const [generalData, setGeneralData] = useState<any[] | null>(null);
    const printRef = useRef<HTMLDivElement>(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [generalStartDate, setGeneralStartDate] = useState("");
    const [generalEndDate, setGeneralEndDate] = useState("");
    const [userOptions, setUserOptions] = useState<{ value: string; label: string }[]>([]);
    const [selectedUsername, setSelectedUsername] = useState<{ value: string; label: string } | null>(null);

    const navigate = useNavigate();


    const fetchUsernames = async () => {
        try {
            const { token } = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
            const headers = { Authorization: `Bearer ${token}` } as const;

            let page = 1;
            const usernames: string[] = [];
            while (true) {
                const res = await axios.get(`${route}/internet?page=${page}`, { headers });
                // Support both raw array and Laravel paginator shapes
                const payload = Array.isArray(res.data)
                    ? res.data
                    : (Array.isArray(res.data?.data) ? res.data.data : []);

                for (const user of payload) {
                    const u = String(user?.username || '').trim();
                    if (u && !usernames.includes(u)) usernames.push(u);
                }

                const lastPage = (res.data && typeof res.data === 'object')
                    ? (res.data.last_page ?? res.data?.meta?.last_page)
                    : undefined;
                if (!lastPage || page >= Number(lastPage)) break;
                page += 1;
            }

            const options = usernames.sort((a, b) => a.localeCompare(b)).map(u => ({ value: u, label: u }));
            setUserOptions(options);
        } catch (err) {
            console.error("Error fetching usernames:", err);
        }
    };

    useEffect(() => {
        fetchUsernames();
    }, []);


    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: "IUMS-Report",
    });


    const handleSearchIndividual = async (usernameValue: string) => {
        if (!usernameValue.trim()) return alert("Please enter a username");

        try {
            const { token } = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
            const res = await axios.get(`${route}/reports/individual`, {
                params: { username: usernameValue, startDate, endDate },
                headers: { Authorization: `Bearer ${token}` }
            });

            const apiData = res.data?.data;
            if (!apiData || !apiData.name) return alert("User not found or incomplete data");

            setUserData({
                name: apiData.name || "",
                lastname: apiData.lastname || "",
                directorate: apiData.directorate || "",
                deputyMinistry: apiData.deputyMinistry || "",
                violations: apiData.violations ?? 0,
                trend: Array.isArray(apiData.trend)
                    ? apiData.trend.map((t: any) => ({
                        date: t.date || "",
                        violations: t.violations ?? 0,
                    }))
                    : [],
            });
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to fetch individual report");
        }
    };





    const handleSearchGeneral = async () => {
        try {
            const { token } = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
            const res = await axios.get(`${route}/reports/general`, {
                params: { startDate: generalStartDate, endDate: generalEndDate },
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            });
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

    return (
        <div className="min-h-screen flex justify-center items-center bg-white">
            <div className="flex max-h-screen bg-slate-200 mx-auto mt-5 mb-5">

                <div
                    className="bg-white shadow-sm"
                    style={{ width: "210mm", height: "297mm" }}
                    ref={printRef}
                >
                    <div className="relative p-8 border-b border-slate-300 bg-gradient-to-r from-slate-50 via-white to-slate-50 shadow-sm">
                        <style>
                            {`
                                @media print {
                                    @page {
                                    size: A4 portrait;
                                    margin: 0.5mm;
                                    }
                                }
                                `}
                        </style>
                        {/* Decorative gradient bar */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-slate-700 via-slate-900 to-slate-700"></div>

                        {/* Logos Section */}
                        <div className="absolute top-3 left-6 flex flex-col items-center">
                            <img src="/emirate.png" alt="Left Logo" className="w-16 h-16 object-contain" />
                            <span className="mt-1 text-xs font-semibold text-slate-700 tracking-wide">
                                Islamic Emirate of Afghanistan
                            </span>
                        </div>

                        <div className="absolute top-3 right-6 flex flex-col items-center">
                            <img src="/moph.png" alt="Right Logo" className="w-16 h-16 object-contain" />
                            <span className="mt-1 text-xs font-semibold text-slate-700 tracking-wide">
                                Ministry of Public Health
                            </span>
                        </div>

                        {/* Header Content */}
                        <div className="flex flex-col items-center text-center">
                            {/* Main Title */}
                            <h1 className="text-xl font-extrabold bg-gradient-to-r from-slate-800 via-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight flex items-center gap-3 drop-shadow-sm">
                                Information Technology Directorate
                            </h1>

                            {/* Subtitle */}
                            <p className="mt-3 text-sm text-slate-600 tracking-wide font-medium">
                                Network and System Department
                            </p>
                            <p className="mt-3 text-sm text-slate-600 tracking-wide font-medium">
                                IUMS Violations Report
                            </p>

                            {/* Underline Accent */}
                            <div className="mt-4 h-1.5 w-36 bg-gradient-to-r from-slate-800 via-slate-400 to-slate-800 rounded-full shadow-md"></div>
                        </div>
                    </div>

                    <div className="flex gap-4 px-6 pt-4 border-b border-slate-200">
                        <button
                            onClick={() => setActiveTab("individual")}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${activeTab === "individual"
                                ? "text-slate-900 border-b-2 border-slate-700"
                                : "text-slate-500 hover:text-slate-600 print:hidden"
                                }`}
                        >
                            <FileText className="w-5 h-5" />
                            Individual Reports
                        </button>

                        <button
                            onClick={() => setActiveTab("general")}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${activeTab === "general"
                                ? "text-slate-900 border-b-2 border-slate-700"
                                : "text-slate-500 hover:text-slate-700 print:hidden"
                                }`}
                        >
                            <BarChart2 className="w-5 h-5" />
                            General Reports
                        </button>
                        <button
                            onClick={() => navigate("/")}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium 
                            rounded-t-lg transition-all text-slate-500"
                        >
                            <Home className="w-5 h-5 print:hidden" />
                            <span className="print:hidden">Home</span>
                        </button>
                    </div>

                    <div className="p-6 overflow-y-auto h-[calc(297mm-130px)]">
                        {/* Individual Reports */}
                        {activeTab === "individual" && (
                            <div>
                                <h2 className="text-xl font-semibold mb-4 text-slate-800 print:hidden">
                                    Individual Reports
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                                    <div>
                                        <label className="block text-sm font-medium 
                                        print:ml-3 text-slate-700 mb-1 print:hidden">
                                            Start Date
                                        </label>
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="w-full border border-slate-300 rounded-lg px-3 py-2 
                                            print:border-none print:hidden"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium 
                                        print:ml-3 text-slate-700 mb-1 print:hidden">
                                            End Date
                                        </label>
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="w-full border border-slate-300 rounded-lg px-3 py-2 
                                            print:border-none print:hidden"
                                        />
                                    </div>
                                    <div className="md:col-span-2 p-0.5 print:hidden">
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Username
                                        </label>
                                        <Select
                                            options={userOptions}
                                            value={selectedUsername}
                                            onChange={(selected) => {
                                                setSelectedUsername(selected);
                                                if (selected) handleSearchIndividual(selected.value);
                                            }}
                                            placeholder="Search & Select Username..."
                                            isClearable
                                            className="basic-single"
                                        />
                                    </div>

                                </div>

                                {userData && (
                                    <div className="mb-6 bg-white">
                                        <h3 className="text-lg font-bold mb-2 text-slate-800 print:text-xl">
                                            {selectedUsername?.value
                                                ? selectedUsername.value.charAt(0).toUpperCase() + selectedUsername.value.slice(1) + " "
                                                : ""}
                                            User Information

                                        </h3>
                                        <div className="grid grid-cols-1">
                                            {startDate ? (<p><span className="font-medium">Start Date:</span> {startDate}</p>) : <span className="font-medium">Start Date: All</span>}
                                            {endDate ? (<p><span className="font-medium">End Date:</span> {endDate}</p>) : <span className="font-medium">End Date: All</span>}
                                        </div>
                                        <p><span className="font-medium">User Name:</span> {selectedUsername?.value}</p>
                                        <p><span className="font-medium">Name:</span> {userData.name}</p>
                                        <p><span className="font-medium">Lastname:</span> {userData.lastname}</p>
                                        <p><span className="font-medium">Directorate:</span> {userData.directorate}</p>
                                        <p><span className="font-medium">Deputy Ministry:</span> {userData.deputyMinistry}</p>
                                        <p><span className="font-medium">Number of Violations:</span> {userData.violations}</p>
                                    </div>
                                )}

                                {userData && (
                                    <div className="bg-gray-100 p-4 h-80">
                                        <h3 className="text-xl font-semibold mb-4 text-slate-800 print:text-center">
                                            {selectedUsername?.value
                                                ? selectedUsername.value.charAt(0).toUpperCase() + selectedUsername.value.slice(1) + " "
                                                : ""} Violations Trend
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
                                <h2 className="text-xl font-semibold text-slate-800 print:text-center print:underline print:text-3xl">
                                    General Reports
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium 
                                        print:ml-3 text-slate-700 mb-1 print:hidden">
                                            Start Date
                                        </label>
                                        <input
                                            type="date"
                                            value={generalStartDate}
                                            onChange={e => setGeneralStartDate(e.target.value)}
                                            className="w-full border border-slate-300 rounded-lg px-3 py-2 print:hidden"
                                        />                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium 
                                        print:ml-3 text-slate-700 mb-1 print:hidden">
                                            End Date
                                        </label>
                                        <input
                                            type="date"
                                            value={generalEndDate}
                                            onChange={e => setGeneralEndDate(e.target.value)}
                                            className="w-full border border-slate-300 rounded-lg px-3 py-2 print:hidden"
                                        />                                    </div>
                                    <div className="flex items-end print:hidden">
                                        <button
                                            onClick={handleSearchGeneral}
                                            className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-500 flex items-center gap-2"
                                        >
                                            <FileText className="w-4 h-4" /> Generate
                                        </button>
                                    </div>
                                </div>

                                {generalData && (

                                    <div className="mb-6 bg-white p-4">
                                        <h3 className="text-lg font-semibold mb-3 text-slate-800 print:text-2xl 
                                        print:mb-5">
                                            Directorates Violations Summary
                                        </h3>
                                        <div className="flex gap-15 ml-6">
                                            {generalStartDate ? (<label htmlFor=""><span className="font-bold">Start Date: </span>{generalStartDate}</label>) :
                                                <label htmlFor=""><span className="font-bold">Start Date: </span>All</label>
                                            }
                                            {generalEndDate ? (<label htmlFor=""><span className="font-bold">End Date: </span>{generalEndDate}</label>) :
                                                <label htmlFor=""><span className="font-bold">End Date: </span>All</label>
                                            }
                                        </div>
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
                                    <div className="bg-white p-4 h-80">
                                        <h3 className="text-lg font-semibold mb-4 text-slate-800">
                                            Violations per Directorate
                                        </h3>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={generalData} margin={{ top: 10, right: 10, left: 10, bottom: 70 }}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis
                                                    dataKey="directorate"
                                                    interval={0}
                                                    height={70}
                                                    tickLine={false}
                                                    tick={<AngleTick />}
                                                />

                                                <YAxis />
                                                <Tooltip />
                                                <Bar dataKey="violations" fill="#020b29" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}
                            </div>
                        )}

                        {userData && activeTab === "individual" && (
                            <div className="mt-10 flex">
                                <button
                                    onClick={handlePrint}
                                    className="px-6 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-500 print:hidden"
                                >
                                    Print {selectedUsername?.value
                                        ? selectedUsername.value.charAt(0).toUpperCase() + selectedUsername.value.slice(1) + " "
                                        : ""} Report
                                </button>
                            </div>
                        )}
                        {generalData && activeTab === "general" && (
                            <div className="mt-10 flex">
                                <button
                                    onClick={handlePrint}
                                    className="px-6 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-500 print:hidden"
                                >
                                    Print General Report
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
