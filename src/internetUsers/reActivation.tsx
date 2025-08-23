import { useState, useEffect } from "react";
import axios from "axios";
import { route } from "../config";
import { Search, XCircle } from "lucide-react";
import GradientSidebar from "../components/Sidebar";
import Swal from "sweetalert2";

interface User {
  id: number; // Change from internet_user_id to id
  username: string;
}

//

export default function ReactivateUserForm() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [reason, setReason] = useState("");
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    if (search.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    const delayDebounce = setTimeout(() => {
      setLoading(true);
      const { token } = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
      console.log("Submitting user id:", selectedUser?.id);
      console.log("Reason:", reason);

      axios
        .get(`${route}/internet-users-deactivated?query=${search}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => {
          const data = res.data.data || [];
          setResults(data);
          setNoResults(data.length === 0);
        })
        .catch(() => {
          setResults([]);
          setNoResults(true);
        })
        .finally(() => setLoading(false));
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return alert("Please select a user");
    if (!reason) return alert("Please write a reason");

    console.log("Submitting user:", selectedUser);
    console.log("User ID:", selectedUser.id); // Change from internet_user_id to id
    console.log("User ID type:", typeof selectedUser.id);

    // Check if id exists and is valid
    if (!selectedUser.id) {
      alert("Invalid user ID. Please select a user again.");
      return;
    }

    try {
      const { token } = JSON.parse(localStorage.getItem("loggedInUser") || "{}");

      const payload = {
        internet_user_id: Number(selectedUser.id), // Use id instead of internet_user_id
        reason,
      };

      console.log("Sending payload:", payload);

      await axios.post(
        `${route}/account/activate`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      Swal.fire({
        title: "The Internet User Was Successfully Activated!",
        icon: "success",
        draggable: true
      });
      setSelectedUser(null);
      setSearch("");
      setReason("");
    } catch (err: any) {
      console.error("Error response:", err.response?.data);
      console.error("Full error:", err);
      alert("Error submitting request: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-screen flex bg-white shadow-md shadow-indigo-700">
      <div className="fixed top-0 left-0 bottom-0 w-64 border-r border-gray-200 bg-white shadow-sm z-20">
        <GradientSidebar />
      </div>

      <main className="flex-1 ml-64 p-8 overflow-auto">
        <form
          onSubmit={handleSubmit}
          className="max-w-md mx-auto p-6 bg-white shadow-xl rounded-2xl space-y-6 border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-300 to-blue-200">
            Reactivate User
          </h2>

          <div className="w-full relative">
            <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-500" /> Search Username
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedUser(null);
              }}
              placeholder="Start typing..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gradient-to-r from-blue-500 via-blue-400 to-blue-200 transition"
            />

            {loading && <p className="text-gray-400 text-sm mt-1">Loading...</p>}

            {search.length >= 2 && !loading && noResults && (
              <div className="absolute left-0 right-0 mt-1 flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-red-600 z-10">
                <XCircle className="w-5 h-5" />
                <span>No users found</span>
              </div>
            )}

            {results.length > 0 && (
              <ul className="absolute left-0 right-0 mt-1 max-h-44 overflow-auto bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                {results.map((user, index) => (
                  <li
                    key={`${user.id}-${index}`} // Change from internet_user_id to id
                    onClick={() => {
                      setSelectedUser(user);
                      setSearch(user.username);
                      setResults([]);
                    }}
                    className="px-4 py-2 hover:bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 cursor-pointer transition"
                  >
                    {user.username}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Reason for Reactivation
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              placeholder="Write your reason..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gradient-to-r from-blue-400 via-purple-400 to-pink-400 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-200 text-white font-semibold rounded-xl hover:from-blue-400 hover:to-blue-100 transition"
          >
            Submit Request
          </button>
        </form>
      </main>
    </div>
  );
}
