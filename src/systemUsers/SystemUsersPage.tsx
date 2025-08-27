import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, Users, Search, UserPlus, UserCheck, Mail, Crown, Eye } from "lucide-react";
import GradientSidebar from "../components/Sidebar";
import type { User } from "../types/types";
import { route } from "../config";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

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

  const getRoleIcon = (roleName: string) => {
    switch (roleName?.toLowerCase()) {
      case 'admin':
        return <Crown className="w-4 h-4 text-amber-500" />;
      case 'user':
        return <UserCheck className="w-4 h-4 text-blue-500" />;
      case 'viewer':
        return <Eye className="w-4 h-4 text-green-500" />;
      default:
        return <UserCheck className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleBadge = (roleName: string) => {
    switch (roleName?.toLowerCase()) {
      case 'admin':
        return "bg-gradient-to-r from-amber-500 to-orange-500 text-white";
      case 'user':
        return "bg-gradient-to-r from-blue-500 to-indigo-500 text-white";
      case 'viewer':
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="fixed top-0 left-0 bottom-0 w-64 border-r border-slate-200 bg-white shadow-lg z-20">
        <GradientSidebar />
      </div>
      
      <main className="flex-1 ml-64 p-8 overflow-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                System Users
              </h1>
              <p className="text-slate-600 mt-1 font-medium">
                Manage system user accounts and permissions
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search and Actions Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6">
            <div className="flex items-center justify-between">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-white bg-gradient-to-r 
                  from-slate-800 to-slate-600 rounded-full p-1" />
                </div>
                <input
                  type="text"
                  placeholder="Search users by name, email, or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:bg-white hover:border-slate-300"
                />
              </div>

              {/* Add User Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/register")}
                className="px-6 py-3 bg-gradient-to-r from-slate-800 
                to-slate-600 text-white rounded-xl font-medium
                 hover:bg-slate-400 transition-all duration-200 shadow-lg 
                 hover:shadow-xl flex items-center gap-2"
              >
                <UserPlus className="w-5 h-5" />
                Add New User
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white border-b border-slate-700">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white border-b border-slate-700">User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white border-b border-slate-700">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white border-b border-slate-700">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white border-b border-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .filter(user =>
                    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.role_name.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 text-sm font-mono text-slate-600">#{user.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {user.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{user.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-700">{user.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getRoleIcon(user.role_name)}
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadge(user.role_name)}`}>
                            {user.role_name === "Admin" ? "Admin" : user.role_name === "User" ? "User" : "Viewer"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleEditClick(user)}
                            className="p-2 bg-slate-800 text-white rounded-lg hover:bg-slate-600 transition-colors duration-200"
                            title="Edit User"
                          >
                            <Pencil className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDelete(user.id)}
                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Edit Modal */}
        <AnimatePresence>
          {showEditModal && editUser && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
              >
                {/* Modal Header */}
                <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <UserCheck className="w-5 h-5" />
                    Edit User
                  </h2>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={editUser.name}
                      onChange={(e) =>
                        setEditUser({ ...editUser, name: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={editUser.email}
                      onChange={(e) =>
                        setEditUser({ ...editUser, email: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
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
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="Leave empty to keep current password"
                    />
                    {passwordError && (
                      <p className="text-red-600 text-sm mt-2">{passwordError}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Role</label>
                    <select
                      value={editUser.role_id}
                      onChange={(e) =>
                        setEditUser({ ...editUser, role_id: parseInt(e.target.value) })
                      }
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    >
                      <option value={1}>Admin</option>
                      <option value={2}>User</option>
                      <option value={3}>Viewer</option>
                    </select>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 bg-slate-50 flex justify-end gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowEditModal(false)}
                    className="px-6 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-white transition-colors duration-200"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSaveEdit}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                  >
                    Save Changes
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
