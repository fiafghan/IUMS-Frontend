import { useState } from "react";
import axios from "axios";
import { User, Mail, Lock, UserPlus, Shield, Crown, UserCheck, Eye, ArrowLeft } from "lucide-react";
import { route } from "../config";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

export default function RegisterForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "User",
  });

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailExists, setEmailExists] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
  if (!currentUser.token || currentUser.user.role !== "Admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md mx-4 text-center">
          <div className="p-4 bg-red-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <Shield className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
          <p className="text-red-500">You must be an Admin to access this page.</p>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });

    if (name === "email") {
      checkEmailExists(value);
    }

    if (name === "password" || name === "password_confirmation") {
      if (name === "password" && value.length < 6) {
        setPasswordError("Password must be at least 6 characters!");
      } else if (name === "password" && value.length >= 6) {
        setPasswordError("");
      }
    }

    if (name === "password_confirmation") {
      if (value !== form.password) {
        setPasswordError("Password and Confirm password did not match!");
      } else {
        setPasswordError("");
      }
    }

    if (name === "password" && form.password_confirmation && form.password_confirmation !== value) {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = JSON.parse(localStorage.getItem("loggedInUser") || "{}").token;
      const roleId = form.role === "Admin" ? 1 : form.role === "User" ? 2 : form.role === "Viewer" ? 3 : "";
      await axios.post(
        `${route}/register`,
        {
          name: form.name,
          email: form.email,
          password: form.password,
          password_confirmation: form.password_confirmation,
          role_id: roleId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const Toast = Swal.mixin({
        toast: true,
        position: "bottom-end",          // bottom-right
        showConfirmButton: false,        // no OK button
        timer: 2000,                     // auto close (ms)
        timerProgressBar: true,
        showCloseButton: true,           // small "x" to dismiss
        iconColor: "#22c55e",            // Tailwind green-500
        background: "#0f172a",           // slate-900
        color: "#e2e8f0",                // slate-300
        customClass: {
          popup: "rounded-2xl shadow-2xl ring-1 ring-white/10",
          title: "text-sm font-medium tracking-wide",
          timerProgressBar: "bg-white/40",
        },
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });

      Toast.fire({
        title: "Registration was successful!",
        icon: "success",
        // draggable is supported in newer SweetAlert2 versions
        draggable: true,
      });
      navigate('/all-system-users');
      setForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "User"
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const checkEmailExists = async (email: string) => {
    try {
      const { token } = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
      const response = await axios.post(`${route}/check-email`, { email }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      });
      if (response.data.exists) {
        setEmailExists(true);
      } else {
        setEmailExists(false);
      }
    } catch (error) {
      setEmailExists(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Admin':
        return <Crown className="w-5 h-5 text-orange-200" />;
      case 'User':
        return <UserCheck className="w-5 h-5 text-blue-300" />;
      case 'Viewer':
        return <Eye className="w-5 h-5 text-green-300" />;
      default:
        return <UserCheck className="w-5 h-5 text-white" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return "from-amber-500 to-orange-500";
      case 'User':
        return "from-blue-500 to-indigo-500";
      case 'Viewer':
        return "from-green-500 to-emerald-500";
      default:
        return "from-gray-500 to-slate-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex 
    items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden mb-6"
        >
          <div className="px-8 py-6 bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Register New User</h1>
                <p className="text-blue-100 mt-1 font-medium">Create a new system user account</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
        >
          <div className="p-8">
            {/* Back Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/all-system-users')}
              className="mb-6 px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all duration-200 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Users
            </motion.button>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="space-y-2"
              >
                <label className="block text-sm font-semibold text-slate-700">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-white bg-gradient-to-r from-slate-800 to-slate-600 p-1
                    rounded-full" />
                  </div>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:bg-white hover:border-slate-300"
                  />
                </div>
              </motion.div>

              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="space-y-2"
              >
                <label className="block text-sm font-semibold text-slate-700">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-white bg-gradient-to-r 
                    from-slate-800 to-slate-600 rounded-full p-1" />
                  </div>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="Enter email address"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:bg-white hover:border-slate-300"
                  />
                </div>
                {emailExists && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-600 text-sm flex items-center gap-2 mt-2"
                  >
                    <Shield className="w-4 h-4" />
                    Email already exists
                  </motion.p>
                )}
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="space-y-2"
              >
                <label className="block text-sm font-semibold text-slate-700">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-white bg-gradient-to-r from-slate-800 to-slate-600
                    rounded-full p-1" />
                  </div>
                  <input
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    type="password"
                    placeholder="Enter password"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:bg-white hover:border-slate-300"
                  />
                </div>
              </motion.div>

              {/* Confirm Password Field */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="space-y-2"
              >
                <label className="block text-sm font-semibold text-slate-700">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-white bg-gradient-to-r from-slate-800 to-slate-600
                    rounded-full p-1" />
                  </div>
                  <input
                    name="password_confirmation"
                    value={form.password_confirmation}
                    onChange={handleChange}
                    type="password"
                    placeholder="Confirm your password"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:bg-white hover:border-slate-300"
                  />
                </div>
                {passwordError && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-600 text-sm flex items-center gap-2 mt-2"
                  >
                    <Shield className="w-4 h-4" />
                    {passwordError}
                  </motion.p>
                )}
              </motion.div>

              {/* Role Selection */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.5 }}
                className="space-y-3"
              >
                <label className="block text-sm font-semibold text-slate-700">Select Role</label>
                <div className="grid grid-cols-3 gap-3">
                  {["Admin", "User", "Viewer"].map((role) => (
                    <motion.label
                      key={role}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 ${form.role === role
                          ? `border-blue-500 bg-gradient-to-r ${getRoleColor(role)} text-white shadow-lg`
                          : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100'
                        }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={role}
                        checked={form.role === role}
                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <div className="flex justify-center mb-2">
                          {getRoleIcon(role)}
                        </div>
                        <span className="text-sm font-medium">{role}</span>
                      </div>
                    </motion.label>
                  ))}
                </div>
              </motion.div>

              {/* Error Display */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 border border-red-200 rounded-xl"
                >
                  <p className="text-red-600 text-sm flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    {error}
                  </p>
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.5 }}
                className="pt-4"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 rounded-xl font-medium transition-all duration-200 ${loading
                      ? "bg-slate-400 cursor-not-allowed text-white"
                      : "bg-gradient-to-r from-slate-800 to-slate-500 hover:bg-slate-400 text-white shadow-lg hover:shadow-xl"
                    }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Registering...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <UserPlus className="w-5 h-5" />
                      Register User
                    </div>
                  )}
                </motion.button>
              </motion.div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
