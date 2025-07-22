import { useEffect, useState } from "react";
import axios from "axios";
import {
  Pencil,
  Trash,
  Building2,
  Search
} from "lucide-react";
import GradientSidebar from "./components/Sidebar";

type Directorate = {
  id: string;
  name: string;
  deputyMinistryId: string;
};

type DeputyMinistry = {
  id: string;
  name: string;
};

export default function AllDirectorates() {
  const [directorates, setDirectorates] = useState<Directorate[]>([]);
  const [deputyMinistries, setDeputyMinistries] = useState<DeputyMinistry[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedDeputyId, setEditedDeputyId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    const [dirRes, depRes] = await Promise.all([
      axios.get("http://localhost:3000/directorates"),
      axios.get("http://localhost:3000/deputy_ministries"),
    ]);
    setDirectorates(dirRes.data);
    setDeputyMinistries(depRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    await axios.delete(`http://localhost:3000/directorates/${id}`);
    fetchData();
  };

  const handleEditClick = (dir: Directorate) => {
    setEditingId(dir.id);
    setEditedName(dir.name);
    setEditedDeputyId(dir.deputyMinistryId);
  };

  const handleSave = async (id: string) => {
    await axios.put(`http://localhost:3000/directorates/${id}`, {
      name: editedName,
      deputyMinistryId: editedDeputyId,
    });
    setEditingId(null);
    fetchData();
  };

  const filteredDirectorates = directorates.filter((dir) => {
    const deputy = deputyMinistries.find((d) => d.id === dir.deputyMinistryId)?.name || "";
    return (
      dir.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deputy.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64">
        <GradientSidebar />
      </div>

      {/* Main */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-blue-400 flex items-center gap-2">
            <Building2 className="text-blue-400" /> All Directorates
          </h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>
        </div>

        <div className="overflow-x-auto bg-white shadow border border-gray-200 rounded-xl">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-blue-100 text-left">
              <tr>
                <th className="px-4 py-3">Directorate Name</th>
                <th className="px-4 py-3">Deputy Ministry</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDirectorates.map((dir) => {
                const deputy = deputyMinistries.find((d) => d.id === dir.deputyMinistryId);
                const isEditing = editingId === dir.id;

                return (
                  <tr key={dir.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          className="border rounded px-2 py-1 w-full"
                        />
                      ) : (
                        dir.name
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <select
                          value={editedDeputyId}
                          onChange={(e) => setEditedDeputyId(e.target.value)}
                          className="border rounded px-2 py-1 w-full"
                        >
                          <option value="">Select</option>
                          {deputyMinistries.map((dep) => (
                            <option key={dep.id} value={dep.id}>
                              {dep.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        deputy?.name || "Unknown"
                      )}
                    </td>
                    <td className="px-4 py-3 text-center flex gap-2 justify-center">
                      {isEditing ? (
                        <button
                          onClick={() => handleSave(dir.id)}
                          className="text-sm px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEditClick(dir)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(dir.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash className="w-5 h-5 text-blue-400 hover:text-blue-300" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredDirectorates.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-gray-400">
                    No directorates found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
