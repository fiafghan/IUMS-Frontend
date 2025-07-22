import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, Building2 } from "lucide-react";
import GradientSidebar from "./components/Sidebar";

interface Ministry {
  id: string;
  name: string;
}

export default function AllMinistries() {
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editMinistry, setEditMinistry] = useState<Ministry | null>(null);
  const [newName, setNewName] = useState("");

  const fetchMinistries = async () => {
    try {
      const res = await axios.get("http://localhost:3000/deputy_ministries");
      setMinistries(res.data);
    } catch (err) {
      setError("Failed to fetch ministries");
    } finally {
      setLoading(false);
    }
  };

  const deleteMinistry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this ministry?")) return;
    try {
      await axios.delete(`http://localhost:3000/deputy_ministries/${id}`);
      setMinistries((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      alert("Failed to delete.");
    }
  };

  const handleEdit = (ministry: Ministry) => {
    setEditMinistry(ministry);
    setNewName(ministry.name);
    setIsEditing(true);
  };

  const submitEdit = async () => {
    if (!editMinistry) return;
    try {
      await axios.put(`http://localhost:3000/deputy_ministries/${editMinistry.id}`, {
        name: newName,
      });
      setMinistries((prev) =>
        prev.map((m) =>
          m.id === editMinistry.id ? { ...m, name: newName } : m
        )
      );
      setIsEditing(false);
      setEditMinistry(null);
      setNewName("");
    } catch (err) {
      alert("Failed to update.");
    }
  };

  useEffect(() => {
    fetchMinistries();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64">
        <GradientSidebar />
      </div>

      <div className="flex-1 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Building2 className="w-6 h-6 text-blue-400" />
          <h1 className="text-2xl font-bold text-blue-400">All Deputy Ministries</h1>
        </div>

        {error && <p className="text-red-500">{error}</p>}
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow border border-gray-200">
              <thead className="bg-blue-200 text-gray-500">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold">#</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold">Ministry Name</th>
                  <th className="py-3 px-4 text-center text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {ministries.map((ministry, index) => (
                  <tr key={ministry.id} className="border-t">
                    <td className="py-3 px-4 text-sm text-gray-700">{index + 1}</td>
                    <td className="py-3 px-4 text-sm text-gray-800">{ministry.name}</td>
                    <td className="py-3 px-4 text-center space-x-2">
                      <button
                        className="text-blue-400 hover:text-blue-500"
                        onClick={() => handleEdit(ministry)}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => deleteMinistry(ministry.id)}
                      >
                        <Trash2 className="w-4 h-4 text-blue-400 hover:text-red-200" />
                      </button>
                    </td>
                  </tr>
                ))}
                {ministries.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-4 px-4 text-center text-sm text-gray-500">
                      No ministries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Edit Modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-xl w-full max-w-md">
              <h2 className="text-lg font-semibold mb-4 text-blue-700">Edit Ministry</h2>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new name"
              />
              <div className="flex justify-end space-x-2">
                <button
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  onClick={() => {
                    setIsEditing(false);
                    setEditMinistry(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  onClick={submitEdit}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
