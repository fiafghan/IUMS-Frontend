import { useEffect, useState, type JSX } from "react";
import axios from "axios";
import GradientSidebar from "../components/Sidebar";
import { route } from "../config";
import ScrollToTopButton from "../components/scrollToTop";
import { User, FileText, Calendar, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";

interface Reactivation {
  id: number;
  username: string;
  reason: string;
  created_at: string;
  activated_by?: string;
}

const headers = ["Username", "Reason", "Activated By", "Activation Date", "Actions"];

export default function AllReactivations(): JSX.Element {
  const [reactivations, setReactivations] = useState<Reactivation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingReactivation, setEditingReactivation] = useState<Reactivation | null>(null);
  const [editReason, setEditReason] = useState("");

  useEffect(() => {
    const fetchReactivations = async () => {
      try {
        setLoading(true);
        setError(null);

        const { token } = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
        const response = await axios.get<Reactivation[]>(`${route}/all-reactivation`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        setReactivations(response.data.map(r => ({
          id: r.id,
          username: r.username,
          reason: r.reason,
          created_at: r.created_at,
          activated_by: (r as any).activated_by || (r as any).activatedBy || (r as any).activated_user || (r as any).user_name || (r as any).user?.name || (r as any).activated_user_name || ""
        })));

      } catch (err) {
        console.error("Error fetching reactivations:", err);
        setError("Failed to load reactivations.");
      } finally {
        setLoading(false);
      }
    };

    fetchReactivations();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleEdit = (reactivation: Reactivation) => {
    setEditingReactivation(reactivation);
    setEditReason(reactivation.reason);
  };

  const handleSave = async () => {
    if (!editingReactivation) return;

    try {
      const { token } = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
      await axios.put(
        `${route}/account-activation/${editingReactivation.id}`,
        { reason: editReason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // update local state
      setReactivations(prev =>
        prev.map(r =>
          r.id === editingReactivation.id ? { ...r, reason: editReason } : r
        )
      );

      setEditingReactivation(null);
      setEditReason("");
    } catch (err) {
      console.error("Error updating reactivation:", err);
      setError("Failed to update reactivation.");
    }
  };

  const handleCancel = () => {
    setEditingReactivation(null);
    setEditReason("");
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this reactivation record?")) return;

    try {
      const { token } = JSON.parse(localStorage.getItem("loggedInUser") || "{}");

      // Call backend to delete the record
      await axios.delete(`${route}/account-activation/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Update local state so table updates immediately
      setReactivations(prev =>
        Array.isArray(prev) ? prev.filter(r => r.id !== id) : []
      );

    } catch (err) {
      console.error("Error deleting reactivation:", err);
      setError("Failed to delete reactivation.");
    }
  };


  return (
    <div className="min-h-screen flex bg-white shadow-md shadow-indigo-700">
      <ScrollToTopButton />
      <div className="fixed top-0 left-0 bottom-0 w-64 border-r border-gray-200 bg-white shadow-sm z-20">
        <GradientSidebar />
      </div>
      <main className="flex-1 ml-64 p-8 overflow-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-slate-900 to-slate-600 rounded-full">
              <FileText className="w-6 h-6 text-blue-300" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Account Reactivations</h1>
              <p className="text-gray-600">
                View and manage all account reactivation records
              </p>
            </div>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-600">Loading reactivations...</span>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        ) : reactivations.length === 0 ? (
          <div className="text-center py-12">
            <div className="p-8 bg-gray-50 rounded-xl">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Reactivations Found
              </h3>
              <p className="text-gray-600">
                There are no account reactivation records to display.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl shadow-lg bg-white border border-gray-200">
            <table className="table-auto w-full text-left text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-slate-800 to-slate-600 text-blue-300 text-xs uppercase tracking-wider">
                  {headers.map((h) => (
                    <th key={h} className="px-6 py-4 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reactivations.map((reactivation, idx) => (
                  <tr
                    key={reactivation.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                  >
                    {/* Username */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-r from-slate-800 to-slate-600 rounded-full">
                          <User className="w-4 h-4 text-blue-300" />
                        </div>
                        <span className="font-medium text-gray-900">
                          {reactivation.username}
                        </span>
                      </div>
                    </td>

                    {/* Reason */}
                    <td className="px-6 py-4">
                      {editingReactivation?.id === reactivation.id ? (
                        <input
                          type="text"
                          value={editReason}
                          onChange={(e) => setEditReason(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="max-w-xs">
                          <p className="text-gray-900 text-sm leading-relaxed">
                            {reactivation.reason}
                          </p>
                        </div>
                      )}
                    </td>

                    {/* Activated By */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">
                          {reactivation.activated_by || "Unknown User"}
                        </span>
                      </div>
                    </td>

                    {/* Activation Date */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">
                          {formatDate(reactivation.created_at)}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      {editingReactivation?.id === reactivation.id ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={handleSave}
                            className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                            title="Save"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                            title="Cancel"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(reactivation)}
                            className="p-2 bg-gradient-to-r from-slate-900 to-slate-500 
                            text-blue-300 rounded-md hover:bg-slate-400 transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(reactivation.id)}
                            className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
