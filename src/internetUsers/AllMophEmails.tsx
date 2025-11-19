import { useEffect, useMemo, useState, type JSX } from "react";
import axios from "axios";
import GradientSidebar from "../components/Sidebar";
import { route } from "../config";
import { useNavigate } from "react-router-dom";

type Row = {
  id: number;
  moph_id: string;
  directorate_id: number;
  directorate_name: string;
  email: string;
};

export default function AllMophEmails(): JSX.Element {
  const [rows, setRows] = useState<Row[]>([]);
  const [dirs, setDirs] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [edit, setEdit] = useState<{ moph_id: string; directorate_id: number | ""; email: string }>({ moph_id: "", directorate_id: "", email: "" });

  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
  const token = currentUser?.token;
  const isViewer = currentUser?.user?.role === "viewer";

  const headers = useMemo(() => (
    token ? { Authorization: `Bearer ${token}` } : {}
  ), [token]);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [listRes, dirRes] = await Promise.all([
        axios.get(`${route}/moph-emails`, { headers }),
        axios.get(`${route}/directorate`, { headers })
      ]);
      setRows(listRes.data || []);
      const dirList = Array.isArray(dirRes.data) ? dirRes.data : [];
      setDirs(dirList.map((d: any) => ({ id: d.id, name: d.name })));
    } catch (e) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startEdit = (row: Row) => {
    setEditId(row.id);
    setEdit({ moph_id: row.moph_id, directorate_id: row.directorate_id, email: row.email });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEdit({ moph_id: "", directorate_id: "", email: "" });
  };

  const saveEdit = async () => {
    if (!editId) return;
    try {
      await axios.put(`${route}/moph-emails/${editId}`, {
        directorate_id: Number(edit.directorate_id),
        email: edit.email,
      }, { headers });
      await fetchAll();
      cancelEdit();
    } catch (e: any) {
      alert(e?.response?.data?.message || "Update failed");
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    try {
      await axios.delete(`${route}/moph-emails/${id}`, { headers });
      setRows(prev => prev.filter(r => r.id !== id));
    } catch (e) {
      alert("Delete failed");
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      <div className="fixed top-0 left-0 bottom-0 w-64 border-r border-slate-200 bg-white shadow-lg z-20">
        <GradientSidebar />
      </div>
      <main className="flex-1 ml-64 p-8 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-slate-800">MOPH Emails</h1>
          {!isViewer && (
            <button onClick={() => navigate("/add-moph-email")} className="px-4 py-2 rounded-md bg-slate-800 text-white">Add New</button>
          )}
        </div>

        {loading && <p className="text-slate-600">Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && rows.length === 0 && (
          <div className="p-6 border border-slate-200 rounded-xl">No records found.</div>
        )}

        {!loading && rows.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-slate-200">
              <thead>
                <tr className="bg-slate-800 text-white">
                  <th className="px-4 py-3 text-left">MOPH ID</th>
                  <th className="px-4 py-3 text-left">Directorate</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  {!isViewer && <th className="px-4 py-3 text-left">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t border-slate-200">
                    <td className="px-4 py-2 align-top">
                      {r.moph_id}
                    </td>
                    <td className="px-4 py-2 align-top">
                      {editId === r.id ? (
                        <select value={edit.directorate_id as any} onChange={(e) => setEdit(s => ({ ...s, directorate_id: e.target.value ? Number(e.target.value) : "" }))} className="border border-slate-300 rounded-md px-2 py-1">
                          <option value="">Select directorate</option>
                          {dirs.map(d => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                          ))}
                        </select>
                      ) : (
                        r.directorate_name
                      )}
                    </td>
                    <td className="px-4 py-2 align-top">
                      {editId === r.id ? (
                        <input type="email" value={edit.email} onChange={(e) => setEdit(s => ({ ...s, email: e.target.value }))} className="border border-slate-300 rounded-md px-2 py-1" />
                      ) : (
                        r.email
                      )}
                    </td>
                    {!isViewer && (
                      <td className="px-4 py-2 align-top">
                        {editId === r.id ? (
                          <div className="flex gap-2">
                            <button onClick={saveEdit} className="px-3 py-1 rounded-md bg-green-600 text-white">Save</button>
                            <button onClick={cancelEdit} className="px-3 py-1 rounded-md border border-slate-300">Cancel</button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <button onClick={() => startEdit(r)} className="px-3 py-1 rounded-md border border-slate-300">Edit</button>
                            <button onClick={() => remove(r.id)} className="px-3 py-1 rounded-md bg-red-600 text-white">Delete</button>
                          </div>
                        )}
                      </td>
                    )}
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
