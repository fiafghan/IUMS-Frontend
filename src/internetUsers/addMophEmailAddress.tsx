import { useEffect, useState, type JSX } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import GradientSidebar from "../components/Sidebar";
import { route } from "../config";

export default function AddMophEmailAddress(): JSX.Element {
  const [directorate, setDirectorate] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const navigate = useNavigate();

  useEffect(() => {}, []);

  const validate = () => {
    const e: { [k: string]: string } = {};
    if (!directorate.trim()) e.directorate = "Directorate is required";
    if (!email.trim()) e.email = "Email is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { token } = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
      await axios.post(
        `${route}/moph-emails`,
        { directorate: directorate.trim(), email: email.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/all-moph-emails");
    } catch (err: any) {
      if (err?.response?.data?.errors) setErrors(err.response.data.errors);
      else alert("Failed to create record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      <div className="fixed top-0 left-0 bottom-0 w-64 border-r border-slate-200 bg-white shadow-lg z-20">
        <GradientSidebar />
      </div>
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-2xl shadow p-6">
          <h1 className="text-xl font-bold text-slate-800 mb-6">Add MOPH Email</h1>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Directorate</label>
              <input value={directorate} onChange={(e) => setDirectorate(e.target.value)} placeholder="Enter directorate" className="w-full border border-slate-300 rounded-md px-3 py-2" />
              {errors.directorate && <p className="text-sm text-red-600 mt-1">{errors.directorate}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2" />
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 rounded-md border border-slate-300 text-slate-700">Cancel</button>
              <button disabled={loading} type="submit" className="px-4 py-2 rounded-md bg-slate-800 text-white disabled:opacity-50">{loading ? "Saving..." : "Save"}</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
