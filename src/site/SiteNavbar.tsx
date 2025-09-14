import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Info, Phone, LogIn, Home as HomeIcon, User as UserIcon, LayoutDashboard, LogOut, ChevronDown } from "lucide-react";

export default function SiteNavbar() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [displayName, setDisplayName] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const syncAuth = () => {
      const raw = localStorage.getItem("loggedInUser");
      try {
        const parsed = raw ? JSON.parse(raw) : null;
        const name = parsed?.user?.name || parsed?.user?.username || "";
        setIsLoggedIn(Boolean(parsed?.token));
        setDisplayName(name);
      } catch {
        setIsLoggedIn(false);
        setDisplayName("");
      }
    };
    syncAuth();
    const onStorage = (e: StorageEvent) => {
      if (e.key === "loggedInUser") syncAuth();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setIsLoggedIn(false);
    setDisplayName("");
    setMenuOpen(false);
    navigate("/login");
  };

  return (
    <header className="w-full bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/moph.png" alt="MoPH" className="w-10 h-10 object-contain" />
          <span className="ml-2 text-sm font-semibold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
            IUMS-MOPH
          </span>
        </div>
        <nav className="flex items-center gap-2 relative">
          <Link to="/home" className="px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 flex items-center gap-2 text-sm">
            <HomeIcon className="w-4 h-4" /> Home
          </Link>
          <Link to="/about" className="px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 flex items-center gap-2 text-sm">
            <Info className="w-4 h-4" /> About
          </Link>
          <Link to="/contact" className="px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4" /> Contact
          </Link>
          {!isLoggedIn ? (
            <Link to="/login" className="ml-2 px-4 py-2 rounded-xl text-blue-300 text-sm font-medium inline-flex items-center gap-2 bg-gradient-to-r from-slate-800 to-slate-600 hover:to-slate-400">
              <LogIn className="w-4 h-4" /> Login
            </Link>
          ) : (
            <div className="ml-2 relative">
              <button onClick={() => setMenuOpen((v) => !v)} className="px-3 py-2 rounded-xl text-blue-300 text-sm font-medium inline-flex items-center gap-2 bg-gradient-to-r from-slate-800 to-slate-600 hover:to-slate-400">
                <UserIcon className="w-4 h-4" />
                <span className="max-w-[140px] truncate">{displayName || "User"}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50">
                  <button onClick={() => { setMenuOpen(false); navigate("/dashboard"); }} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4 text-slate-600" /> Dashboard
                  </button>
                  <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
