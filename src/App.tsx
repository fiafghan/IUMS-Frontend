import RegisterForm from "./systemUsers/RegisterForm"
import { Routes, Route, Link } from "react-router-dom"
import LoginForm from "./systemUsers/LoginForm"
import InternetUserAddForm from "./internetUsers/AddInternetUsers"
import AllUsers from "./internetUsers/AllUsers"
import PrivateRoute from "./systemUsers/PrivateRoute"
import Settings from "./systemUsers/Settings"
import SystemUsersPage from "./systemUsers/SystemUsersPage"
import NotFound from "./systemUsers/NotFound";
import AddViolationType from "./internetUsers/addviolationType"
import EmployeeViolationForm from "./internetUsers/employeeViolationForm"
import AllViolationTypes from "./internetUsers/allviolationtypes"
import AddViolationOnAUser from "./internetUsers/addViolationOnaUser"
import AllViolationsFromUsers from "./internetUsers/AllViolationsFromUsers"
import RoleChecker from "./components/RoleChecker"
import AccessDenied from "./AccessDenied"
import ReactivateUserForm from "./internetUsers/reActivation"
import Dashboard from "./internetUsers/dashboard"
import AllReactivations from "./internetUsers/AllReactivations"
import Reports from "./internetUsers/reports"
import { Shield, Info, Phone, LogIn, Home as HomeIcon, User as UserIcon, LayoutDashboard, LogOut, ChevronDown, Wifi, Globe, Server } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

// Shared public navbar for MIS website pages
function PublicNavbar() {
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
            Internet User Management System (IUMS-MOPH)
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

function PublicHero({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="max-w-7xl mx-auto px-6 py-16 relative text-white">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{title}</h1>
        <p className="mt-3 text-blue-100 text-sm md:text-base max-w-2xl">{subtitle}</p>
      </div>
    </div>
  );
}

function HomeLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <PublicNavbar />
      <PublicHero title="Welcome to IUMS" subtitle="A professional system for managing internet users, devices, and compliance across the Ministry of Public Health." />
      <main className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="p-3 bg-gradient-to-r from-slate-800 to-slate-500 rounded-xl w-fit mb-4">
            <Shield className="w-5 h-5 text-blue-300" />
          </div>
          <h3 className="text-slate-900 font-semibold mb-2">Secure and Reliable</h3>
          <p className="text-slate-600 text-sm">Built with robust role-based access and auditing practices to ensure data integrity and confidentiality.</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="p-3 bg-gradient-to-r from-slate-800 to-slate-500 rounded-xl w-fit mb-4">
            <Info className="w-5 h-5 text-blue-300" />
          </div>
          <h3 className="text-slate-900 font-semibold mb-2">Operational Insights</h3>
          <p className="text-slate-600 text-sm">Leverage dashboards and reports to understand usage, violations, and activation trends.</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="p-3 bg-gradient-to-r from-slate-800 to-slate-500 rounded-xl w-fit mb-4">
            <Phone className="w-5 h-5 text-blue-300" />
          </div>
          <h3 className="text-slate-900 font-semibold mb-2">Streamlined Support</h3>
          <p className="text-slate-600 text-sm">Contact the IT Directorate for assistance with accounts, devices, or network access.</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="p-3 bg-gradient-to-r from-slate-800 to-slate-500 rounded-xl w-fit mb-4">
            <Wifi className="w-5 h-5 text-blue-300" />
          </div>
          <h3 className="text-slate-900 font-semibold mb-2">Network Connectivity</h3>
          <p className="text-slate-600 text-sm">Managed Wi‑Fi access and bandwidth policies ensure stable connectivity for staff and services.</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="p-3 bg-gradient-to-r from-slate-800 to-slate-500 rounded-xl w-fit mb-4">
            <Globe className="w-5 h-5 text-blue-300" />
          </div>
          <h3 className="text-slate-900 font-semibold mb-2">Secure Internet Access</h3>
          <p className="text-slate-600 text-sm">Policy-driven internet access with monitoring to protect critical systems and information.</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="p-3 bg-gradient-to-r from-slate-800 to-slate-500 rounded-xl w-fit mb-4">
            <Server className="w-5 h-5 text-blue-300" />
          </div>
          <h3 className="text-slate-900 font-semibold mb-2">Devices & Resource Control</h3>
          <p className="text-slate-600 text-sm">Register devices, track MACs, and allocate resources to maintain compliance and uptime.</p>
        </div>
      </main>
      <footer className="border-t border-slate-200 bg-white/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3">
              <img src="/moph.png" alt="MoPH" className="w-8 h-8 object-contain" />
              <span className="text-slate-900 font-semibold">Ministry of Public Health</span>
            </div>
            <p className="mt-3 text-slate-600 text-sm max-w-lg">
              Internet User Management System (IUMS) supports secure and efficient network access for staff across the Ministry. Managed by the IT Directorate.
            </p>
          </div>
          <div>
            <div className="text-slate-900 font-semibold mb-2">Quick Links</div>
            <ul className="space-y-1 text-sm">
              <li><a href="/" className="text-slate-600 hover:text-slate-900">Home</a></li>
              <li><a href="/about" className="text-slate-600 hover:text-slate-900">About</a></li>
              <li><a href="/contact" className="text-slate-600 hover:text-slate-900">Contact</a></li>
            </ul>
          </div>
          <div>
            <div className="text-slate-900 font-semibold mb-2">Contact</div>
            <div className="text-sm text-slate-600">Directorate of Information Technology</div>
            <div className="text-sm text-slate-600">Kabul, Afghanistan</div>
            <div className="text-sm text-slate-600">Office Hours: Sat–Thu, 8:00–16:00</div>
          </div>
        </div>
        <div className="border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-500"> 2025 Ministry of Public Health. All rights reserved.</div>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span>Developed By</span>
              <span className="font-medium text-slate-700">IT Directorate Software Development Team</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <PublicNavbar />
      <PublicHero title="About IUMS" subtitle="IUMS is developed to manage internet users, device registrations, and policy compliance across MoPH with a focus on reliability and usability." />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Our Mission</h2>
          <p className="text-slate-700 text-sm leading-6">
            The Internet User Management System empowers the IT Directorate to securely manage user access, device allocations, and compliance tracking.
            By centralizing workflows, IUMS reduces operational overhead and improves service delivery.
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-200">
              <Shield className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-slate-900 font-medium">Security First</div>
                <div className="text-slate-600 text-sm">Best practices, access control, and auditable operations.</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-200">
              <Info className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-slate-900 font-medium">Clarity & Insight</div>
                <div className="text-slate-600 text-sm">Dashboards and reports for operational transparency.</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-200">
              <Wifi className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-slate-900 font-medium">Reliable Connectivity</div>
                <div className="text-slate-600 text-sm">Policy-driven Wi‑Fi and bandwidth management to keep teams online.</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-200">
              <Globe className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-slate-900 font-medium">Secure Internet Access</div>
                <div className="text-slate-600 text-sm">Controlled outbound access and monitoring to protect public health systems.</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-200">
              <Server className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-slate-900 font-medium">Device Governance</div>
                <div className="text-slate-600 text-sm">Register devices, track MACs, and ensure compliance with standards.</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-200">
              <LayoutDashboard className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-slate-900 font-medium">Operational Excellence</div>
                <div className="text-slate-600 text-sm">Streamlined workflows for user lifecycle, re-activations, and reporting.</div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t border-slate-200 bg-white/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3">
              <img src="/moph.png" alt="MoPH" className="w-8 h-8 object-contain" />
              <span className="text-slate-900 font-semibold">Ministry of Public Health</span>
            </div>
            <p className="mt-3 text-slate-600 text-sm max-w-lg">
              Internet User Management System (IUMS) supports secure and efficient network access for staff across the Ministry. Managed by the IT Directorate.
            </p>
          </div>
          <div>
            <div className="text-slate-900 font-semibold mb-2">Quick Links</div>
            <ul className="space-y-1 text-sm">
              <li><a href="/" className="text-slate-600 hover:text-slate-900">Home</a></li>
              <li><a href="/about" className="text-slate-600 hover:text-slate-900">About</a></li>
              <li><a href="/contact" className="text-slate-600 hover:text-slate-900">Contact</a></li>
              <li><a href="/dashboard" className="text-slate-600 hover:text-slate-900">Dashboard</a></li>
            </ul>
          </div>
          <div>
            <div className="text-slate-900 font-semibold mb-2">Contact</div>
            <div className="text-sm text-slate-600">Directorate of Information Technology</div>
            <div className="text-sm text-slate-600">Kabul, Afghanistan</div>
            <div className="text-sm text-slate-600">Office Hours: Sat–Thu, 8:00–16:00</div>
          </div>
        </div>
        <div className="border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-500"> 2025 Ministry of Public Health. All rights reserved.</div>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span>Developed By</span>
              <span className="font-medium text-slate-700">IT Directorate Software Development Team</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <PublicNavbar />
      <PublicHero title="Contact Us" subtitle="Reach the IT Directorate for support regarding internet access, accounts, and devices." />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-slate-900 font-semibold mb-2">Directorate of IT</h3>
              <p className="text-slate-600 text-sm mb-4">Ministry of Public Health</p>
              <div className="flex items-center gap-3 text-slate-700 text-sm">
                <Phone className="w-4 h-4 text-blue-600" /> +93 747006644
              </div>
              <div className="mt-2 text-slate-600 text-sm">Office Hours: Sat–Thu, 8:00–16:00</div>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t border-slate-200 bg-white/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3">
              <img src="/moph.png" alt="MoPH" className="w-8 h-8 object-contain" />
              <span className="text-slate-900 font-semibold">Ministry of Public Health</span>
            </div>
            <p className="mt-3 text-slate-600 text-sm max-w-lg">
              Internet User Management System (IUMS) supports secure and efficient network access for staff across the Ministry. Managed by the IT Directorate.
            </p>
          </div>
          <div>
            <div className="text-slate-900 font-semibold mb-2">Quick Links</div>
            <ul className="space-y-1 text-sm">
              <li><a href="/" className="text-slate-600 hover:text-slate-900">Home</a></li>
              <li><a href="/about" className="text-slate-600 hover:text-slate-900">About</a></li>
              <li><a href="/contact" className="text-slate-600 hover:text-slate-900">Contact</a></li>
              <li><a href="/dashboard" className="text-slate-600 hover:text-slate-900">Dashboard</a></li>
            </ul>
          </div>
          <div>
            <div className="text-slate-900 font-semibold mb-2">Contact</div>
            <div className="text-sm text-slate-600">Directorate of Information Technology</div>
            <div className="text-sm text-slate-600">Kabul, Afghanistan</div>
            <div className="text-sm text-slate-600">Office Hours: Sat–Thu, 8:00–16:00</div>
          </div>
        </div>
        <div className="border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-500"> 2025 Ministry of Public Health. All rights reserved.</div>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span>Developed By</span>
              <span className="font-medium text-slate-700">IT Directorate Software Development Team</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {

  return (
    <>
      <Routes>
        <Route path="/register" element={<PrivateRoute><RoleChecker allowedRoles={['Admin']}><RegisterForm /></RoleChecker></PrivateRoute>} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/adduser" element={<PrivateRoute><RoleChecker allowedRoles={['Admin', 'User']}><InternetUserAddForm /></RoleChecker></PrivateRoute>} />
        <Route path="/all-system-users" element={<RoleChecker allowedRoles={['Admin']}><SystemUsersPage /></RoleChecker>} />
        <Route path="/addviolation" element={<RoleChecker allowedRoles={['Admin', 'User']}><EmployeeViolationForm /></RoleChecker>} />
        <Route path="/addviolationonauser" element={<RoleChecker allowedRoles={['Admin', 'User']}><AddViolationOnAUser /></RoleChecker>} />
        <Route path="/re-activate" element={<RoleChecker allowedRoles={['Admin', 'User']}><ReactivateUserForm /></RoleChecker>} />
        <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
        <Route path="/add-violation-type" element={<RoleChecker allowedRoles={['Admin', 'User']}><AddViolationType /></RoleChecker>} />
        <Route path="/" element={<HomeLanding />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/all-re-activations" element={<RoleChecker allowedRoles={['Admin', 'User']}><AllReactivations/></RoleChecker>} />
        <Route path="/reports" element={<RoleChecker allowedRoles={['Admin', 'User']}><Reports/></RoleChecker>} />
        <Route path="/all-violation-types" element={<PrivateRoute><AllViolationTypes /></PrivateRoute>} />
        <Route path="/all-violations-from-users" element={<PrivateRoute><AllViolationsFromUsers /></PrivateRoute>} />
        <Route path="/access-denied" element={<PrivateRoute><AccessDenied /></PrivateRoute>} />
        
        <Route
          path="/all-users"
          element={
            <PrivateRoute>
              <AllUsers />
            </PrivateRoute>
          }
        />

        {/* Public MIS website routes */}
        <Route path="/home" element={<HomeLanding />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
