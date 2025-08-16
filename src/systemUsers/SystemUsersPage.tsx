import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import GradientSidebar from "../components/Sidebar";
import type { User } from "../types/types";
import { route } from "../config";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

export default function SystemUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [searchTerm, setSearchTerm] = useState("");


  const navigate = useNavigate()

  const handleEditClick = (user: User) => {
    setEditUser({
      ...user,
      role_id:
        user.role_id ||
        (user.role_name === "Admin"
          ? 1
          : user.role_name === "User"
            ? 2
            : user.role_name === "viewer" ? 3 : 0) // viewer
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!editUser) return;

    const payload: any = {
      id: editUser.id,
      name: editUser.name,
      email: editUser.email,
      role_id: editUser.role_id,
    };

    if (editUser.password && editUser.password.trim() !== "") {
      payload.password = editUser.password;
    }
    const { token } = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
    axios.put(`${route}/user/${editUser.id}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(() => {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === editUser.id
              ? {
                ...editUser,
                role_name:
                  editUser.role_id === 1 ? "Admin"
                    : editUser.role_id === 2 ? "User"
                      : editUser.role_id === 3 ? "Viewer" : "",
              }
              : u
          )
        );
        setShowEditModal(false);
        setEditUser(null);
      });
  };


  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      const { token } = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
      axios.delete(`${route}/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(() => {
        setUsers((prev) => prev.filter((u) => u.id !== id));
      });
    }
  };

  useEffect(() => {
    const { token } = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
    axios.get(`${route}/user`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => {
      console.log(res.data)
      setUsers(res.data);
    });
  }, []);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64">
        <GradientSidebar />
      </div>
      <div className="p-6 w-full">
        <h1 className="text-xl font-bold mb-6 text-center bg-blue-300 rounded-md text-white py-2 border-l-3 border-l-amber-300">All System Users</h1>
        <div className="mb-4 flex items-center justify-between">
          <div className="relative w-1/3 ml-2">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-white bg-blue-300 rounded-full p-1 border-1 border-l-amber-400" />
            </span>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-lg border shadow-sm focus:outline-none
               focus:ring-blue-400 focus:border-blue-200 placeholder-gray-400 border-l-2 border-l-amber-300 border-blue-200"
            />
          </div>
          <button
            className="px-4 py-2 bg-blue-300 text-white rounded-lg hover:bg-blue-500 transition duration-200 mr-3"
            onClick={() => navigate("/register")}
          >
            <span className="text-xl mr-2 text-amber-400">+</span>Add User 
          </button>
        </div>
        <div className="overflow-x-auto rounded-sm shadow overflow-y-auto max-h-[400px] ">
          <table className="w-full text-left border-collapse">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-4 py-2 border-b border-blue-300 bg-blue-300 text-white text-sm">ID</th>
                <th className="px-4 py-2 border-b border-blue-300 bg-blue-300 text-white text-sm">Name</th>
                <th className="px-4 py-2 border-b border-blue-300 bg-blue-300 text-white text-sm">Email</th>
                <th className="px-4 py-2 border-b border-blue-300 bg-blue-300 text-white text-sm">Role</th>
                <th className="px-4 py-2 border-b border-blue-300 bg-blue-300 text-white text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users
                .filter(user =>
                  user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  user.role_name.toLowerCase().includes(searchTerm.toLowerCase())
                ).map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b border-r border-blue-300">{user.id}</td>
                    <td className="px-4 py-2 border-b border-r border-blue-300">{user.name}</td>
                    <td className="px-4 py-2 border-b border-blue-300">{user.email}</td>
                    <td className="px-4 py-2 border-b border-blue-300 bg-blue-300 text-white w-30">
                      {user.role_name === "Admin" ? "Admin" : user.role_name === "User" ? "User" : "Viewer"}
                    </td>
                    <td className="px-4 py-2 border-b space-x-2 border-blue-300 bg-blue-300">
                      <button onClick={() => handleEditClick(user)} className="">
                        <Pencil className="w-4 h-4 inline text-white hover:text-gray-200" />
                      </button>
                      <button onClick={() => handleDelete(user.id)} className="text-white">
                        <Trash2 className="w-4 h-4 inline hover:text-gray-200" />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {showEditModal && editUser && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg space-y-4">
                <h2 className="text-xl font-bold">Edit User</h2>
                <div className="space-y-2">
                  <label className="block">
                    Name:
                    <input
                      type="text"
                      value={editUser.name}
                      onChange={(e) =>
                        setEditUser({ ...editUser, name: e.target.value })
                      }
                      className="w-full border px-3 py-1.5 rounded"
                    />
                  </label>
                  <label className="block">
                    Email:
                    <input
                      type="email"
                      value={editUser.email}
                      onChange={(e) =>
                        setEditUser({ ...editUser, email: e.target.value })
                      }
                      className="w-full border px-3 py-1.5 rounded"
                    />
                    <label className="block">
                      Password:
                      <input
                        type="text"
                        value={editUser.password || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEditUser({ ...editUser, password: val });

                          if (val.length > 0 && val.length < 6) {
                            setPasswordError("Password Must Be At Least 6 Characters!");
                          } else {
                            setPasswordError("");
                          }
                        }}
                        className="w-full border px-3 py-1.5 rounded"
                      />
                      <span className="text-sm text-gray-500">Leave empty to keep current password</span>
                      {passwordError && (
                        <p className="text-red-600 text-sm mt-1">{passwordError}</p>
                      )}
                    </label>
                  </label>

                  <label className="block">
                    Role:
                    <select
                      value={editUser.role_id}
                      onChange={(e) =>
                        setEditUser({ ...editUser, role_id: parseInt(e.target.value) })
                      }
                      className="w-full border px-3 py-1.5 rounded"
                    >
                      <option value={1}>Admin</option>
                      <option value={2}>User</option>
                      <option value={3}>Viewer</option>
                    </select>
                  </label>


                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 border rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
