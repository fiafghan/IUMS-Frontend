import { useNavigate } from "react-router-dom";
import {Settings, AlertOctagon, Users, LogOut, ChevronDown, ChevronUp
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, type JSX } from "react";
import axios from "axios";

export default function GradientSidebar(): JSX.Element {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
  const isAdmin = currentUser?.user.role === 'Admin';

const logout = async () => {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
  const token = loggedInUser.token;
  const user_id = loggedInUser.id;  // assuming your backend sends token inside user object as 'token'

  if (!token) {
    console.error("❌ No token found. Cannot logout.");
    return;
  }

  try {
    await axios.post(
      "http://localhost:8000/api/logout",
      {id:user_id},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
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
    <aside className="w-64 min-h-screen bg-blue-400 text-white flex flex-col">
      <div className="flex items-center justify-center flex-col py-6 px-4">
        <img src="moph.jpeg" className="rounded-full w-30 border-1" />
        <h1 className="text-center mt-5">IUMS</h1>
      </div>

      <nav className="flex flex-col mt-4 gap-1 px-4 text-sm font-medium">
        {/* 🔹 All Users section */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setUserOpen(!userOpen)}
          className="flex items-center justify-between px-4 py-3 rounded-sm hover:bg-white hover:text-blue-400"
        >
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            All Users
          </div>
          {userOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </motion.button>

        {userOpen && (
          <div className="ml-6 flex flex-col gap-1 text-white">
            <button
              onClick={() => navigate("/")}
              className="hover:text-white/80 transition py-1 text-left"
            >
              ➤ View All
            </button>
            <button
              onClick={() => navigate("/adduser")}
              className="hover:text-white/80 transition py-1 text-left"
            >
              ➤ Add User
            </button>
          </div>
        )}

        {/* 🔹 Violations Section */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setViolationOpen((prev) => !prev)}
            className="flex items-center justify-between px-4 py-3 rounded-sm hover:bg-white hover:text-blue-400"
          >
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-5 h-5" />
              Violations
            </div>
            {violationOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </motion.button>

          {violationOpen && (
            <div className="ml-6 flex flex-col gap-1 text-white">
              <button
                onClick={() => navigate("/addviolation")}
                className="hover:text-white/80 transition py-1 text-left"
              >
                ➤ Violation Form
              </button>
              <button
                onClick={() => navigate("/add-violation-type")}
                className="hover:text-white/80 transition py-1 text-left"
              >
                ➤ Add Violation Type
              </button>
              <button
                onClick={() => navigate("/all-violation-types")}
                className="hover:text-white/80 transition py-1 text-left"
              >
                ➤ All Violation Types
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
              className="flex items-center justify-between px-4 py-3 rounded-sm hover:bg-white hover:text-blue-400"
            >
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                System Users
              </div>
              {systemUserOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </motion.button>

            {systemUserOpen && (
              <div className="ml-6 flex flex-col gap-1 text-white">
                <button
                  onClick={() => navigate("/all-system-users")}
                  className="hover:text-white/80 transition py-1 text-left"
                >
                  ➤ View All
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="hover:text-white/80 transition py-1 text-left"
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
          className="flex items-center gap-3 px-4 py-3 rounded-sm hover:bg-white hover:text-blue-400"
        >
          <Settings className="w-5 h-5" />
          Settings
        </motion.button>

        {/* 🔒 Logout */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-sm hover:bg-white hover:text-blue-400 mt-4"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </motion.button>
      </nav>
    </aside>
  );
}
