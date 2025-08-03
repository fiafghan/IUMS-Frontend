import { useState, type JSX } from "react";
import { AlertTriangle, Plus } from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Spinner from "./components/Spinner";
import { route } from "./config";

interface ViolationForm {
  name: string;
}

export default function AddViolationType(): JSX.Element {
  const [form, setForm] = useState<ViolationForm>({
    name: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!form.name.trim()) {
      newErrors.name = "Violation name is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const payload = {
        name: form.name.trim(),
      };

      await axios.post(`${route}/violation`, payload);
      
      alert("✅ Violation type added successfully!");
      
      // Reset form
      setForm({ name: ""});
      
      // Navigate back or to violations list
      navigate("/allviolations"); // Adjust route as needed
      
    } catch (error: any) {
      console.error("Error adding violation:", error);
      
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        alert("❌ Failed to add violation type. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Loading Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="spinner-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.75 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
          >
            <Spinner size={48} thickness={5} colorClass="border-white" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-100 flex items-center justify-center px-4 py-12">
        <motion.div
          className="w-full max-w-md bg-white shadow-2xl border border-gray-200 rounded-3xl px-10 py-12"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <AlertTriangle className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Add Violation Type</h1>
            <p className="text-gray-600">Create a new violation type for the system</p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Violation Name Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
                Violation Name *
              </label>
              <div className="flex items-center gap-3 bg-gray-100 border border-gray-300 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-red-400 focus-within:ring-offset-1 transition">
                <AlertTriangle className="w-5 h-5 text-gray-500" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter violation name"
                  className="w-full bg-transparent text-gray-800 text-sm focus:outline-none"
                  required
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-base font-semibold tracking-wide rounded-2xl bg-gradient-to-r 
              from-blue-400 to-blue-200 text-white hover:from-red-600 hover:to-orange-600 
              focus:outline-none focus:ring-4 focus:ring-red-300 disabled:opacity-50 
              disabled:cursor-not-allowed transition-all duration-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Spinner size={20} thickness={3} colorClass="border-white" />
                  <span>Adding...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Plus className="w-5 h-5" />
                  <span>Add Violation Type</span>
                </div>
              )}
            </motion.button>

            {/* Cancel Button */}
            <motion.button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full py-3 text-base font-medium tracking-wide rounded-2xl border-2 border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all duration-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              Cancel
            </motion.button>
          </form>
        </motion.div>
      </div>
    </>
  );
}