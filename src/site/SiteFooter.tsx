//

export default function PublicFooter() {
  return (
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
            <span className="font-medium text-slate-700">MOPH Software Development Team</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
