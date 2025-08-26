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
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      });
      console.log("API Response:", response.data);
      const data = response.data.data || response.data || [];
      setViolationTypes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching violation types:", error);
      alert("❌ Failed to load violation types");
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchViolationTypes();
  }, []);

  // Filter violation types based on search term
  const filteredViolationTypes = (violationTypes || []).filter(vt =>
    vt.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle edit action
  const handleEdit = (violationType: ViolationType) => {
    setEditingId(violationType.id);
    setEditName(violationType.name);
  };

  // Handle save edit
  const handleSaveEdit = async (id: number) => {
    if (!editName.trim()) {
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
        title: "Violation Type Name Can't Be Empty!",
        icon: "error",
        draggable: true,
      }); return;
    }

    try {
      const { token } = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
      await axios.put(
        `${route}/violation/${id}`,
        { name: editName.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update local state
      setViolationTypes(prev =>
        prev.map(vt =>
          vt.id === id ? { ...vt, name: editName.trim() } : vt
        )
      );

      setEditingId(null);
      setEditName("");
      // Make sure SweetAlert2 (Swal) is loaded
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
        title: "Violation Type Updated Successfully!",
        icon: "success",
        // draggable is supported in newer SweetAlert2 versions
        draggable: true,
      });

    } catch (error: any) {
      console.error("Error updating violation type:", error);
      if (error.response?.data?.message) {
        alert(`❌ Error: ${error.response.data.message}`);
      } else {
        alert("❌ Failed to update violation type");
      }
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  // Handle delete action
  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      const { token } = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
      await axios.delete(`${route}/violation/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Remove from local state
      setViolationTypes(prev => prev.filter(vt => vt.id !== id));
      Swal.fire({
        icon: "success",
        title: "Violation Type Deleted!",
        text: "Violation Type Deleted Successfully!",
        footer: 'Press Okay!'
      });
    } catch (error: any) {
      console.error("Error deleting violation type:", error);
      if (error.response?.data?.message) {
        alert(`❌ Error: ${error.response.data.message}`);
      } else {
        alert("❌ Failed to delete violation type");
      }
    }
  };

  return (
    <div className="flex min-h-screen">
      <GradientSidebar />
      {/* Loading Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="spinner-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.75 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
          >
            <Spinner size={48} thickness={5} colorClass="border-white" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="min-h-screen bg-white p-10 ml-30">
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-slate-200 rounded-full">
                <AlertTriangle className="w-6 h-6 text-slate-800" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800 mr-50">All Violation Types</h1>
                <p className="text-slate-500">Manage violation types in the system</p>
              </div>
            </div>
            {currentUser?.user.role !== "viewer" && (
              <button
                onClick={() => navigate("/add-violation-type")}
                className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-xl 
              hover:bg-slate-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5" />
                Add New Type
              </button>
            )}
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 
              bg-slate-800 rounded-full p-1 h-5 text-white" />
              <input
                type="text"
                placeholder="Search violation types..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-md 
                focus:ring-2 focus:ring-red-400 focus:border-transparent 
                border-1 borer-slate-800 transition-all duration-200
                shadow-md shadow-slate-300"
              />
            </div>
          </div>

          {/* Table */}
          <motion.div
            className="bg-white rounded-xl shadow-lg overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.1 }}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Created</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredViolationTypes.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                        {loading ? "Loading..." : searchTerm ? "No violation types found matching your search" : "No violation types found"}
                      </td>
                    </tr>
                  ) : (
                    filteredViolationTypes.map((violationType, index) => (
                      <motion.tr
                        key={violationType.id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                      >
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                          #{violationType.id}
                        </td>
                        <td className="px-6 py-4">
                          {editingId === violationType.id ? (
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent"
                              autoFocus
                            />
                          ) : (
                            <span className="text-sm text-gray-900 font-medium">
                              {violationType.name}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(violationType.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            {editingId === violationType.id ? (
                              <>
                                <button
                                  onClick={() => handleSaveEdit(violationType.id)}
                                  className="px-3 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition-colors duration-150"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="px-3 py-1 bg-gray-500 text-white text-xs rounded-lg hover:bg-gray-600 transition-colors duration-150"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleEdit(violationType)}
                                  className="p-2 text-slate-800 hover:bg-slate-200 rounded-lg transition-colors duration-150"
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(violationType.id, violationType.name)}
                                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-150"
                                  title="Delete"
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
          <div className="mt-6 text-center text-sm text-gray-600">
            Showing {filteredViolationTypes.length} of {violationTypes.length} violation types
          </div>
        </motion.div>
      </div>
    </div>
  );
}
