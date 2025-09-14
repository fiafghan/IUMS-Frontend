import { Shield, Info, Wifi, Globe, Server, LayoutDashboard } from "lucide-react";
import SiteNavbar from "./SiteNavbar";
import SiteHero from "./SiteHero";
import PublicFooter from "./SiteFooter";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <SiteNavbar />
      <SiteHero title="About IUMS" subtitle="IUMS is developed to manage internet users, device registrations, and policy compliance across MoPH with a focus on reliability and usability." />
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
      <PublicFooter />
    </div>
  );
}
