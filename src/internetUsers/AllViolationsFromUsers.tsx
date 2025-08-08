import { useEffect, useState } from "react";
import axios from "axios";
import { route } from "../config";
import GradientSidebar from "../components/Sidebar";

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

  useEffect(() => {
    axios
      .get(`${route}/allViolationsFromUsers`)
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

  return (
    <div  className="flex min-h-screen">
    <GradientSidebar />
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
        All Violations From Users
      </h1>
      <div className="overflow-x-auto">
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
            {violations.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  No violations found.
                </td>
              </tr>
            )}
            {violations.map((v) => (
              <tr key={v.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{v.id}</td>
                <td className="border border-gray-300 px-4 py-2">{v.internet_user?.username || "-"}</td>
                <td className="border border-gray-300 px-4 py-2">{v.violation_type?.name || "-"}</td>
                <td className="border border-gray-300 px-4 py-2">{v.comment || "-"}</td>
                <td className="border border-gray-300 px-4 py-2">{new Date(v.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
}
