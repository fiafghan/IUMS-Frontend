import { Phone, Mail, MapPin, Clock } from "lucide-react";
import SiteNavbar from "./SiteNavbar";
import SiteHero from "./SiteHero";
import PublicFooter from "./SiteFooter";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <SiteNavbar />
      <SiteHero title="Contact Us" subtitle="Reach the IT Directorate for support regarding internet access, accounts, and devices." />
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

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="p-3 bg-gradient-to-r from-slate-800 to-slate-500 rounded-xl w-fit mb-4">
                <Mail className="w-5 h-5 text-blue-300" />
              </div>
              <h4 className="text-slate-900 font-semibold mb-2">Email Support</h4>
              <p className="text-slate-600 text-sm">Send your requests to it.support@moph.gov.af.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="p-3 bg-gradient-to-r from-slate-800 to-slate-500 rounded-xl w-fit mb-4">
                <MapPin className="w-5 h-5 text-blue-300" />
              </div>
              <h4 className="text-slate-900 font-semibold mb-2">Address</h4>
              <p className="text-slate-600 text-sm">Wazir Akbar Khan, Kabul, Afghanistan.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="p-3 bg-gradient-to-r from-slate-800 to-slate-500 rounded-xl w-fit mb-4">
                <Clock className="w-5 h-5 text-blue-300" />
              </div>
              <h4 className="text-slate-900 font-semibold mb-2">Working Hours</h4>
              <p className="text-slate-600 text-sm">Sun–Thu 8:00–16:00</p>
            </div>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
