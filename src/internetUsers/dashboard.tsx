import { useEffect, useState, type JSX } from "react";
import axios from "axios";
import { LayoutDashboard, User, Users, Briefcase } from "lucide-react";

import GradientSidebar from "../components/Sidebar";
import GroupTypePieChart from "../components/groupTypePieChart";
import ScrollToTopButton from "../components/scrollToTop";

import type { InternetUser } from "../types/types";
import { route } from "../config";

export default function Dashboard(): JSX.Element {
  const [users, setUsers] = useState<InternetUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      setError(null);
      try {
        const { token } = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
        const res = await axios.get<InternetUser[]>(`${route}/internet`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (e) {
        setError("Failed to fetch users. Please try again later.");
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 1).length;
  const deactiveUsers = users.filter(u => u.status === 0).length;

  const employmentTypeCounts: Record<string, number> = users.reduce((acc, u) => {
    const type = u.employment_type || "Unknown";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);


  return (
    <div className="min-h-screen flex bg-white shadow-md shadow-indigo-700">
      <ScrollToTopButton />

      {/* Sidebar */}
      <div className="fixed top-0 left-0 bottom-0 w-64 border-r border-gray-200 bg-white shadow-sm z-20">
        <GradientSidebar />
      </div>

      {/* Main */}
      <main className="flex-1 ml-64 p-8 overflow-auto">
        <div className="ml-5 bg-gradient-to-b from-blue-500 via-blue-400 to-blue-50 rounded-sm p-2 mr-5 text-white flex">
          <LayoutDashboard className="text-white" />
          <h1 className="ml-3">Summary</h1>
        </div>

        {loading ? (
          <p className="text-center text-gray-600 mt-6">Loading users...</p>
        ) : error ? (
          <p className="text-center text-red-600 mt-6">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1 bg-white rounded-md mt-2">
            {/* 🔵 Total Users */}
            <div className="relative overflow-hidden rounded-md p-6 shadow-md shadow-white bg-gradient-to-b from-blue-500 via-blue-300 to-blue-200 border border-blue-100 border-r-3 border-r-blue-500 group scale-80">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <User className="w-6 h-6 text-white bg-blue-400 rounded-md p-1" />
                  <span className="text-gray-100 text-[11px]">Total Users</span>
                </div>
                <div className="text-blue-500 text-xs uppercase tracking-wider bg-white rounded-full p-2 scale-70">Summary</div>
              </div>
              <div className="text-4xl font-bold text-gray-100 text-center mt-25">{totalUsers}</div>
            </div>

            {/* 🟦 Active / Deactive */}
            <div className="relative overflow-hidden rounded-md p-6 shadow-md shadow-white border border-blue-100 border-r-3 border-r-blue-500 group scale-80 bg-gradient-to-b from-blue-500 via-blue-300 to-blue-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-white bg-blue-400 rounded-md p-1" />
                  <span className="text-gray-100 text-[11px]">Active / Deactive</span>
                </div>
                <div className="text-blue-500 text-xs uppercase tracking-wide  bg-white rounded-full p-2 scale-70">Status</div>
              </div>
              <div className="space-y-1 text-blue-400 mt-25">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-100">Active</span>
                  <span className="font-bold text-green-400 bg-blue-400 rounded-md w-15 text-center p-1 scale-70">{activeUsers}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-100">Deactive</span>
                  <span className="font-bold text-red-600 bg-blue-400 rounded-md text-center w-15 p-1 scale-70">{deactiveUsers}</span>
                </div>
              </div>
            </div>

            {/* 👔 Employment Types */}
            <div className="relative overflow-hidden rounded-md p-6 shadow-md shadow-white bg-gradient-to-b from-blue-500 via-blue-300 to-blue-200 border border-blue-100 border-r-3 border-r-blue-500 group scale-80">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Briefcase className="w-6 h-6 text-white bg-blue-400 p-1 rounded-md" />
                  <span className="text-gray-100 text-[11px]">Employment Types</span>
                </div>
                <div className="text-blue-500 text-xs uppercase tracking-wider  bg-white rounded-full p-2 scale-70">Type</div>
              </div>
              <ul className="space-y-1 text-sm text-blue-400 max-h-32 overflow-auto pr-1 mt-25">
                {Object.entries(employmentTypeCounts).map(([type, count]) => (
                  <li key={type} className="flex justify-between">
                    <span className="text-gray-100">{type}</span>
                    <span className="font-bold bg-blue-400 w-10 text-center rounded-md text-xs p-1 text-gray-100">{count}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Group Pie Chart */}
            <div className="relative overflow-hidden rounded-sm p-1 shadow-md shadow-white bg-gradient-to-b from-blue-500 via-blue-300 to-blue-200 border border-blue-100 border-r-3 border-r-blue-500 group scale-80 pb-5">
              <GroupTypePieChart />
            </div>

          </div>
        )}
      </main>
    </div>
  );
}
