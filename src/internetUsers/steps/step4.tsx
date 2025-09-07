import { useState } from "react";
import type { JSX } from "react";
import type { FormState } from "../../types/types";
import { CheckCircle, User, Mail, Phone, Briefcase, Building2, Laptop, Hash, ChevronDown, ChevronUp } from "lucide-react";

export function Step4({ form }: { form: FormState }): JSX.Element {
  const fieldGroups = [
    {
      title: "Personal Information",
      icon: <User className="w-5 h-5 text-blue-600" />,
      fields: [
        { key: "name", label: "Full Name", icon: <User className="w-4 h-4 text-white  rounded-md p-1 bg-slate-600 scale-200 mr-2" /> },
        { key: "username", label: "Username", icon: <User className="w-4 h-4 text-white rounded-md p-1 bg-slate-600 scale-200 mr-2" /> },
        { key: "email", label: "Email", icon: <Mail className="w-4 h-4 text-white rounded-md p-1 bg-slate-600 scale-200 mr-2" /> },
        { key: "phone", label: "Phone", icon: <Phone className="w-4 h-4 text-white rounded-md p-1 bg-slate-600 scale-200 mr-2" /> },
      ],
    },
    {
      title: "Employment Details",
      icon: <Briefcase className="w-5 h-5 text-green-600" />,
      fields: [
        { key: "position", label: "Position", icon: <Briefcase className="w-4 h-4 text-white bg-slate-600 rounded-md p-1 scale-200 mr-2" /> },
        { key: "employment_type", label: "Employment Type", icon: <User className="w-4 h-4 text-white bg-slate-600 rounded-md p-1 scale-200 mr-2" /> },
        { key: "directorate", label: "Directorate", icon: <Building2 className="w-4 h-4 text-white bg-slate-600 rounded-md p-1 scale-200 mr-2" /> },
        { key: "deputyMinistry", label: "Deputy Ministry", icon: <Building2 className="w-4 h-4 text-white bg-slate-600 rounded-md p-1 scale-200 mr-2" /> },
      ],
    },
    {
      title: "Device Information",
      icon: <Laptop className="w-5 h-5 text-purple-600" />,
      fields: [
        { key: "device_limit", label: "Device Limit", icon: <Hash className="w-4 h-4 text-white rounded-md p-1 bg-slate-600 scale-200 mr-2" /> },
        { key: "group_id", label: "Group Type", icon: <Hash className="w-4 h-4 text-white rounded-md p-1 bg-slate-600 scale-200 mr-2" /> },
        { key: "selectedDevices", label: "Device Types", icon: <Laptop className="w-4 h-4 text-white rounded-md p-1 bg-slate-600 scale-200 mr-2" /> },
        { key: "selectedDevices", label: "MAC Addresses", icon: <Hash className="w-4 h-4 text-white rounded-md p-1 bg-slate-600 scale-200 mr-2" /> },
      ],
    },
  ];

  const [openSections, setOpenSections] = useState(() =>
    fieldGroups.reduce((acc, _, i) => {
      acc[i] = true; 
      return acc;
    }, {} as Record<number, boolean>)
  );

  const toggleSection = (index: number) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4 mx-auto shadow-sm">
          <CheckCircle className="w-8 h-8 text-slate-500" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Review Your Information</h2>
        <p className="text-slate-600 max-w-xl mx-auto">
          Please review all the information below before submitting
        </p>
      </div>

      {/* Form Review Sections */}
      <div className="grid gap-5 grid-cols-1 md:grid-cols-2">        
        {fieldGroups.map((group, idx) => (
        <div
          key={idx}
          className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          {/* Section Header */}
          <button
            type="button"
            onClick={() => toggleSection(idx)}
            className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50 rounded-t-xl w-full focus:outline-none"
            aria-expanded={openSections[idx]}
            aria-controls={`section-content-${idx}`}
          >
            <div className="flex items-center gap-3">
              {group.icon}
              <h3 className="font-semibold text-slate-900 text-lg">{group.title}</h3>
            </div>
            <span className="text-gray-500">
              {openSections[idx] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </span>
          </button>

          {/* Section Content */}
          <div
            id={`section-content-${idx}`}
            className={`p-4 space-y-3 transition-max-height duration-300 ease-in-out overflow-hidden ${openSections[idx] ? "max-h-[1000px]" : "max-h-0"
              }`}
          >
            {group.fields.map((field) => {
              const value = form[field.key as keyof FormState];
              
              // Special handling for selectedDevices
              if (field.key === "selectedDevices" && Array.isArray(value)) {
                if (field.label === "Device Types") {
                  const deviceNames = (value as any[]).map((device: any) => device.deviceTypeName).filter(Boolean);
                  return (
                    <div
                      key={`${field.key}-types`}
                      className="flex items-start justify-between py-2 border-b border-slate-100 last:border-b-0"
                    >
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <span className="text-gray-400 ">{field.icon}</span>
                        {field.label}
                      </div>
                      <div className="text-sm text-slate-900 font-medium max-w-[200px] text-right break-words">
                        {deviceNames.length > 0 ? deviceNames.join(", ") : <span className="text-gray-400 italic">Not provided</span>}
                      </div>
                    </div>
                  );
                } else if (field.label === "MAC Addresses") {
                  const macAddresses = (value as any[]).map((device: any) => device.macAddress).filter(Boolean);
                  return (
                    <div
                      key={`${field.key}-macs`}
                      className="flex items-start justify-between py-2 border-b border-slate-100 last:border-b-0"
                    >
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <span className="text-gray-400 ">{field.icon}</span>
                        {field.label}
                      </div>
                      <div className="text-sm text-slate-900 font-medium max-w-[200px] text-right break-words">
                        {macAddresses.length > 0 ? macAddresses.join(", ") : <span className="text-gray-400 italic">Not provided</span>}
                      </div>
                    </div>
                  );
                }
              }
              
              return (
                <div
                  key={field.key}
                  className="flex items-start justify-between py-2 border-b border-slate-100 last:border-b-0"
                >
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="text-gray-400 ">{field.icon}</span>
                    {field.label}
                  </div>
                  <div className="text-sm text-slate-900 font-medium max-w-[200px] text-right break-words">
                    {String(value) || <span className="text-gray-400 italic">Not provided</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-200 p-6 mt-1 max-w-full shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle className="w-6 h-6 text-slate-600" />
          <h3 className="text-xl font-semibold text-slate-900">Ready to Submit</h3>
        </div>
        <p className="text-slate-700 text-base leading-relaxed max-w-xl">
          Please make sure all details are correct before proceeding. You can go back to make changes if needed.
        </p>
      </div>
    </div>
  );
}
