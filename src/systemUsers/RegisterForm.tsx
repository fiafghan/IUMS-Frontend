import { useState } from "react";
import axios from "axios";
import { User, Mail, Lock, Shield } from "lucide-react";
import { route } from "../config";

export default function RegisterForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    isAdmin: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
  if (!currentUser.token || currentUser.user.role !== "Admin") {
    return <p className="text-red-500 text-center mt-10">شما اجازه ثبت نام ندارید. لطفاً با حساب ادمین وارد شوید.</p>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = JSON.parse(localStorage.getItem("loggedInUser") || "{}").token;
      console.log(token);
      await axios.post(
        `${route}/register`,
        {
          name: form.name,
          email: form.email,
          password: form.password,
          password_confirmation: form.password_confirmation,
          role_id: form.isAdmin ? 1 : 2,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      alert("Registration successful!");
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

  return (
    <div className="max-w-md mx-auto mt-12 bg-white shadow-lg rounded-xl p-8 space-y-6 border border-gray-200">
      <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-2 rounded">
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
        </div>

        <label className="flex items-center space-x-2 text-sm text-gray-600">
          <input
            type="checkbox"
            name="isAdmin"
            checked={form.isAdmin}
            onChange={handleChange}
            className="accent-indigo-500"
          />
          <Shield size={16} />
          <span>Register as Admin</span>
        </label>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-md font-medium transition"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
