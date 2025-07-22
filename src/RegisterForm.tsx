import { useState, type JSX } from "react";
import { Mail, Lock, User } from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSubmitButton from "./components/AnimatedButton";
import Spinner from "./components/Spinner";
import { useNavigate } from "react-router-dom";

export default function RegisterForm(): JSX.Element {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    isAdmin: false,
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, type, checked, value } = e.target;
      setForm({
        ...form,
        [name]: type === "checkbox" ? checked : value,
        });
      };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("❌ Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/register', {
        name: form.name,
        email: form.email,
        password: form.password,
        isAdmin: form.isAdmin,
      });

      alert("✅ Registration successful!");
      console.log("Registered:", response.data);

      setForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        isAdmin: false,
      });
      navigate('/');
    } catch (error) {
      console.error("Error registering user:", error);
      alert("❌ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Page Spinner Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="spinner-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.75 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center 
            bg-black bg-opacity-50 backdrop-blur-sm"
            aria-label="Loading..."
            role="alert"
            aria-live="assertive"
          >
            <Spinner size={48} thickness={5} colorClass="border-white" ariaLabel="Loading form submission" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main form content */}
      <motion.div
        className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 
        flex items-center justify-center px-4 py-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <motion.form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white shadow-2xl border border-gray-200 
          rounded-3xl px-10 py-12 relative z-10"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <motion.h2
            className="text-4xl font-extrabold text-center text-gray-800 mb-10 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <span className="bg-gradient-to-r from-blue-400 to-blue-300 
            text-transparent bg-clip-text">
              Create Account
            </span>
          </motion.h2>

          {/* Full Name */}
          <InputField
            label="Full Name"
            icon={<User className="w-5 h-5 text-gray-500" />}
            name="name"
            type="text"
            placeholder="John Doe"
            value={form.name}
            onChange={handleChange}
            animation={{ x: -40, opacity: 0 }}
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
            animation={{ x: 40, opacity: 0 }}
            delay={0.5}
          />

          {/* Password */}
          <InputField
            label="Password"
            icon={<Lock className="w-5 h-5 text-gray-500" />}
            name="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            animation={{ y: -40, opacity: 0 }}
            delay={0.6}
          />

          {/* Confirm Password */}
          <InputField
            label="Confirm Password"
            icon={<Lock className="w-5 h-5 text-gray-500" />}
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={form.confirmPassword}
            onChange={handleChange}
            animation={{ y: 40, opacity: 0 }}
            delay={0.7}
          />

              <motion.div
              className="mb-6 flex items-center gap-2"
              initial={{ x: 0, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <input
                id="isAdmin"
                name="isAdmin"
                type="checkbox"
                checked={form.isAdmin}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label htmlFor="isAdmin" className="text-sm text-gray-700">
                Is Admin?
              </label>
            </motion.div>


          {/* Submit Button */}
          <AnimatedSubmitButton disabled={loading}>
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <Spinner />
                <span>Submitting...</span>
              </div>
            ) : (
              "Register"
            )}
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
}: InputProps): JSX.Element {
  return (
    <motion.div
      className="mb-6"
      initial={animation}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
    >
      <label
        htmlFor={name}
        className="block mb-1 text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div className="flex items-center gap-2 bg-gray-100 border border-gray-300 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-blue-400 focus-within:ring-offset-1 transition">
        {icon}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          className="w-full bg-transparent text-gray-800 text-sm placeholder-gray-400 focus:outline-none"
        />
      </div>
    </motion.div>
  );
}
