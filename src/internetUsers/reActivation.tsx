import { useState, useEffect } from "react";
import axios from "axios";
import { route } from "../config";

interface User {
  id: number;
  username: string;
}

export default function ReactivateUserForm() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (search.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    const delayDebounce = setTimeout(() => {
      setLoading(true);
      const { token } = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
      axios
        .get(`${route}/internet-users-deactivated/search?query=${search}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((res) => setResults(res.data))
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return alert("Please select a user");
    if (!reason) return alert("Please write a reason");

    try {
      const { token } = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
      await axios.post(`${route}/reactivate-user`, {
        user_id: selectedUser.id,
        reason,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      });

      alert("Request submitted successfully!");
      setSelectedUser(null);
      setSearch("");
      setReason("");
    } catch (err: any) {
      console.error(err);
      alert("Error submitting request: " + err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white shadow rounded-lg space-y-4"
    >
      <div className="w-full relative">
        <label className="block text-sm font-medium text-gray-700">
          Select Username
        </label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search username..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {loading && <p className="text-gray-400 text-sm mt-1">Loading...</p>}

        {results.length > 0 && (
          <ul className="absolute left-0 right-0 mt-1 max-h-40 overflow-auto bg-white border border-gray-300 rounded-md z-10">
            {results.map((user) => (
              <li
                key={user.id}
                onClick={() => {
                  setSelectedUser(user);
                  setSearch(user.username);
                  setResults([]);
                }}
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
              >
                {user.username}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Reason for Reactivation
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
          placeholder="Write your reason..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
      >
        Submit Request
      </button>
    </form>
  );
}
