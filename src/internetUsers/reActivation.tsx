import { useState, useEffect } from "react";
import axios from "axios";
import { route } from "../config";
import { Search, XCircle, UserCheck, RotateCcw, AlertCircle, CheckCircle, Users } from "lucide-react";
import GradientSidebar from "../components/Sidebar";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";

interface User {
  id: number; // Change from internet_user_id to id //
  username: string;
}

export default function ReactivateUserForm() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [reason, setReason] = useState("");
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    if (search.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    const delayDebounce = setTimeout(() => {
      setLoading(true);
      const { token } = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
      console.log("Submitting user id:", selectedUser?.id);
      console.log("Reason:", reason);

      axios
        .get(`${route}/internet-users-deactivated?query=${search}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => {
          const data = res.data.data || [];
          setResults(data);
          setNoResults(data.length === 0);
        })
        .catch(() => {
          setResults([]);
          setNoResults(true);
        })
        .finally(() => setLoading(false));
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return alert("Please select a user");
    if (!reason) return alert("Please write a reason");

    console.log("Submitting user:", selectedUser);
    console.log("User ID:", selectedUser.id); // Change from internet_user_id to id
    console.log("User ID type:", typeof selectedUser.id);

    // Check if id exists and is valid
    if (!selectedUser.id) {
      alert("Invalid user ID. Please select a user again.");
      return;
    }

    try {
      const { token } = JSON.parse(localStorage.getItem("loggedInUser") || "{}");

      const payload = {
        internet_user_id: Number(selectedUser.id), // Use id instead of internet_user_id
        reason,
      };

      console.log("Sending payload:", payload);

      await axios.post(
        `${route}/account/activate`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      Swal.fire({
        title: "The Internet User Was Successfully Activated!",
        icon: "success",
        draggable: true
      });
      setSelectedUser(null);
      setSearch("");
      setReason("");
    } catch (err: any) {
      console.error("Error response:", err.response?.data);
      console.error("Full error:", err);
      alert("Error submitting request: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
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
            <div className="p-4 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl shadow-lg">
              <RotateCcw className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-emerald-900 to-teal-900 bg-clip-text text-transparent">
                Account Reactivation
              </h1>
              <p className="text-slate-600 mt-1 font-medium">
                Reactivate deactivated internet user accounts
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
            <div className="px-8 py-6 bg-gradient-to-r from-emerald-600 to-teal-600">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl">
                  <UserCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Reactivate User Account</h2>
                  <p className="text-emerald-100 text-sm">Search and reactivate deactivated users</p>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Search Section */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="space-y-3"
                >
                  <label className="block text-sm font-semibold text-slate-700 items-center gap-2">
                    <Search className="w-4 h-4 text-emerald-600" />
                    Search Deactivated Users
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setSelectedUser(null);
                      }}
                      placeholder="Start typing username to search..."
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 hover:bg-white hover:border-slate-300"
                    />
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Search className="w-5 h-5 text-slate-400" />
                    </div>

                    {/* Search Results - Fixed positioning and width */}
                    <AnimatePresence>
                      {results.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-10 max-h-48 overflow-auto"
                        >
                          <div className="p-2">
                            {results.map((user, index) => (
                              <motion.div
                                key={`${user.id}-${index}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => {
                                  setSelectedUser(user);
                                  setSearch(user.username);
                                  setResults([]);
                                }}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-emerald-50 hover:border-emerald-200 border border-transparent rounded-lg cursor-pointer transition-all duration-200 group"
                              >
                                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                  {user.username.charAt(0).toUpperCase()}
                                </div>
                                <span className="font-medium text-slate-700 group-hover:text-emerald-700">
                                  {user.username}
                                </span>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Loading State */}
                  {loading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2 text-emerald-600 text-sm"
                    >
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600"></div>
                      Searching for users...
                    </motion.div>
                  )}

                  {/* No Results */}
                  {search.length >= 2 && !loading && noResults && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600"
                    >
                      <XCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">No deactivated users found</span>
                    </motion.div>
                  )}
                </motion.div>

                {/* Selected User Display */}
                {selectedUser && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-emerald-800">Selected User</p>
                        <p className="text-emerald-700 font-semibold">{selectedUser.username}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Reason Section */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="space-y-3"
                >
                  <label className="block text-sm font-semibold text-slate-700 items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-emerald-600" />
                    Reason for Reactivation
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={4}
                    placeholder="Please provide a detailed reason for reactivating this account..."
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 hover:bg-white hover:border-slate-300 resize-none"
                  />
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                  className="pt-4"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={!selectedUser || !reason.trim()}
                    className={`w-full py-4 rounded-xl font-medium transition-all duration-200 ${
                      !selectedUser || !reason.trim()
                        ? "bg-slate-300 cursor-not-allowed text-slate-500"
                        : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <RotateCcw className="w-5 h-5" />
                      Submit Reactivation Request
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
            transition={{ delay: 1.1, duration: 0.6 }}
            className="mt-8 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
          >
            <div className="px-6 py-4 bg-gradient-to-r from-slate-100 to-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-slate-600" />
                Reactivation Process
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-3 text-sm text-slate-600">
                <p>• Search for deactivated users by username</p>
                <p>• Select the user you want to reactivate</p>
                <p>• Provide a clear reason for reactivation</p>
                <p>• Submit the request for approval</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
