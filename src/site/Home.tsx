import { Shield, Info, Phone, Wifi, Globe, Server, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import SiteNavbar from "./SiteNavbar";
import SiteHero from "./SiteHero";
import PublicFooter from "./SiteFooter";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <SiteNavbar />
      <SiteHero title="Welcome to IUMS" subtitle="A professional system for managing internet users, devices, and compliance across the Ministry of Public Health." />
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
      <PublicFooter />
    </div>
  );
}
