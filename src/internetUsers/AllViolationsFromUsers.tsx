import { useEffect, useState } from "react";
import axios from "axios";
import { route } from "../config";
import GradientSidebar from "../components/Sidebar";
import React from "react";

interface Violation {
  id: number;
  internet_user: {
    id: number;
    username: string;
  };
  violation_type: {
    id: number;
    name: string;
  };
  comment: string;
  created_at: string;
}

export default function AllViolationsFromUsers() {
  const [violations, setViolations] = useState<Violation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [expandedUsers, setExpandedUsers] = useState<Record<string, boolean>>({});
  const [mergedUsers, setMergedUsers] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState<string>("");





  const toggleMerge = (username: string) => {
    if (mergedUsers[username]) {
      setMergedUsers(prev => ({ ...prev, [username]: false }));
      setExpandedUsers(prev => ({ ...prev, [username]: true }));
    } else {
      setMergedUsers(prev => ({ ...prev, [username]: true }));
      setExpandedUsers(prev => ({ ...prev, [username]: false }));
    }
  };


  useEffect(() => {
    const { token } = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
    axios
      .get(`${route}/allViolationsFromUsers`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      })
      .then((res) => {
        setViolations(res.data.data || []);
      })
      .catch(() => {
        setError("Failed to load violations.");
      })
      .finally(() => setLoading(false));
  }, []);
  if (loading) return <p className="text-center mt-6">Loading...</p>;
  if (error) return <p className="text-center mt-6 text-red-600">{error}</p>;

  const usernameCounts: Record<string, number> = {};
  violations.forEach(v => {
    const username = v.internet_user?.username || "";
    if (username) usernameCounts[username] = (usernameCounts[username] || 0) + 1;
  });

  const groupedViolations: Record<string, Violation[]> = {};
  violations.forEach(v => {
    const username = v.internet_user?.username || "-";
    if (!groupedViolations[username]) groupedViolations[username] = [];
    groupedViolations[username].push(v);
  });

  const filteredGroupedViolations: Record<string, Violation[]> = {};
  Object.entries(groupedViolations).forEach(([username, userViolations]) => {
    const filtered = userViolations.filter(v =>
      username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.violation_type?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.comment || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filtered.length > 0) {
      filteredGroupedViolations[username] = filtered;
    }
  });

  return (
    <div className="flex min-h-screen">
      <GradientSidebar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
          All Violations From Users
        </h1>
        <div className="overflow-x-auto">
          <div className="mb-4 flex justify-center">
            <input
              type="text"
              placeholder="🔍 Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md px-4 py-2 border-2 border-b-blue-400 border-l-blue-400 
              border-r-blue-400 border-t-gray-200 rounded shadow 
              focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <table className="min-w-full border border-gray-300 rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2">ID</th>
                <th className="border border-gray-300 px-4 py-2">User</th>
                <th className="border border-gray-300 px-4 py-2">Violation Type</th>
                <th className="border border-gray-300 px-4 py-2">Comment</th>
                <th className="border border-gray-300 px-4 py-2">Created At</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(filteredGroupedViolations).length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-4">No violations found.</td>
                </tr>
              )}
              {Object.entries(filteredGroupedViolations).map(([username, userViolations]) => (
                <React.Fragment key={username}>
                  {mergedUsers[username] !== false && (
                    <tr
                      className="bg-gray-100 hover:bg-gray-50 cursor-pointer"
                      onClick={() => toggleMerge(username)}
                    >
                      <td className="border px-4 py-2">{userViolations.map(v => v.id).join(", ")}</td>
                      <td className="border px-4 py-2">
                        {username}
                        {usernameCounts[username] > 1 ? (
                          <span className="text-white bg-red-600 p-1 text-[7px] ml-2">
                            D
                          </span>
                        ) : (
                          <span className="text-white bg-green-600 p-1 text-[7px] ml-2">
                            A
                          </span>
                        )}
                        <button className="ml-2">{expandedUsers[username] ? "" : ""}</button>
                      </td>
                      <td className="border px-4 py-2">{userViolations.map(v => v.violation_type?.name).join(", ")}</td>
                      <td className="border px-4 py-2">{userViolations.map(v => v.comment || "-").join(", ")}</td>
                      <td className="border px-4 py-2">
                        {userViolations.map(v => {
                          const dateStr = new Date(v.created_at)
                            .toLocaleDateString(undefined, { year: '2-digit', month: '2-digit', day: '2-digit' });
                          return dateStr.length > 30 ? dateStr.slice(0, 30) + "..." : dateStr;
                        }).join(", ")}
                      </td>
                    </tr>
                  )}

                  {expandedUsers[username] &&
                    userViolations.map(v => (
                      <tr key={v.id} className="bg-white hover:bg-gray-50" onClick={() => toggleMerge(username)}>
                        <td className="border px-4 py-2">{v.id}</td>
                        <td className="border px-4 py-2">{v.internet_user?.username}</td>
                        <td className="border px-4 py-2">{v.violation_type?.name}</td>
                        <td className="border px-4 py-2">{v.comment}</td>
                        <td className="border px-4 py-2">{new Date(v.created_at).toLocaleString()}</td>
                      </tr>
                    ))}
                </React.Fragment>
              ))}


            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}