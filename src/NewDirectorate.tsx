import { useEffect, useState } from "react";
import axios from "axios";
import GradientSidebar from "./components/Sidebar";
import { PlusCircle } from "lucide-react";

interface DeputyMinistry {
  id: string;
  name: string;
}

export default function NewDirectorate() {
  const [name, setName] = useState("");
  const [deputyMinistryId, setDeputyMinistryId] = useState("");
  const [deputyMinistries, setDeputyMinistries] = useState<DeputyMinistry[]>([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3000/deputy_ministries")
      .then((res) => setDeputyMinistries(res.data))
      .catch(() => setError("Failed to load deputy ministries"));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!name || !deputyMinistryId) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      await axios.post("http://localhost:3000/directorates", {
        name,
        deputyMinistryId,
      });
      setSuccess(true);
      setName("");
      setDeputyMinistryId("");
    } catch (err) {
      setError("Failed to save directorate.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-64">
        <GradientSidebar />
      </div>

      <div className="flex-1 p-6 ml-80 mt-30">
        <div className="flex items-center gap-2 mb-6">
          <PlusCircle className="text-blue-400 w-6 h-6" />
          <h1 className="text-2xl font-bold text-blue-400">Add New Directorate</h1>
        </div>

        {success && (
          <div className="mb-4 text-green-600 bg-green-100 p-3 rounded shadow">
            Directorate successfully created!
          </div>
        )}
        {error && (
          <div className="mb-4 text-red-600 bg-red-100 p-3 rounded shadow">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow border border-gray-200 max-w-lg"
        >
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Directorate Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter directorate name"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-1">
              Related Deputy Ministry
            </label>
            <select
              value={deputyMinistryId}
              onChange={(e) => setDeputyMinistryId(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a deputy ministry</option>
              {deputyMinistries.map((dm) => (
                <option key={dm.id} value={dm.id}>
                  {dm.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-400 hover:bg-blue-300 text-white font-medium px-5 py-2 rounded transition"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
}
