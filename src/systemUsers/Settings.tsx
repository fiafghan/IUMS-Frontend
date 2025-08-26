import { useState, useEffect, type JSX } from "react";
import { Mail, Lock, User, Settings as SettingsIcon, Shield, Key, UserCheck } from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Spinner from "../components/Spinner";
import AnimatedSubmitButton from "../components/AnimatedButton";
import Swal from "sweetalert2";
import { route } from "../config";
import GradientSidebar from "../components/Sidebar";

export default function SettingsPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");

  // Load user data on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");

    if (!storedUser) {
      console.error("User not logged in");
      return;
    }

    try {
      const userData = JSON.parse(storedUser);

      const token = userData.token;
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      const userId = userData.user?.id;

      if (!userId) {
        console.error("User ID not found in localStorage data");
        return;
      }

      setUserId(userId);

      // Fetch user profile data using API with token
      axios.get(`${route}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          const user = response.data.user;
          setForm({
            name: user.name || "",
            email: user.email || "",
            password: "", // blank on purpose
          });
        })
        .catch((error) => {
          console.error("User fetch failed:", error);
        });
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
    }
  }, []);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission for updating profile
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Basic client validation
    if (!form.name.trim() || !form.email.trim()) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Name and email cannot be empty.",
        footer: 'Press Okay!'
      });
      return;
    }
    setLoading(true);
    const storedUser = localStorage.getItem("loggedInUser");
    const token = storedUser ? JSON.parse(storedUser).token : "";
    try {
      const payload: any = {
        name: form.name,
        email: form.email,
      };
      if (form.password && form.password.trim() !== "") {
        payload.password = form.password;
      }
      console.log("Sending payload:", payload);
      await axios.put(
        `${route}/update-profile/${userId}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const Toast = Swal.mixin({
        toast: true,
        position: "bottom-end",          // bottom-right
        showConfirmButton: false,        // no OK button
        timer: 2500,                     // auto close (ms)
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
        title: "Profile Updated Successfully!",
        icon: "success",
        // draggable is supported in newer SweetAlert2 versions
        draggable: true,
      });
      setForm((prev) => ({ ...prev, password: "" })); // Clear password field after update
    } catch (error: any) {
      console.error("Update error:", error);
      if (error.response && error.response.data && error.response.data.errors) {
        // Show backend validation errors
        const errors = error.response.data.errors;
        const messages = Object.values(errors)
          .map((errArr: any) => (Array.isArray(errArr) ? errArr.join(" ") : errArr))
          .join("\n");
        alert("❌ Failed to update profile:\n" + messages);
      } else {
        alert("❌ Failed to update profile.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            key="spinner-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
          >
            <Spinner size={40} colorClass="border-white" />
          </motion.div>
        )}
      </AnimatePresence>

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
                <SettingsIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                  Account Settings
                </h1>
                <p className="text-slate-600 mt-1 font-medium">
                  Manage your profile information and security settings
                </p>
              </div>
            </div>
          </motion.div>

          {/* Settings Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            {/* Profile Information Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden mb-8"
            >
              {/* Card Header */}
              <div className="px-8 py-6 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-xl">
                    <UserCheck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Profile Information</h2>
                    <p className="text-blue-100 text-sm">Update your personal details</p>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Name Field */}
                  <InputField
                    label="Full Name"
                    icon={<User className="w-5 h-5 text-blue-600" />}
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={handleChange}
                    animation={{ x: -30, opacity: 0 }}
                    delay={0.5}
                  />

                  {/* Email Field */}
                  <InputField
                    label="Email Address"
                    icon={<Mail className="w-5 h-5 text-blue-600" />}
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={form.email}
                    onChange={handleChange}
                    animation={{ x: 30, opacity: 0 }}
                    delay={0.6}
                  />

                  {/* Password Field */}
                  <InputField
                    label="New Password"
                    icon={<Lock className="w-5 h-5 text-blue-600" />}
                    name="password"
                    type="password"
                    placeholder="Leave blank to keep current password"
                    value={form.password}
                    onChange={handleChange}
                    animation={{ y: 30, opacity: 0 }}
                    delay={0.7}
                  />

                  {/* Submit Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="pt-4"
                  >
                    <AnimatedSubmitButton disabled={loading}>
                      {loading ? "Updating Profile..." : "Update Profile"}
                    </AnimatedSubmitButton>
                  </motion.div>
                </form>
              </div>
            </motion.div>

            {/* Security Information Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
            >
              {/* Card Header */}
              <div className="px-8 py-6 bg-gradient-to-r from-emerald-600 to-emerald-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-xl">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Security Settings</h2>
                    <p className="text-emerald-100 text-sm">Manage your account security</p>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Password Security */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Key className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-blue-900">Password Security</h3>
                    </div>
                    <p className="text-blue-700 text-sm leading-relaxed">
                      Keep your password strong and unique. Use a combination of letters, numbers, and special characters.
                    </p>
                  </div>

                  {/* Account Protection */}
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <Shield className="w-5 h-5 text-emerald-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-emerald-900">Account Protection</h3>
                    </div>
                    <p className="text-emerald-700 text-sm leading-relaxed">
                      Your account is protected with secure authentication. Always log out when using shared devices.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </>
  );
}

type InputProps = {
  label: string;
  icon: JSX.Element;
  name: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  animation: { [key: string]: any };
  delay: number;
};

function InputField({
  label,
  icon,
  name,
  type,
  placeholder,
  value,
  onChange,
  animation,
  delay,
}: InputProps) {
  return (
    <motion.div
      className="space-y-3"
      initial={animation}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.5 }}
    >
      <label htmlFor={name} className="block text-sm font-semibold text-slate-700">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          {icon}
        </div>
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:bg-white hover:border-slate-300"
        />
      </div>
    </motion.div>
  );
}
