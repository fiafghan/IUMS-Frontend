import { useState } from "react";
import axios from "axios";
import { User, Mail, Lock } from "lucide-react";
import { route } from "../config";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

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
    return <p className="text-red-500 text-center mt-10">You have to be Admin to Proceed!</p>;
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

    // چک یکسان بودن رمز عبور و تایید آن
    if (name === "password_confirmation") {
      if (value !== form.password) {
        setPasswordError("Password and Confirm password did not match!");
      } else {
        setPasswordError("");
      }
    }

    // وقتی پسورد تغییر می‌کند، بررسی کن تاییدش هنوز باهاش یکی هست یا نه
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
      const roleId = form.role === "Admin" ? 1 : form.role === "User" ? 2 : 3;
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

      Swal.fire({
        title: "Registration successful!",
        text: "Registration Was successful!",
        icon: "success"
      });
      navigate('/all-system-users');
      setForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        isAdmin: false,
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

  return (
    <div className="max-w-md mx-auto mt-12 bg-white shadow-lg rounded-xl p-8 space-y-6 border border-gray-200 scale-70">
      <h2 className="text-2xl font-bold text-center bg-white text-blue-300 py-2 rounded">
        Register New User
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <User className="absolute top-3 left-3 text-gray-400" size={20} />
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div className="relative">
          <Mail className="absolute top-3 left-3 text-gray-400" size={20} />
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            placeholder="Email"
            required
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          {emailExists && <p className="text-red-500">Email already exists</p>}
        </div>

        <div className="relative">
          <Lock className="absolute top-3 left-3 text-gray-400" size={20} />
          <input
            name="password"
            value={form.password}
            onChange={handleChange}
            type="password"
            placeholder="Password"
            required
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div className="relative">
          <Lock className="absolute top-3 left-3 text-gray-400" size={20} />
          <input
            name="password_confirmation"
            value={form.password_confirmation}
            onChange={handleChange}
            type="password"
            placeholder="Confirm Password"
            required
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          {passwordError && <p className="text-red-500 mt-1">{passwordError}</p>}        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Select Role</label>
          <div className="flex gap-4 text-[13px]">
            {["Admin (Full Access)", "User (Read/Write)", "Viewer (Read)"].map((r) => (
              <label key={r} className="flex items-center gap-1">
                <input
                  type="radio"
                  name="role"
                  value={r}
                  checked={form.role === r}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                />
                {r}
              </label>
            ))}
          </div>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-300 hover:bg-blue-200 text-white py-2 rounded-md font-medium transition"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
