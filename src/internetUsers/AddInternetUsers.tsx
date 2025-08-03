import { useState, type JSX, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSubmitButton from "../components/AnimatedButton";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router-dom";
import GradientSidebar from "../components/Sidebar";
import type { FormState } from "../types/types";
import { Step1 } from "./steps/step1";
import { Step2 } from "./steps/step2";
import { Step3 } from "./steps/step3";
import { Step4 } from "./steps/step4";
import { Step5 } from "./steps/step5";
import { stepTitles } from "./steps/steps_titles";
import { route } from "../config";

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
      const [dirRes, empTypeRes] = await Promise.all([
        axios.get(`${route}/directorate`),
        axios.get(`${route}/employment-type`),
      ]);

      // Directorates are those with directorate_type_id === 2
      const directorates = dirRes.data.filter((d: any) => d.directorate_type_id === 2);

      // Deputy Ministries are those with directorate_type_id === 1
      const deputyMinistries = dirRes.data.filter((d: any) => d.directorate_type_id === 1);

      setDirectorateOptions(directorates);
      setDeputyMinistryOptions(deputyMinistries);
      setEmploymentTypeOptions(empTypeRes.data.map((d: any) => d.name));
    } catch (error) {
      console.error("❌ Error fetching select options", error);
    }
  };

  fetchOptions();
}, []);

    console.log("Form State:", form);
    const handleChange = (
      e:
        | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
        | { target: { name: string; value: string } }
    ) => {
      setForm((prev) => ({
        ...prev,
        [e.target.name]: e.target.value.toString(), // <--- force string here
      }));
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

            <div className="flex">
              {currentStep > 0 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 text-blue-300 
                  hover:text-red-400 mb-3 transition mt-10 mr-2"
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
                    <div className="flex items-center justify-center">
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