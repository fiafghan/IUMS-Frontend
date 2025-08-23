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
        { key: "name", label: "Full Name", icon: <User className="w-4 h-4 text-white bg-blue-400 rounded-md p-1" /> },
        { key: "username", label: "Username", icon: <User className="w-4 h-4 text-white bg-blue-400 rounded-md p-1" /> },
        { key: "email", label: "Email", icon: <Mail className="w-4 h-4 text-white bg-blue-400 rounded-md p-1" /> },
        { key: "phone", label: "Phone", icon: <Phone className="w-4 h-4 text-white bg-blue-400 rounded-md p-1" /> },
      ],
    },
    {
      title: "Employment Details",
      icon: <Briefcase className="w-5 h-5 text-green-600" />,
      fields: [
        { key: "position", label: "Position", icon: <Briefcase className="w-4 h-4 text-white bg-blue-400 rounded-md p-1" /> },
        { key: "employment_type", label: "Employment Type", icon: <User className="w-4 h-4 text-white bg-blue-400 rounded-md p-1" /> },
        { key: "directorate", label: "Directorate", icon: <Building2 className="w-4 h-4 text-white bg-blue-400 rounded-md p-1" /> },
        { key: "deputyMinistry", label: "Deputy Ministry", icon: <Building2 className="w-4 h-4 text-white bg-blue-400 rounded-md p-1" /> },
      ],
    },
    {
      title: "Device Information",
      icon: <Laptop className="w-5 h-5 text-purple-600" />,
      fields: [
        { key: "device_limit", label: "Device Limit", icon: <Hash className="w-4 h-4 text-white bg-blue-400 rounded-md p-1" /> },
        { key: "group_id", label: "Group Type", icon: <Hash className="w-4 h-4 text-white bg-blue-400 rounded-md p-1" /> },
        { key: "selectedDevices", label: "Device Types", icon: <Laptop className="w-4 h-4 text-white bg-blue-400 rounded-md p-1" /> },
        { key: "mac_address", label: "MAC Address", icon: <Hash className="w-4 h-4 text-white bg-blue-400 rounded-md p-1" /> },
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
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4 mx-auto">
          <CheckCircle className="w-8 h-8 text-blue-400 scale-80" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2 scale-70">Review Your Information</h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          Please review all the information below before submitting
        </p>
      </div>

      {/* Form Review Sections */}
      <div className="grid gap-5 grid-cols-2 scale-85">        
        {fieldGroups.map((group, idx) => (
        <div
          key={idx}
          className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          {/* Section Header */}
          <button
            type="button"
            onClick={() => toggleSection(idx)}
            className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50 rounded-t-xl w-full focus:outline-none"
            aria-expanded={openSections[idx]}
            aria-controls={`section-content-${idx}`}
          >
            <div className="flex items-center gap-3">
              {group.icon}
              <h3 className="font-semibold text-gray-900 text-lg">{group.title}</h3>
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
                const deviceNames = (value as any[]).map((device: any) => device.deviceTypeName).filter(Boolean);
                return (
                  <div
                    key={field.key}
                    className="flex items-start justify-between py-2 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="text-gray-400 ">{field.icon}</span>
                      {field.label}
                    </div>
                    <div className="text-sm text-gray-900 font-medium max-w-[200px] text-right break-words">
                      {deviceNames.length > 0 ? deviceNames.join(", ") : <span className="text-gray-400 italic">Not provided</span>}
                    </div>
                  </div>
                );
              }
              
              return (
                <div
                  key={field.key}
                  className="flex items-start justify-between py-2 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="text-gray-400 ">{field.icon}</span>
                    {field.label}
                  </div>
                  <div className="text-sm text-gray-900 font-medium max-w-[200px] text-right break-words">
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
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl 
      border border-blue-200 p-6 mt-1 max-w-full scale-80">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-blue-900">Ready to Submit</h3>
        </div>
        <p className="text-blue-700 text-base leading-relaxed max-w-xl">
          Please make sure all details are correct before proceeding. You can go back to make changes if needed.
        </p>
      </div>
    </div>
  );
}
