import { useState, type JSX } from "react";
import { Mail, Lock } from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSubmitButton from "../components/AnimatedButton";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router-dom";
import { route } from "../config";
import Swal from "sweetalert2";

export default function LoginForm(): JSX.Element {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {

      const response = await axios.post(`${route}/login`, {
        email: form.email,
        password: form.password,

      });

      const user = response.data;

      if (user) {
        localStorage.setItem("loggedInUser", JSON.stringify(response.data));
        Swal.fire({
          toast: true,
          position: "bottom-end",
          icon: "success",
          title: "Login Successful!",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          background: "#1e293b", // slate-800
          color: "#f1f5f9",       // slate-100
          customClass: {
            popup: "rounded-2xl shadow-lg backdrop-blur-sm",
            title: "text-lg font-semibold",
          },
        });

        setForm({ email: "", password: "" });
        localStorage.setItem("loggedInUser", JSON.stringify({
          token: response.data.token,
          user: response.data.user
        }));
        navigate('/');
      } else {
        Swal.fire({
          icon: "error",
          title: "Invalid Credentials!",
          text: "Please Try Again!",
          footer: 'Press Okay!'
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      Swal.fire({
        toast: true,
        position: "bottom-end",
        icon: "error",
        title: "Invalid Credentials!",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        background: "#1e293b", // slate-800
        color: "#f1f5f9",       // slate-100
        customClass: {
          popup: "rounded-2xl shadow-lg backdrop-blur-sm",
          title: "text-lg font-semibold",
        },
      });

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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
            aria-label="Loading..."
            role="alert"
            aria-live="assertive"
          >
            <Spinner
              size={48}
              thickness={5}
              colorClass="border-white"
              ariaLabel="Loading form submission"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Pattern */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="absolute inset-0 opacity-40 bg-slate-200/20"></div>
      </div>

      {/* Main form content */}
      <div className="scale-70">
        <motion.div
          className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <motion.form
            onSubmit={handleSubmit}
            className="w-full max-w-md bg-white/90 backdrop-blur-xl shadow-2xl border border-white/20 rounded-3xl px-10 py-12 relative z-10"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <motion.h2
              className="text-4xl font-extrabold text-center text-slate-800 mb-10 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                Login to Your Account
              </span>
            </motion.h2>

            {/* Email */}
            <InputField
              label="Email"
              icon={<Mail className="w-5 h-5 text-blue-600" />}
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              animation={{ x: -40, opacity: 0 }}
              delay={0.4}
            />

            {/* Password */}
            <InputField
              label="Password"
              icon={<Lock className="w-5 h-5 text-blue-600" />}
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              animation={{ x: 40, opacity: 0 }}
              delay={0.5}
            />

            {/* Submit Button */}
            <AnimatedSubmitButton disabled={loading}>
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Spinner />
                  <span>Logging in...</span>
                </div>
              ) : (
                "Login"
              )}
            </AnimatedSubmitButton>
          </motion.form>
        </motion.div>
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
        className="block mb-2 text-sm font-semibold text-slate-700"
      >
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
          {icon}
        </div>
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-slate-100"
        />
      </div>
    </motion.div>
  );
}