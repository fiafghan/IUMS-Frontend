import { useState, type JSX, useEffect } from "react";
import { User, Mail, Phone, Hash, Laptop, Cpu, Briefcase } from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSubmitButton from "./components/AnimatedButton";
import Spinner from "./components/Spinner";
import { useNavigate } from "react-router-dom";
import GradientSidebar from "./components/Sidebar";
import Dropdown from "./components/Dropdown";

type FormState = {
  name: string;
  username: string;
  email: string;
  phone: string;
  employment_type:string
  directorate: string;
  position: string;
  deputyMinistry: string;
  device_limit: string;
  device_type: string;
  mac_address: string;
  status: string;
  violations: string;
  comment: string;
};


const stepTitles = [
  "Basic Info",
  "Job Info",
  "Device Info",
  "Activation",
  "Review & Submit",
];

export default function InternetUserAddForm(): JSX.Element {
  const [form, setForm] = useState<FormState>({
    name: "",
    username: "",
    email: "",
    phone: "",
    employment_type: "",
    directorate: "",
    deputyMinistry: "",
    position: "",
    device_limit: "",
    device_type: "",
    mac_address: "",
    status: "Active",
    violations: "0",
    comment: "No Comment",
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [directorateOptions, setDirectorateOptions] = useState<string[]>([]);
  const [deputyMinistryOptions, setDeputyMinistryOptions] = useState<string[]>([]);
  const [employmentTypeOptions, setEmploymentTypeOptions] = useState<string[]>([]);



  useEffect(() => {
  const fetchOptions = async () => {
    try {
      const [dirRes, depMinRes, empTypeRes] = await Promise.all([
        axios.get("http://localhost:3000/directorates"),
        axios.get("http://localhost:3000/deputy_ministries"),
        axios.get("http://localhost:3000/employment_type"),
      ]);

      // You may need to map if they are objects
      setDirectorateOptions(dirRes.data.map((d: any) => d.name));
      setDeputyMinistryOptions(depMinRes.data.map((d: any) => d.name));
      setEmploymentTypeOptions(empTypeRes.data.map((d: any) => d.type));
    } catch (error) {
      console.error("❌ Error fetching select options", error);
    }
  };

  fetchOptions();
}, []);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  function validateStep(step: number): boolean {
    switch (step) {
      case 0:
        return (
          form.name.trim() !== "" &&
          form.username.trim() !== "" 
        );
      case 1:
        return (
          form.employment_type.trim() !== "" &&
          form.directorate.trim() !== "" &&
          form.deputyMinistry.trim() !== ""
        );
      case 2:
        return (
          form.device_limit.trim() !== "" &&
          form.device_type.trim() !== ""
        );

      case 3:
        return (
          form.status.trim() !== "" &&
          form.violations.trim() !== "" &&
          form.comment.trim() !== ""
        );
      default:
        return true;
    }
  }

  const nextStep = () => {
    if (!validateStep(currentStep)) {
      alert("Please fill all required fields in this step.");
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, stepTitles.length - 1));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (!validateStep(2)) {
      alert("Please fill all required fields before submitting.");
      setCurrentStep(2);
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:8000/api/internet-users", form);
      alert("✅ User added successfully!");
      setForm({
        name: "",
        username: "",
        email: "",
        phone: "",
        position: "",
        employment_type: "",
        directorate: "",
        deputyMinistry: "",
        device_limit: "",
        device_type: "",
        mac_address: "",
        status: "Active",
        violations: "0",
        comment: "No Comment",
      });
      setCurrentStep(0);
      navigate("/");
    } catch (error) {
      console.error("Error adding user:", error);
      alert("❌ Something went wrong while adding user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            key="spinner-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.75 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
            aria-label="Loading..."
            role="alert"
            aria-live="assertive"
          >
            <Spinner
              size={48}
              thickness={5}
              colorClass="border-white"
              ariaLabel="Loading form submission"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
        <GradientSidebar />
        <motion.div
          className="flex-1 flex flex-col items-center justify-center px-4 py-12"
          initial={false}
        >
          <motion.div
            className="w-full max-w-lg bg-white shadow-2xl border border-gray-200 rounded-3xl px-10 py-12 relative z-10"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <motion.h2
              className="text-3xl font-extrabold text-center text-gray-800 mb-6 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <span className="bg-gradient-to-r from-blue-400 to-blue-300 text-transparent bg-clip-text">
                {stepTitles[currentStep]}
              </span>
            </motion.h2>

            {/* 🔥 This is the FIXED part */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
              >
                {(() => {
                  switch (currentStep) {
                    case 0:
                      return <Step1 form={form} onChange={handleChange} />;
                    case 1:
                      return <Step2 form={form} 
                      directorateOptions={directorateOptions}
                      deputyMinistryOptions={deputyMinistryOptions}
                      employmentTypeOptions={employmentTypeOptions}
                      onChange={handleChange} />;
                    case 2:
                      return <Step3 form={form} onChange={handleChange} />;
                    case 3:
                      return <Step5 form = {form} onChange = {handleChange} />;
                    case 4:
                      return <Step4 form={form} />;
                    default:
                      return null;
                  }
                })()}
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex justify-between">
              {currentStep > 0 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                >
                  Back
                </button>
              ) : (
                <div />
              )}
              {currentStep < stepTitles.length - 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 rounded-xl bg-blue-400 text-white font-semibold hover:bg-indigo-700 transition"
                >
                  Next
                </button>
              ) : (
                <AnimatedSubmitButton onClick={handleSubmit} disabled={loading}>
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Spinner />
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    "Submit"
                  )}
                </AnimatedSubmitButton>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}

// Input Components
function Step1({ form, onChange }: { form: FormState; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }): JSX.Element {
  return (
    <div>
      <InputField label="Full Name" icon={<User className="w-5 h-5 text-gray-500" />} 
      name="name" type="text" placeholder="John Doe" value={form.name} onChange={onChange} />
      <InputField label="Username" icon={<User className="w-5 h-5 text-gray-500" />} 
      name="username" type="text" placeholder="johndoe123" value={form.username} onChange={onChange} />
      <InputField label="Email" icon={<Mail className="w-5 h-5 text-gray-500" />} 
      name="email" type="email" placeholder="you@example.com" value={form.email} onChange={onChange} />
      <InputField label="Phone" icon={<Phone className="w-5 h-5 text-gray-500" />} 
      name="phone" type="tel" placeholder="+1234567890" value={form.phone} onChange={onChange} />
    </div>
  );
}


function Step2({
  form,
  onChange,
  directorateOptions,
  deputyMinistryOptions,
}: {
  form: FormState;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  directorateOptions: string[];
  deputyMinistryOptions: string[];
  employmentTypeOptions: string[];
}): JSX.Element {
  const [selected, setSelected] = useState<string | number>("");

  return (
    <div>
      <InputField label="Position" icon={<Briefcase className="w-5 h-5 text-gray-500" />} 
      name="position" type="text" placeholder="Position" value={form.position} onChange={onChange} />
        <div className="max-w-md mx-auto mt-2">
              <Dropdown
                url="http://127.0.0.1:8000/api/employment-type"
                onChange={(value) => setSelected(value)}
                label="Employment Type"
                
              />
            </div>
      <SelectField
            label="Directorate"
            icon={<User className="w-5 h-5 text-gray-500" />}
            name="directorate"
            value={form.directorate}
            onChange={(e) => onChange(e as any)}
            options={directorateOptions}
          />
        <SelectField
          label="Deputy Ministry"
          icon={<User className="w-5 h-5 text-gray-500" />}
          name="deputyMinistry"
          value={form.deputyMinistry}
          onChange={(e) => onChange(e as any)}
          options={deputyMinistryOptions}
        />
    </div>
  );
}

function Step3({ form, onChange }: { form: FormState; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }): JSX.Element {
  return (
    <div>
      <InputField label="Device Limit" icon={<Hash className="w-5 h-5 text-gray-500" />} 
      name="device_limit" type="number" placeholder="Number of devices allowed" value={form.device_limit} onChange={onChange} />
      <InputField label="Device Type" icon={<Laptop className="w-5 h-5 text-gray-500" />} 
      name="device_type" type="text" placeholder="Type of device" value={form.device_type} onChange={onChange} />
      <InputField label="MAC Address" icon={<Cpu className="w-5 h-5 text-gray-500" />} 
      name="mac_address" type="text" placeholder="00:00:00:00:00:00" value={form.mac_address} onChange={onChange} />
    </div>
  );
}

function Step4({ form }: { form: FormState }): JSX.Element {
  return (
    <div>
      {Object.entries(form).map(([key, value]) => (
        <div key={key} className="flex justify-between border-b border-gray-300 pb-1">
          <span className="capitalize font-semibold">{key.replace(/([A-Z])/g, " $1")}</span>
          <span>{value || "-"}</span>
        </div>
      ))}
    </div>
  );
}

function Step5({ form, onChange }: { form: FormState; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void }): JSX.Element {
  return (
    <div>
      <SelectField
        label="Status"
        icon={<User className="w-5 h-5 text-gray-500" />}
        name="status"
        value={form.status}
        onChange={onChange}
        options={["Active", "Deactive"]}
      />

      <SelectField
        label="Number of Violations"
        icon={<Hash className="w-5 h-5 text-gray-500" />}
        name="violations"
        value={form.violations}
        onChange={onChange}
        options={["0", "1", "2"]}
      />

      <div className="mb-6">
        <label htmlFor="comment" className="block mb-1 text-sm font-medium text-gray-700">
          Comment
        </label>
        <div className="flex items-start gap-2 bg-gray-100 border border-gray-300 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-blue-400 focus-within:ring-offset-1 transition">
          <User className="w-5 h-5 text-gray-500 mt-1" />
          <textarea
            id="comment"
            name="comment"
            rows={3}
            value={form.comment}
            onChange={onChange}
            placeholder="Your comment"
            className="w-full bg-transparent text-gray-800 text-sm placeholder-gray-400 focus:outline-none resize-none"
          />
        </div>
      </div>
    </div>
  );
}


type SelectProps = {
  label: string;
  icon: JSX.Element;
  name: string;
  value: string;
  options: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

function SelectField({
  label,
  icon,
  name,
  value,
  options,
  onChange,
}: SelectProps): JSX.Element {
  return (
    <div className="mb-6">
      <label htmlFor={name} className="block mb-1 text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="flex items-center gap-2 bg-gray-100 border border-gray-300 rounded-xl 
      px-4 py-2 focus-within:ring-2 focus-within:ring-blue-400 focus-within:ring-offset-1 transition">
        {icon}
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full bg-transparent text-gray-800 text-sm focus:outline-none"
        >
          <option value="">Select {label}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

type InputProps = {
  label: string;
  icon: JSX.Element;
  name: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function InputField({
  label,
  icon,
  name,
  type,
  placeholder,
  value,
  onChange,
}: InputProps): JSX.Element {
  return (
    <div className="mb-6">
      <label htmlFor={name} className="block mb-1 text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="flex items-center gap-2 bg-gray-100 border border-gray-300 rounded-xl px-4
       py-2 focus-within:ring-2 focus-within:ring-blue-400 focus-within:ring-offset-1 transition">
        {icon}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          className="w-full bg-transparent text-gray-800 text-sm placeholder-gray-400 focus:outline-none"
          autoComplete="off"
        />
      </div>
    </div>
  );
}
