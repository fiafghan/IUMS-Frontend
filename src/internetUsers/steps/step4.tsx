import type { JSX } from "react";
import type { FormState } from "../../types/types";
import { CheckCircle, User, Mail, Phone, Briefcase, Building2, Laptop, Hash, Shield, MessageSquare } from "lucide-react";

export function Step4({ form }: { form: FormState }): JSX.Element {
  // Group form fields by category for better organization
  const fieldGroups = [
    {
      title: "Personal Information",
      icon: <User className="w-5 h-5 text-blue-600" />,
      fields: [
        { key: "name", label: "Full Name", icon: <User className="w-4 h-4" /> },
        { key: "username", label: "Username", icon: <User className="w-4 h-4" /> },
        { key: "email", label: "Email", icon: <Mail className="w-4 h-4" /> },
        { key: "phone", label: "Phone", icon: <Phone className="w-4 h-4" /> },
      ]
    },
    {
      title: "Employment Details",
      icon: <Briefcase className="w-5 h-5 text-green-600" />,
      fields: [
        { key: "position", label: "Position", icon: <Briefcase className="w-4 h-4" /> },
        { key: "employment_type", label: "Employment Type", icon: <User className="w-4 h-4" /> },
        { key: "directorate", label: "Directorate", icon: <Building2 className="w-4 h-4" /> },
        { key: "deputyMinistry", label: "Deputy Ministry", icon: <Building2 className="w-4 h-4" /> },
      ]
    },
    {
      title: "Device Information",
      icon: <Laptop className="w-5 h-5 text-purple-600" />,
      fields: [
        { key: "device_limit", label: "Device Limit", icon: <Hash className="w-4 h-4" /> },
        { key: "device_type", label: "Device Type", icon: <Laptop className="w-4 h-4" /> },
        { key: "mac_address", label: "MAC Address", icon: <Hash className="w-4 h-4" /> },
      ]
    },
    {
      title: "Account Settings",
      icon: <Shield className="w-5 h-5 text-orange-600" />,
      fields: [
        { key: "status", label: "Status", icon: <Shield className="w-4 h-4" /> },
        { key: "violations", label: "Violations", icon: <Hash className="w-4 h-4" /> },
        { key: "violation_type", label: "Violation Type", icon: <Shield className="w-4 h-4" /> },
        { key: "comment", label: "Comment", icon: <MessageSquare className="w-4 h-4" /> },
      ]
    }
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Your Information</h2>
        <p className="text-gray-600">Please review all the information below before submitting</p>
      </div>

      {/* Form Review Sections */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {fieldGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="bg-white text-[12px] rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            {/* Section Header */}
            <div className="flex items-center gap-3 p-4 border-b border-gray-100 bg-gray-50 rounded-t-xl">
              {group.icon}
              <h3 className="font-semibold text-gray-900">{group.title}</h3>
            </div>

            {/* Section Content */}
            <div className="p-4 space-y-3">
              {group.fields.map((field) => {
                const value = form[field.key as keyof FormState];
                return (
                  <div key={field.key} className="flex items-start justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center gap-2 text-[12px] text-gray-700">
                      <span className="text-gray-400 ">{field.icon}</span>
                      {field.label}
                    </div>
                    <div className="text-[12px] text-gray-900 font-medium max-w-[200px] text-right break-words">
                      {value || <span className="text-gray-400 italic">Not provided</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6 mt-8">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-blue-900">Ready to Submit</h3>
        </div>
        <p className="text-blue-700 text-sm leading-relaxed">
          You're about to create a new internet user account with the information above.
          Please make sure all details are correct before proceeding. You can go back to make changes if needed.
        </p>
      </div>
    </div>
  );
}