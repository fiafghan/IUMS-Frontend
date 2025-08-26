import { useState } from "react";
import { FileText, BarChart2, Search } from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
} from "recharts";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

export default function Reports() {
    const [activeTab, setActiveTab] = useState<"individual" | "general">("individual");
    const [username, setUsername] = useState("");
    const [userData, setUserData] = useState<any | null>(null);
    const [generalData, setGeneralData] = useState<any[] | null>(null);

    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: "Reports",
    });

    // Mock Data for Individual Report
    const mockUser = {
        lastname: "Ahmadi",
        directorate: "IT Directorate",
        deputyMinistry: "Digital Services",
        violations: 5,
        trend: [
            { date: "2025-08-01", violations: 1 },
            { date: "2025-08-05", violations: 2 },
            { date: "2025-08-10", violations: 1 },
            { date: "2025-08-15", violations: 1 },
        ],
    };

    // Mock Data for General Report
    const mockGeneral = [
        { directorate: "IT Directorate", violations: 15 },
        { directorate: "Finance Directorate", violations: 7 },
        { directorate: "HR Directorate", violations: 3 },
        { directorate: "Logistics Directorate", violations: 12 },
        { directorate: "Audit Directorate", violations: 20 },
    ];

    const handleSearchIndividual = () => {
        // 🔒 API CALL SECTION (currently commented out)
        /*
        axios.get(`${route}/reports/individual`, {
          params: {
            startDate,
            endDate,
            username
          }
        }).then((res) => {
          setUserData(res.data);
        }).catch((err) => {
          console.error(err);
        });
    
        👉 When you connect your API:
          1. Uncomment this code
          2. Delete the mockUser assignment below
        */
        setUserData(mockUser); // Mock data for now
    };

    const handleSearchGeneral = () => {
        // 🔒 API CALL SECTION (currently commented out)
        /*
        axios.get(`${route}/reports/general`, {
          params: {
            startDate,
            endDate,
          }
        }).then((res) => {
          setGeneralData(res.data);
        }).catch((err) => {
          console.error(err);
        });
    
        👉 When you connect your API:
          1. Uncomment this code
          2. Delete the mockGeneral assignment below
        */
        setGeneralData(mockGeneral); // Mock data for now
    };

    // Compute max and min violations for General Report
    const maxDirectorate = generalData
        ? generalData.reduce((max, d) => (d.violations > max.violations ? d : max), generalData[0])
        : null;
    const minDirectorate = generalData
        ? generalData.reduce((min, d) => (d.violations < min.violations ? d : min), generalData[0])
        : null;

    return (
        <div className="flex justify-center items-center min-h-screen bg-slate-200">
            {/* A4 Container */}
            <div
                className="bg-white shadow-xl rounded-2xl overflow-hidden"
                style={{ width: "210mm", height: "297mm" }} ref={printRef}
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-300">
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                        Reports
                    </h1>
                    <p className="text-slate-600">View and manage all reports here.</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 px-6 pt-4 border-b border-slate-200">
                    <button
                        onClick={() => setActiveTab("individual")}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${activeTab === "individual"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-slate-500 hover:text-slate-700"
                            }`}
                    >
                        <FileText className="w-5 h-5" />
                        Individual Reports
                    </button>

                    <button
                        onClick={() => setActiveTab("general")}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${activeTab === "general"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-slate-500 hover:text-slate-700"
                            }`}
                    >
                        <BarChart2 className="w-5 h-5" />
                        General Reports
                    </button>
                </div>

                {/* Tab Content */}
                <div className="p-6 overflow-y-auto h-[calc(297mm-130px)]">
                    {/* Individual Reports */}
                    {activeTab === "individual" && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4 text-slate-800">
                                Individual Reports
                            </h2>

                            {/* Filters */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 print:border-none print:shadow-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 print:border-none print:shadow-none"
                                    />
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
                                            className="px-4 bg-blue-600 text-white rounded-r-lg 
                                            print:hidden hover:bg-blue-700 flex items-center gap-2"
                                        >
                                            <Search className="w-4 h-4" /> Search
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* User Info */}
                            {userData && (
                                <div className="mb-6 bg-slate-50 p-4 rounded-xl shadow">
                                    <h3 className="text-lg font-semibold mb-2 text-slate-800">
                                        User Information
                                    </h3>
                                    <p><span className="font-medium">Lastname:</span> {userData.lastname}</p>
                                    <p><span className="font-medium">Directorate:</span> {userData.directorate}</p>
                                    <p><span className="font-medium">Deputy Ministry:</span> {userData.deputyMinistry}</p>
                                    <p><span className="font-medium">Number of Violations:</span> {userData.violations}</p>
                                </div>
                            )}

                            {/* Chart */}
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
                                            <Line
                                                type="monotone"
                                                dataKey="violations"
                                                stroke="#2563eb"
                                                strokeWidth={2}
                                                dot={{ r: 4 }}
                                            />
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

                            {/* Filters */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 print:border-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 print:border-none"
                                    />
                                </div>
                                <div className="flex items-end print:hidden">
                                    <button
                                        onClick={handleSearchGeneral}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                                    >
                                        <Search className="w-4 h-4" /> Search
                                    </button>
                                </div>
                            </div>

                            {/* Summary Info */}
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

                            {/* Chart */}
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
                                            <Bar dataKey="violations" fill="#2563eb" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </div>
                    )}
                    <div className="mt-10 w-full">
                     <button
                    onClick={handlePrint}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg 
                    w-full hover:bg-blue-600 print:hidden"
                >
                     Print Report
                </button>
                </div>
                </div>
            </div>
        </div>
    );
}
