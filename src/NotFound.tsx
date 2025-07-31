// NotFound.tsx
import { useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 flex flex-col 
      items-center justify-center text-center px-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="flex flex-col items-center justify-center bg-white p-10 rounded-sm 
        shadow-2xl border border-gray-200"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <AlertTriangle className="w-16 h-16 text-blue-300 mb-4" />

        <h1 className="text-5xl font-extrabold text-blue-300 mb-2 tracking-tight">
          404
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Sorry, the page you're looking for doesn’t exist.
        </p>

        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-300 text-white text-sm font-semibold 
          rounded-xl hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </motion.div>
    </motion.div>
  );
}
