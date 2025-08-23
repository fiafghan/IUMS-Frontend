import { useNavigate } from "react-router-dom";
import {
  Settings, AlertOctagon, Users, LogOut, ChevronDown, ChevronUp,
  LayoutDashboard
} from "lucide-react";
import { motion } from "framer-motion";
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

  return (
    <aside className="w-64 min-h-screen bg-gradient-to-r from-gray-300 via-gray-200 to-gray-100 text-white flex flex-col">
      <div className="flex items-center justify-center flex-col py-6 px-4 scale-80">
        <img src="moph.png" className="rounded-full w-30" />
        <h1
          className="text-center mt-5 text-3xl font-extrabold bg-blue-400 bg-clip-text 
          text-transparent scale-80"
        >
          IUMS
        </h1>
      </div>

      <nav className="flex flex-col mt-4 gap-1 px-4 text-sm font-medium">

         {/* 🔹 Dashboard */}
         <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate("/")}
          className="flex items-center gap-3 py-3 rounded-sm hover:bg-white hover:text-blue-400 text-blue-400 scale-80"
        >
          <LayoutDashboard className="w-5 h-5 bg-blue-400 text-white rounded-md p-1" />
          <div className="flex items-center gap-2 text-blue-400">
          Dashboard
        </div>

        </motion.button>
        {/* 🔹 All Users section */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setUserOpen(!userOpen)}
          className="flex items-center justify-between px-4 py-3 rounded-sm hover:bg-white hover:text-blue-400"
        >
          <div className="flex items-center gap-2 text-blue-400 scale-80">
            <Users className="w-5 h-5 bg-blue-400 text-white rounded-md p-1" />
            All Users
          </div>
          {userOpen ? <ChevronUp className="w-4 h-4 text-blue-400" /> : <ChevronDown className="w-4 h-4 text-blue-400 scale-80" />}
        </motion.button>

        {userOpen && (
          <div className="ml-6 flex flex-col gap-1 text-blue-400 scale-80">
            <button
              onClick={() => navigate("/all-users")}
              className="hover:text-white/80 transition py-1 text-left scale-80"
            >
              ➤ View All
            </button>
            {!isViewer && (
              <button
                onClick={() => navigate("/adduser")}
                className="hover:text-white/80 transition py-1 text-left scale-80"
              >
                ➤ Add User
              </button>
            )}
          </div>
        )}

        {/* 🔹 Violations Section */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setViolationOpen((prev) => !prev)}
          className="flex items-center justify-between px-4 py-3 rounded-sm hover:bg-white hover:text-blue-400"
        >
          <div className="flex items-center gap-2 text-blue-400 scale-80">
            <AlertOctagon className="w-5 h-5 bg-blue-400 text-white rounded-md p-1" />
            Violations
          </div>
          {violationOpen ? <ChevronUp className="w-4 h-4 scale-80 text-blue-400" /> : <ChevronDown className="w-4 h-4 text-blue-400 scale-80" />}
        </motion.button>

        {violationOpen && (
          <div className="ml-6 flex flex-col gap-1 text-blue-400 scale-80">
               {currentUser?.user.role !== "viewer" && (
            <button
              onClick={() => navigate("/addviolation")}
              className="hover:text-white transition py-1 text-left scale-80"
            >
              ➤ Violation Form
            </button>
               )}
               {currentUser?.user.role !== "viewer" && (
            <button
              onClick={() => navigate("/re-activate")}
              className="hover:text-white transition py-1 text-left scale-80"
            >
              ➤ Re-Activation
            </button>
               )}
            {currentUser?.user.role !== "viewer" && (
            <button
              onClick={() => navigate("/add-violation-type")}
              className="hover:text-white transition py-1 text-left scale-80"
            >
              ➤ Add Violation Type
            </button>
             )}
            <button
              onClick={() => navigate("/all-violation-types")}
              className="hover:text-white transition py-1 text-left scale-80"
            >
              ➤ All Violation Types
            </button>
            {currentUser?.user.role !== "viewer" && (
            <button
              onClick={() => navigate("/addviolationonauser")}
              className="hover:text-white transition py-1 text-left scale-80"
            >
              ➤ Add Violation On A User
            </button>
            )}
            <button
              onClick={() => navigate("/all-violations-from-users")}
              className="hover:text-white transition py-1 text-left scale-80"
            >
              ➤ All Violations From Users
            </button>
          </div>
        )}


        {/* 🔹 System Users (admin only) */}
        {isAdmin && (
          <>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSystemUserOpen(!systemUserOpen)}
              className="flex items-center justify-between px-3 py-3 rounded-sm hover:bg-white hover:text-blue-400"
            >
              <div className="flex items-center gap-2 text-blue-400 scale-80">
                <Users className="w-5 h-5 bg-blue-400 text-white rounded-md p-1" />
                System Users
              </div>
              {systemUserOpen ? <ChevronUp className="w-4 h-4 text-blue-400 scale-80" /> : <ChevronDown className="w-4 h-4 text-blue-400 scale-80" />}
            </motion.button>

            {systemUserOpen && (
              <div className="ml-6 flex flex-col gap-1 text-blue-400 scale-80">
                <button
                  onClick={() => navigate("/all-system-users")}
                  className="hover:text-white transition py-1 text-left scale-80"
                >
                  ➤ View All
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="hover:text-white transition py-1 text-left text-blue-400 scale-80"
                >
                  ➤ Add New
                </button>
              </div>
            )}
          </>
        )}

        {/* 🔹 Settings */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate("/settings")}
          className="flex items-center gap-3 py-3 rounded-sm hover:bg-white hover:text-blue-400 text-blue-400 scale-80"
        >
          <Settings className="w-5 h-5 bg-blue-400 text-white rounded-md p-1" />
          Settings
        </motion.button>

        {/* 🔒 Logout */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          onClick={logout}
          className="flex items-center gap-3 py-3 rounded-sm hover:bg-white hover:text-blue-400 mt-4 text-blue-400 scale-80"
        >
          <LogOut className="w-5 h-5 bg-blue-400 text-white rounded-md p-1" />
          Logout
        </motion.button>
      </nav>
    </aside>
  );
}
