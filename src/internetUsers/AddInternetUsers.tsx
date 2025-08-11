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
import { stepTitles } from "./steps/steps_titles";
import { route } from "../config";
import Swal from 'sweetalert2'
import { ProgressBar } from "../components/ProgressBar";

export default function InternetUserAddForm(): JSX.Element {
  const [form, setForm] = useState<FormState>({
    name: "",
    last_name: "",
    username: "",
    email: "",
    phone: "",
    employment_type: "",
    directorate: "",
    deputyMinistry: "",
    position: "",
    device_limit: "",
    group_id: 1,
    device_type: "",
    mac_address: "",
    status: "1",
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [directorateOptions, setDirectorateOptions] = useState<string[]>([]);
  const [, setDeputyMinistryOptions] = useState<string[]>([]);
  const [employmentTypeOptions, setEmploymentTypeOptions] = useState<{ id: string, name: string }[]>([]);




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
        setEmploymentTypeOptions(empTypeRes.data);
      } catch (error) {
        console.error("❌ Error fetching select options", error);
      }
    };

    fetchOptions();
  }, []);

  console.log("Form State:", form);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | { target: { name: string; value: string } }
  ) => {
    if (e.target.name === "phone") {
      let phone = e.target.value;

      // حذف فاصله‌ها و کاراکترهای غیرمجاز
      phone = phone.replace(/\s+/g, "").replace(/[^0-9+]/g, "");

      // اگر با +93 شروع نمی‌شود، اضافه‌اش کن
      if (!phone.startsWith("+93")) {
        // اگر کاربر صفر اول داده باشه، صفر رو حذف می‌کنیم
        if (phone.startsWith("0")) {
          phone = "+93" + phone.slice(1);
        } else {
          phone = "+93" + phone.replace(/^\+?93?/, "");
        }
      }

      // محدود کردن طول به 12 رقم
      if (phone.length > 12) {
        phone = phone.slice(0, 12);
      }

      setForm((prev) => ({
        ...prev,
        phone,
      }));
      return;
    }

    if (e.target.name === "mac_address") {
      let mac = e.target.value
        .toUpperCase() // حروف کوچک رو بزرگ کنه
        .replace(/[^0-9A-F]/g, "") // فقط اعداد و حروف هگز بمانند
        .match(/.{1,2}/g)?.join(":") || ""; // هر دو کاراکتر یک ":"

      // طول نهایی رو محدود کنیم
      if (mac.length > 17) {
        mac = mac.slice(0, 17);
      }

      setForm((prev) => ({
        ...prev,
        mac_address: mac,
      }));
      return;
    }


    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
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
          form.device_type !== ""
        );

      default:
        return true;
    }
  }

  const nextStep = () => {
    if (!validateStep(currentStep)) {
      Swal.fire({
        icon: "error",
        title: "Required Fields!!!",
        text: "Please fill all the required fields!",
        footer: 'Press Okay!'
      }); return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, stepTitles.length - 1));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (!validateStep(2)) {
      Swal.fire({
        icon: "error",
        title: "Required Fields!!!",
        text: "Please fill all the required fields!",
        footer: 'Press Okay!'
      }); setCurrentStep(2);
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        name: form.name,
        lastname: form.last_name,
        username: form.username,
        email: form.email,
        phone: form.phone,
        status: parseInt(form.status),
        directorate_id: parseInt(form.directorate),
        employee_type_id: parseInt(form.employment_type),
        position: form.position,
        device_limit: form.device_limit,
        mac_address: form.mac_address || null,
        device_type_id: parseInt(form.device_type),
        group_id: form.group_id,
      };

      await axios.post(`${route}/internet`, submitData);
      Swal.fire({
        icon: "success",
        title: "Internet User Created!",
        text: "Internet User Was Created Successfully!",
        footer: 'Press Okay!'
      }); setCurrentStep(0);
      navigate("/");
    } catch (error: any) {
      console.error("Error adding user:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
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
            className="w-full max-w-7xl bg-white shadow-2xl border border-gray-200 rounded-3xl px-10 py-12 relative z-10"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >

            <ProgressBar
              currentStep={currentStep}
              totalSteps={stepTitles.length}
              stepsLabels={stepTitles}
            />

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
                  className="bg-gradient-to-l from-red-400 to-gray-50 w-22"
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
                  className="h-10 px-6 bg-gradient-to-r from-blue-300 to blue-200"
                >
                  Next
                </button>
              ) : (
                <AnimatedSubmitButton onClick={handleSubmit} disabled={loading} className="h-10 px-6 bg-gradient-to-r from-blue-300 to blue-200" >
                  {loading ? (
                    <div className="flex items-center gap-2">
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