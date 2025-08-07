import { useState, useEffect, type JSX } from "react";
import { Mail, Lock, User } from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Spinner from "../components/Spinner";
import AnimatedSubmitButton from "../components/AnimatedButton";


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

    // بررسی اینکه آیا توکن وجود دارد یا خیر
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
    axios.get("http://localhost:8000/api/profile", {
      headers: { Authorization: `Bearer ${token}` },  // ارسال توکن در هدر
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
      alert("Name and email cannot be empty.");
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
        `http://localhost:8000/api/update-profile/${userId}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("✅ Profile updated successfully.");
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur"
          >
            <Spinner size={40} colorClass="border-white" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-50 
        flex items-center justify-center px-4 py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white shadow-2xl border border-gray-200 
          rounded-3xl px-10 py-12 relative"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >

          <motion.h2
            className="text-3xl font-bold text-center text-gray-800 mb-8"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <span className="bg-gradient-to-r from-blue-400 to-blue-300 
            text-transparent bg-clip-text">
              Update Profile
            </span>
          </motion.h2>

          {/* Name */}
          <InputField
            label="Full Name"
            icon={<User className="w-5 h-5 text-gray-500" />}
            name="name"
            type="text"
            placeholder="John Doe"
            value={form.name}
            onChange={handleChange}
            animation={{ x: -30, opacity: 0 }}
            delay={0.4}
          />

          {/* Email */}
          <InputField
            label="Email"
            icon={<Mail className="w-5 h-5 text-gray-500" />}
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            animation={{ x: 30, opacity: 0 }}
            delay={0.5}
          />

          {/* Password */}
          <InputField
            label="New Password"
            icon={<Lock className="w-5 h-5 text-gray-500" />}
            name="password"
            type="password"
            placeholder="Leave blank to keep old password"
            value={form.password}
            onChange={handleChange}
            animation={{ y: 30, opacity: 0 }}
            delay={0.6}
          />

          {/* Submit */}
          <AnimatedSubmitButton disabled={loading}>
            {loading ? "Updating..." : "Update"}
          </AnimatedSubmitButton>
        </motion.form>
      </motion.div>
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
      className="mb-6"
      initial={animation}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.5 }}
    >
      <label htmlFor={name} className="block mb-1 text-sm font-semibold text-gray-700">
        {label}
      </label>
      <div className="flex items-center gap-2 bg-gray-100 border border-gray-300 rounded-xl px-4 py-2">
        {icon}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-transparent focus:outline-none text-gray-800 placeholder-gray-400 text-sm"
        />
      </div>
    </motion.div>
  );
}
