import { useNavigate } from "react-router-dom";
import {
  Settings, AlertOctagon, Users, LogOut, ChevronDown, Shield,
  ClipboardList, Mail,
  LayoutDashboard,
  Home as HomeIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, type JSX } from "react";
import axios from "axios";
import { route } from "../config";

export default function GradientSidebar(): JSX.Element {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
  const isAdmin = currentUser?.user.role === 'Admin';
  const isViewer = currentUser?.user.role === 'viewer';

  const logout = async () => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
    const token = loggedInUser.token;
    const user_id = loggedInUser.id;

    if (!token) {
      console.error("❌ No token found. Cannot logout.");
      return;
    }

    try {
      await axios.post(
        `${route}/logout`,
        { id: user_id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      localStorage.removeItem("loggedInUser");
      navigate("/login");
    } catch (error) {
      console.error("❌ Logout failed", error);
    }
  };

  // Toggle states for nested sections
  const [userOpen, setUserOpen] = useState(false);
  const [systemUserOpen, setSystemUserOpen] = useState(false);
  const [violationOpen, setViolationOpen] = useState(false);
  const [mophOpen, setMophOpen] = useState(false);

  // Auto-close other dropdowns when opening one
  const handleDropdownToggle = (dropdownType: 'user' | 'systemUser' | 'violation' | 'moph') => {
    if (dropdownType === 'user') {
      setUserOpen(!userOpen);
      setSystemUserOpen(false);
      setViolationOpen(false);
      setMophOpen(false);
    } else if (dropdownType === 'systemUser') {
      setSystemUserOpen(!systemUserOpen);
      setUserOpen(false);
      setViolationOpen(false);
      setMophOpen(false);
    } else if (dropdownType === 'violation') {
      setViolationOpen(!violationOpen);
      setUserOpen(false);
      setSystemUserOpen(false);
      setMophOpen(false);
    } else if (dropdownType === 'moph') {
      setMophOpen(!mophOpen);
      setUserOpen(false);
      setSystemUserOpen(false);
      setViolationOpen(false);
    }
  };

  const menuVariants = {
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut" as const
      }
    },
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut" as const
      }
    }
  };

  const itemVariants = {
    hover: {
      x: 4,
      transition: { duration: 0.2, ease: "easeInOut" as const }
    }
  };

  return (
    <aside className="w-64 min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col shadow-2xl border-r border-slate-700/50">
      {/* Header Section - Compact */}
      <div className="flex items-center justify-center flex-col py-4 px-4 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-700/50">
        <div className="relative">
          <img src="moph.png" className="rounded-full w-16 h-16 object-cover shadow-lg ring-4 ring-blue-500/20" />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-slate-900 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
        </div>
        <h1 className="text-center mt-2 text-md font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
          MOPH-IUMS
        </h1>
        <p className="text-slate-400 text-xs mt-1 font-medium">Internet Users Management System</p>
      </div>

      {/* Navigation - Compact */}
      <nav className="flex flex-col flex-1 px-3 py-3 space-y-1">
        {/* Website Home */}
        <motion.button
          whileHover={{ scale: 1.02, x: 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/")}
          className="group flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-cyan-500/20 hover:border-blue-500/30 border border-transparent transition-all duration-300 text-slate-300 hover:text-white"
        >
          <div className="p-1.5 bg-gradient-to-br from-slate-500 to-slate-800 rounded-md group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
            <HomeIcon className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-medium text-sm">Home</span>
        </motion.button>

        {/* Dashboard */}
        <motion.button
          whileHover={{ scale: 1.02, x: 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/dashboard")}
          className="group flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-cyan-500/20 hover:border-blue-500/30 border border-transparent transition-all duration-300 text-slate-300 hover:text-white"
        >
          <div className="p-1.5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-md group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
            <LayoutDashboard className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-medium text-sm">Dashboard</span>
        </motion.button>

        {/* All Users Section */}
        <div className="space-y-0.5">
          <motion.button
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleDropdownToggle('user')}
            className="group w-full flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gradient-to-r hover:from-emerald-500/20 hover:to-teal-500/20 hover:border-emerald-500/30 border border-transparent transition-all duration-300 text-slate-300 hover:text-white"
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-md group-hover:shadow-lg group-hover:shadow-emerald-500/25 transition-all duration-300">
                <Users className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-medium text-sm">All Users</span>
            </div>
            <motion.div
              animate={{ rotate: userOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors duration-300" />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {userOpen && (
              <motion.div
                variants={menuVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="ml-6 space-y-0.5 overflow-hidden"
              >
                <motion.button
                  variants={itemVariants}
                  whileHover="hover"
                  onClick={() => navigate("/all-users")}
                  className="flex items-center gap-2 py-1 px-3 text-xs text-slate-400 hover:text-emerald-400 transition-colors duration-200 rounded-md hover:bg-emerald-500/10"
                >
                  <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
                  View All
                </motion.button>
                {!isViewer && (
                  <motion.button
                    variants={itemVariants}
                    whileHover="hover"
                    onClick={() => navigate("/adduser")}
                    className="flex items-center gap-2 py-1 px-3 text-xs text-slate-400 hover:text-emerald-400 transition-colors duration-200 rounded-md hover:bg-emerald-500/10"
                  >
                    <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
                    Add User
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Violations Section */}
        <div className="space-y-0.5">
          <motion.button
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleDropdownToggle('violation')}
            className="group w-full flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-red-500/20 hover:border-orange-500/30 border border-transparent transition-all duration-300 text-slate-300 hover:text-white"
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-br from-orange-500 to-red-500 rounded-md group-hover:shadow-lg group-hover:shadow-orange-500/25 transition-all duration-300">
                <AlertOctagon className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-medium text-sm">Violations</span>
            </div>
            <motion.div
              animate={{ rotate: violationOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors duration-300" />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {violationOpen && (
              <motion.div
                variants={menuVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="ml-6 space-y-0.5 overflow-hidden"
              >
                {currentUser?.user.role !== "viewer" && (
                  <motion.button
                    variants={itemVariants}
                    whileHover="hover"
                    onClick={() => navigate("/addviolation")}
                    className="flex items-center gap-2 py-1 px-3 text-xs text-slate-400 hover:text-orange-400 transition-colors duration-200 rounded-md hover:bg-orange-500/10"
                  >
                    <div className="w-1 h-1 bg-orange-400 rounded-full"></div>
                    Violation Form
                  </motion.button>
                )}
                {currentUser?.user.role !== "viewer" && (
                  <motion.button
                    variants={itemVariants}
                    whileHover="hover"
                    onClick={() => navigate("/re-activate")}
                    className="flex items-center gap-2 py-1 px-3 text-xs text-slate-400 hover:text-orange-400 transition-colors duration-200 rounded-md hover:bg-orange-500/10"
                  >
                    <div className="w-1 h-1 bg-orange-400 rounded-full"></div>
                    Re-Activation
                  </motion.button>
                )}
                {currentUser?.user.role !== "viewer" && (
                  <motion.button
                    variants={itemVariants}
                    whileHover="hover"
                    onClick={() => navigate("/all-re-activations")}
                    className="flex items-center gap-2 py-1 px-3 text-xs text-slate-400 hover:text-orange-400 transition-colors duration-200 rounded-md hover:bg-orange-500/10"
                  >
                    <div className="w-1 h-1 bg-orange-400 rounded-full"></div>
                    All Re-Activations
                  </motion.button>
                )}
                {currentUser?.user.role !== "viewer" && (
                  <motion.button
                    variants={itemVariants}
                    whileHover="hover"
                    onClick={() => navigate("/add-violation-type")}
                    className="flex items-center gap-2 py-1 px-3 text-xs text-slate-400 hover:text-orange-400 transition-colors duration-200 rounded-md hover:bg-orange-500/10"
                  >
                    <div className="w-1 h-1 bg-orange-400 rounded-full"></div>
                    Add Violation Type
                  </motion.button>
                )}
                <motion.button
                  variants={itemVariants}
                  whileHover="hover"
                  onClick={() => navigate("/all-violation-types")}
                  className="flex items-center gap-2 py-1 px-3 text-xs text-slate-400 hover:text-orange-400 transition-colors duration-200 rounded-md hover:bg-orange-500/10"
                >
                  <div className="w-1 h-1 bg-orange-400 rounded-full"></div>
                  All Violation Types
                </motion.button>
                {currentUser?.user.role !== "viewer" && (
                  <motion.button
                    variants={itemVariants}
                    whileHover="hover"
                    onClick={() => navigate("/addviolationonauser")}
                    className="flex items-center gap-2 py-1 px-3 text-xs text-slate-400 hover:text-orange-400 transition-colors duration-200 rounded-md hover:bg-orange-500/10"
                  >
                    <div className="w-1 h-1 bg-orange-400 rounded-full"></div>
                    Add Violation On A User
                  </motion.button>
                )}
                <motion.button
                  variants={itemVariants}
                  whileHover="hover"
                  onClick={() => navigate("/all-violations-from-users")}
                  className="flex items-center gap-2 py-1 px-3 text-xs text-slate-400 hover:text-orange-400 transition-colors duration-200 rounded-md hover:bg-orange-500/10"
                >
                  <div className="w-1 h-1 bg-orange-400 rounded-full"></div>
                  All Violations From Users
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-0.5">
          <motion.button
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleDropdownToggle('moph')}
            className="group w-full flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-indigo-500/20 hover:border-blue-500/30 border border-transparent transition-all duration-300 text-slate-300 hover:text-white"
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-md group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                <Mail className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-medium text-sm">MOPH Emails</span>
            </div>
            <motion.div
              animate={{ rotate: mophOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors duration-300" />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {mophOpen && (
              <motion.div
                variants={menuVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="ml-6 space-y-0.5 overflow-hidden"
              >
                <motion.button
                  variants={itemVariants}
                  whileHover="hover"
                  onClick={() => navigate("/all-moph-emails")}
                  className="flex items-center gap-2 py-1 px-3 text-xs text-slate-400 hover:text-blue-400 transition-colors duration-200 rounded-md hover:bg-blue-500/10"
                >
                  <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                  All MOPH Emails
                </motion.button>
                {!isViewer && (
                  <motion.button
                    variants={itemVariants}
                    whileHover="hover"
                    onClick={() => navigate("/add-moph-email")}
                    className="flex items-center gap-2 py-1 px-3 text-xs text-slate-400 hover:text-blue-400 transition-colors duration-200 rounded-md hover:bg-blue-500/10"
                  >
                    <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                    Add MOPH Email
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* System Users Section (Admin Only) */}
        {isAdmin && (
          <div className="space-y-0.5">
            <motion.button
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleDropdownToggle('systemUser')}
              className="group w-full flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 hover:border-purple-500/30 border border-transparent transition-all duration-300 text-slate-300 hover:text-white"
            >
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-md group-hover:shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
                  <Shield className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-medium text-sm">System Users</span>
              </div>
              <motion.div
                animate={{ rotate: systemUserOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors duration-300" />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {systemUserOpen && (
                <motion.div
                  variants={menuVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  className="ml-6 space-y-0.5 overflow-hidden"
                >
                  <motion.button
                    variants={itemVariants}
                    whileHover="hover"
                    onClick={() => navigate("/all-system-users")}
                    className="flex items-center gap-2 py-1 px-3 text-xs text-slate-400 hover:text-purple-400 transition-colors duration-200 rounded-md hover:bg-purple-500/10"
                  >
                    <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                    View All
                  </motion.button>
                  <motion.button
                    variants={itemVariants}
                    whileHover="hover"
                    onClick={() => navigate("/register")}
                    className="flex items-center gap-2 py-1 px-3 text-xs text-slate-400 hover:text-purple-400 transition-colors duration-200 rounded-md hover:bg-purple-500/10"
                  >
                    <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                    Add New
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Reports */}
        {!isViewer && (
        <motion.button
          whileHover={{ scale: 1.02, x: 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/reports")}
          className="group flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gradient-to-r hover:from-slate-500/20 hover:to-gray-500/20 hover:border-slate-500/30 border border-transparent transition-all duration-300 text-slate-300 hover:text-white"
        >
          <div className="p-1.5 bg-gradient-to-br from-slate-800 to-slate-600 rounded-md group-hover:shadow-lg group-hover:shadow-slate-500/25 transition-all duration-300">
            <ClipboardList className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-medium text-sm">Reports</span>
        </motion.button>
        )}

        {/* Settings */}
        <motion.button
          whileHover={{ scale: 1.02, x: 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/settings")}
          className="group flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gradient-to-r hover:from-slate-500/20 hover:to-gray-500/20 hover:border-slate-500/30 border border-transparent transition-all duration-300 text-slate-300 hover:text-white"
        >
          <div className="p-1.5 bg-gradient-to-br from-slate-500 to-gray-500 rounded-md group-hover:shadow-lg group-hover:shadow-slate-500/25 transition-all duration-300">
            <Settings className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-medium text-sm">Settings</span>
        </motion.button>
      </nav>

      {/* Footer with Logout - Compact */}
      <div className="p-3 border-t border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-700/50">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={logout}
          className="group w-full flex items-center gap-2 py-2 px-3 rounded-lg bg-gradient-to-r from-red-500/20 to-pink-500/20 hover:from-red-500/30 hover:to-pink-500/30 border border-red-500/30 hover:border-red-500/50 transition-all duration-300 text-red-400 hover:text-red-300"
        >
          <div className="p-1.5 bg-gradient-to-br from-red-500 to-pink-500 rounded-md group-hover:shadow-lg group-hover:shadow-red-500/25 transition-all duration-300">
            <LogOut className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-medium text-sm">Logout</span>
        </motion.button>
        
        {/* User Info */}
        <div className="mt-2 text-center">
          <div className="text-xs text-slate-500 font-medium">
            {currentUser?.user?.name || 'User'}
          </div>
          <div className="text-xs text-slate-600 capitalize">
            {currentUser?.user?.role || 'Role'}
          </div>
        </div>
      </div>
    </aside>
  );
}
