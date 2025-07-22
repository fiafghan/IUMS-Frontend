import { useState } from "react";
import axios from "axios";
import { Building2, Loader2 } from "lucide-react";
import GradientSidebar from "./components/Sidebar"; // adjust the path if needed

export default function DeputyMinistryForm() {
  const [name, setName] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Deputy Ministry name is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess(false);

      await axios.post("http://localhost:3000/deputy_ministries", { name });

      setSuccess(true);
      setName("");
    } catch (err) {
      setError("Failed to submit. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64">
        <GradientSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="text-blue-400 w-6 h-6" />
            <h1 className="text-xl font-semibold text-blue-400">Add Deputy Ministry</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Deputy Ministry Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="e.g., Deputy of Planning"
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
            {success && <p className="text-sm text-green-600">Successfully submitted!</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-400 hover:bg-blue-300 text-white px-4 py-2 rounded-md transition"
            >
              {loading && <Loader2 className="animate-spin w-4 h-4" />}
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
