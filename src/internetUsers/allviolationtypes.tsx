import { useState, useEffect, type JSX } from "react";
import { Edit, Trash2, Plus, AlertTriangle, Search } from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { route } from "../config";
import type { ViolationType } from "../types/types";
import GradientSidebar from "../components/Sidebar";
import Swal from "sweetalert2";

export default function AllViolationTypes(): JSX.Element {
  const [violationTypes, setViolationTypes] = useState<ViolationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");

  // Fetch violation types from API
  const fetchViolationTypes = async () => {
    try {
      setLoading(true);
      const { token } = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
      const response = await axios.get(`${route}/violation`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      });
      const data = response.data.data || response.data || [];
      setViolationTypes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching violation types:", error);
      alert("❌ Failed to load violation types");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchViolationTypes(); }, []);

  const filteredViolationTypes = (violationTypes || []).filter(vt =>
    vt.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (violationType: ViolationType) => {
    setEditingId(violationType.id);
    setEditName(violationType.name);
  };

  const handleSaveEdit = async (id: number) => {
    if (!editName.trim()) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Violation Type Name Can't Be Empty!",
        showConfirmButton: false,
        timer: 2000,
        background: "#1e293b",
        color: "#f1f5f9",
      });
      return;
    }

    try {
      const { token } = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
      await axios.put(`${route}/violation/${id}`, { name: editName.trim() }, { headers: { Authorization: `Bearer ${token}` } });
      setViolationTypes(prev => prev.map(vt => vt.id === id ? { ...vt, name: editName.trim() } : vt));
      setEditingId(null);
      setEditName("");
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Violation Type Updated Successfully!",
        showConfirmButton: false,
        timer: 2000,
        background: "#0f172a",
        color: "#e2e8f0"
      });
    } catch (error) {
      console.error("Error updating violation type:", error);
      alert("❌ Failed to update violation type");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const { token } = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
      await axios.delete(`${route}/violation/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setViolationTypes(prev => prev.filter(vt => vt.id !== id));
      Swal.fire({ icon: "success", title: "Deleted!", text: "Violation Type Removed." });
    } catch (error) {
      console.error("Error deleting violation type:", error);
      alert("❌ Failed to delete violation type");
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-slate-50 via-white to-slate-100">
      <GradientSidebar />

      {/* Loading Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="spinner-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <Spinner size={60} thickness={6} colorClass="border-red-400" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 min-h-screen p-10">
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-red-400 to-red-600 rounded-2xl shadow-md">
                <AlertTriangle className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
                  Violation Types
                </h1>
                <p className="text-slate-500 text-sm">Manage system violation types</p>
              </div>
            </div>

            {currentUser?.user.role !== "viewer" && (
              <button
                onClick={() => navigate("/add-violation-type")}
                className="flex items-center gap-2 px-6 py-3 rounded-xl shadow-lg
                bg-gradient-to-r from-red-500 to-red-700 text-white font-medium
                hover:from-red-600 hover:to-red-800 transition-all duration-300"
              >
                <Plus className="w-5 h-5" /> Add New Type
              </button>
            )}
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white bg-red-500 rounded-full p-1" />
              <input
                type="text"
                placeholder="Search violation types..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200
                shadow-sm focus:ring-2 focus:ring-red-400 focus:border-red-400
                transition-all duration-200 bg-white/90"
              />
            </div>
          </div>

          {/* Table */}
          <motion.div
            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gradient-to-r from-slate-100 to-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-slate-700">ID</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-700">Name</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-700">Created</th>
                    <th className="px-6 py-4 text-center font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredViolationTypes.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                        {loading ? "Loading..." : searchTerm ? "No matches found" : "No violation types available"}
                      </td>
                    </tr>
                  ) : (
                    filteredViolationTypes.map((violationType, index) => (
                      <motion.tr
                        key={violationType.id}
                        className="hover:bg-slate-50 transition-colors duration-150"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                      >
                        <td className="px-6 py-4 font-medium text-slate-800">#{violationType.id}</td>
                        <td className="px-6 py-4">
                          {editingId === violationType.id ? (
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400"
                              autoFocus
                            />
                          ) : (
                            <span className="font-medium text-slate-700">{violationType.name}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {new Date(violationType.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            {editingId === violationType.id ? (
                              <>
                                <button
                                  onClick={() => handleSaveEdit(violationType.id)}
                                  className="px-3 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600"
                                >Save</button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="px-3 py-1 bg-gray-400 text-white text-xs rounded-lg hover:bg-gray-500"
                                >Cancel</button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleEdit(violationType)}
                                  className="p-2 text-slate-700 hover:bg-slate-200 rounded-lg"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(violationType.id, violationType.name)}
                                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Summary */}
          <div className="mt-6 text-center text-sm text-slate-500">
            Showing {filteredViolationTypes.length} of {violationTypes.length} types
          </div>
        </motion.div>
      </div>
    </div>
  );
}
