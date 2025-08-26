import { useEffect, useState, type JSX } from "react";
import axios from "axios";
import { LayoutDashboard, User, Briefcase, TrendingUp, Activity, BarChart3, ArrowUpRight, ArrowDownRight, Eye, Clock, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import GradientSidebar from "../components/Sidebar";
import GroupTypePieChart from "../components/groupTypePieChart";
import ScrollToTopButton from "../components/scrollToTop";

import type { InternetUser } from "../types/types";
import { route } from "../config";

export default function Dashboard(): JSX.Element {
  const [users, setUsers] = useState<InternetUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

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
  const activePercentage = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;

  const employmentTypeCounts: Record<string, number> = users.reduce((acc, u) => {
    const type = u.employment_type || "Unknown";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const statVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <ScrollToTopButton />

      {/* Sidebar */}
      <div className="fixed top-0 left-0 bottom-0 w-64 border-r border-slate-200 bg-white shadow-lg z-20">
        <GradientSidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-slate-800 to-slate-500 rounded-md shadow-lg">
              <LayoutDashboard className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-slate-600 mt-1 font-medium">
                Welcome to your Internet User Management System Overview
              </p>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center py-20"
          >
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600 text-lg font-medium">Loading dashboard data...</p>
            </div>
          </motion.div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="p-6 bg-red-50 rounded-2xl border border-red-200 max-w-md mx-auto">
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Data</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Users Card */}
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: 0.1 }}
                className="group relative overflow-hidden bg-white rounded-2xl p-6 shadow-xl border border-slate-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full -translate-y-16 translate-x-16 opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-r from-slate-800 to-slate-500 rounded-xl shadow-lg">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors duration-300" />
                  </div>
                  <h3 className="text-slate-600 text-sm font-medium mb-2">Total Users</h3>
                  <div className="text-3xl font-bold text-slate-900 mb-2">{totalUsers.toLocaleString()}</div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-green-600 font-medium">+{activeUsers} Total Users</span>
                  </div>
                </div>
              </motion.div>

              {/* Active Users Card */}
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: 0.2 }}
                className="group relative overflow-hidden bg-white rounded-2xl p-6 shadow-xl border border-slate-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100 to-green-200 rounded-full -translate-y-16 translate-x-16 opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-r from-slate-800 to-slate-500 rounded-xl shadow-lg">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-green-500 transition-colors duration-300" />
                  </div>
                  <h3 className="text-slate-600 text-sm font-medium mb-2">Active Users</h3>
                  <div className="text-3xl font-bold text-slate-900 mb-2">{activeUsers.toLocaleString()}</div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <div className="w-16 bg-slate-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${activePercentage}%` }}></div>
                    </div>
                    <span className="text-green-600 font-medium">{activePercentage}%</span>
                  </div>
                </div>
              </motion.div>

              {/* Inactive Users Card */}
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: 0.3 }}
                className="group relative overflow-hidden bg-white rounded-2xl p-6 shadow-xl border border-slate-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-100 to-red-200 rounded-full -translate-y-16 translate-x-16 opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-r from-slate-800 to-slate-500 rounded-xl shadow-lg">
                      <XCircle className="w-6 h-6 text-white" />
                    </div>
                    <ArrowDownRight className="w-5 h-5 text-slate-400 group-hover:text-red-500 transition-colors duration-300" />
                  </div>
                  <h3 className="text-slate-600 text-sm font-medium mb-2">Inactive Users</h3>
                  <div className="text-3xl font-bold text-slate-900 mb-2">{deactiveUsers.toLocaleString()}</div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Clock className="w-4 h-4 text-red-500" />
                    <span className="text-red-600 font-medium">Requires attention</span>
                  </div>
                </div>
              </motion.div>

              {/* Employment Types Card */}
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: 0.4 }}
                className="group relative overflow-hidden bg-white rounded-2xl p-6 shadow-xl border 
                border-slate-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 
                to-purple-200 rounded-full -translate-y-16 translate-x-16 opacity-20 group-hover:opacity-30
                 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-r from-slate-800 to-slate-500 rounded-xl shadow-lg">
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <BarChart3 className="w-5 h-5 text-slate-400 group-hover:text-purple-500 
                    transition-colors duration-300" />
                  </div>
                  <h3 className="text-slate-600 text-sm font-medium mb-2">Employment Types</h3>
                  <div className="text-3xl font-bold text-slate-900 mb-2">{Object.keys(employmentTypeCounts).length}</div>
                  <div className="text-sm text-slate-500">
                    <span className="text-purple-600 font-medium">Diverse workforce</span> categories
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Detailed Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Employment Types Breakdown */}
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-slate-800 to-slate-500 rounded-lg">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">Employment Distribution</h3>
                </div>
                <div className="space-y-4">
                  {Object.entries(employmentTypeCounts).map(([type, count], index) => (
                    <motion.div
                      key={type}
                      variants={statVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-xl
                       hover:bg-slate-100 transition-colors duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-slate-900 rounded-full"></div>
                        <span className="font-medium text-slate-700">{type}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-20 bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-slate-900 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(count / totalUsers) * 100}%` }}
                          ></div>
                        </div>
                        <span className="font-bold text-slate-900 min-w-[3rem] text-right">{count}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Group Distribution Chart */}
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100"
              >
                <div className="h-80 w-full flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center">
                    <GroupTypePieChart />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-8 bg-white rounded-2xl p-6 shadow-xl border border-slate-100"
            >
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="flex items-center gap-3 p-4 bg-slate-100 hover:from-blue-100 hover:to-blue-200 rounded-xl border border-blue-200 transition-all duration-200 hover:shadow-md group">
                  <div className="p-2  bg-gradient-to-r from-slate-800 to-slate-500 rounded-lg group-hover:scale-110 transition-transform duration-200">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <button onClick={() => navigate("/adduser")}><div className="font-medium text-blue-900">Add New User</div></button>
                    <div className="text-sm text-blue-600">Create new internet user account</div>
                  </div>
                </button>

                <button className="flex items-center gap-3 p-4 bg-slate-100 hover:from-green-100 hover:to-green-200 rounded-xl border border-green-200 transition-all duration-200 hover:shadow-md group">
                  <div className="p-2 bg-gradient-to-r from-slate-800 to-slate-500 rounded-lg group-hover:scale-110 transition-transform duration-200">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <button onClick={() => navigate("/all-users")}><div className="font-medium text-green-900">View All Users</div></button>
                    <div className="text-sm text-green-600">Browse complete user list</div>
                  </div>
                </button>

                <button className="flex items-center gap-3 p-4 bg-slate-100 hover:from-purple-100
                 hover:to-purple-200 rounded-xl border border-purple-200 transition-all duration-200 
                 hover:shadow-md group">
                  <div className="p-2 bg-gradient-to-r from-slate-800 to-slate-500
                   rounded-lg group-hover:scale-110 transition-transform duration-200">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-purple-900">System Reports</div>
                    <div className="text-sm text-purple-600">Generate detailed analytics</div>
                  </div>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </main>
    </div>
  );
}
