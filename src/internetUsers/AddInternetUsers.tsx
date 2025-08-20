import { useState, type JSX, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSubmitButton from "../components/AnimatedButton";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router-dom";
import GradientSidebar from "../components/Sidebar";
import type { FormState, SelectedDevice } from "../types/types";
import { Step1 } from "./steps/step1";
import { Step2 } from "./steps/step2";
import { Step3 } from "./steps/step3";
import { Step4 } from "./steps/step4";
import { stepTitles } from "./steps/steps_titles";
import { route } from "../config";
import Swal from "sweetalert2";
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
    selectedDevices: [],
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // تایپ‌ها را عمومی گذاشتم چون پاسخ API آبجکت کامل برمی‌گرداند
  const [directorateOptions, setDirectorateOptions] = useState<any[]>([]);
  const [, setDeputyMinistryOptions] = useState<any[]>([]);
  const [employmentTypeOptions, setEmploymentTypeOptions] = useState<
    { id: string; name: string }[]
  >([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const { token } = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
        const [dirRes, empTypeRes] = await Promise.all([
          axios.get(`${route}/directorate`, {
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          }),
          axios.get(`${route}/employment-type`, {
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          }),
        ]);

        const directorates = dirRes.data.filter((d: any) => d.directorate_type_id === 2);
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

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | SelectedDevice[] } }
  ) => {
    // selectedDevices
    if (e.target.name === "selectedDevices") {
      setForm((prev) => ({
        ...prev,
        selectedDevices: e.target.value as SelectedDevice[],
      }));
      return;
    }

    // phone
    if (e.target.name === "phone") {
      let phone = e.target.value as string;
      phone = phone.replace(/\s+/g, "").replace(/[^0-9+]/g, "");
      if (!phone.startsWith("+93")) {
        if (phone.startsWith("0")) phone = "+93" + phone.slice(1);
        else phone = "+93" + phone.replace(/^\+?93?/, "");
      }
      if (phone.length > 12) phone = phone.slice(0, 12);

      setForm((prev) => ({ ...prev, phone }));
      return;
    }

    // mac_address (در استپ ۳ هم به ازای هر دستگاه داریم، این یکی فیلد کلی است)
    if (e.target.name === "mac_address") {
      let mac =
        ((e.target.value as string).toUpperCase().replace(/[^0-9A-F]/g, "").match(/.{1,2}/g)?.join(":") as
          | string
          | undefined) || "";
      if (mac.length > 17) mac = mac.slice(0, 17);
      setForm((prev) => ({ ...prev, mac_address: mac }));
      return;
    }

    // سایر فیلدها
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value as string,
    }));
  };

  function validateStep(step: number): boolean {
    switch (step) {
      case 0:
        return form.name.trim() !== "" && form.username.trim() !== "";
      case 1:
        return (
          form.employment_type.trim() !== "" &&
          form.directorate.trim() !== "" &&
          form.position.trim() !== "" &&
          form.deputyMinistry.trim() !== ""
        );
      case 2:
        return (
          form.device_limit.trim() !== "" &&
          form.selectedDevices &&
          form.selectedDevices.length > 0 &&
          form.selectedDevices.every((device) => device.deviceTypeId > 0 && device.groupId > 0)
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
        footer: "Press Okay!",
      });
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, stepTitles.length - 1));
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const handleSubmit = async () => {
    if (!validateStep(2)) {
      Swal.fire({
        icon: "error",
        title: "Required Fields!!!",
        text: "Please fill all the required fields!",
        footer: "Press Okay!",
      });
      setCurrentStep(2);
      return;
    }

    setLoading(true);

    // آماده‌سازی داده‌ها مطابق بک‌اند
    const payload = {
      username: form.username.trim(),
      status: parseInt(form.status, 10),
      phone: form.phone.trim(),
      directorate_id: parseInt(form.directorate, 10),
      email: form.email.trim(),
      employee_type_id: parseInt(form.employment_type, 10),
      position: form.position.trim(),
      device_limit: parseInt(form.device_limit, 10),
      mac_address: form.mac_address || form.selectedDevices[0]?.macAddress || null,
      group_id: form.group_id,
      name: form.name.trim(),
      lastname: form.last_name.trim(),
      device_type_ids: form.selectedDevices.map((d) => d.deviceTypeId),
    };

    try {
      const { token } = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
      await axios.post(`${route}/internet`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      Swal.fire({
        icon: "success",
        title: "Internet User Created!",
        text: "Internet User Was Created Successfully!",
        footer: "Press Okay!",
      });
      setCurrentStep(0);
      navigate("/");
    } catch (error: any) {
      console.error("Error adding user:", error);
      console.error("Error response:", error?.response?.data);
      console.error("Error status:", error?.response?.status);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: error?.response?.data?.message || "Something went wrong while adding user.",
      });
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
            className="fixed inset-0 z-50 flex items-center justify-center 
            bg-black bg-opacity-50 backdrop-blur-sm"
            aria-label="Loading..."
            role="alert"
            aria-live="assertive"
          >
            <Spinner size={48} thickness={5} colorClass="border-white" ariaLabel="Loading form submission" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
        <GradientSidebar />
        <motion.div className="flex-1 flex flex-col items-center justify-center px-4" initial={false}>
          <motion.div
            className="w-full max-w-7xl bg-white shadow-sm border border-gray-50 rounded-sm px-10 py-10 relative scale-70"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <ProgressBar currentStep={currentStep} totalSteps={stepTitles.length} stepsLabels={stepTitles} />

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
                      return (
                        <Step2
                          form={form}
                          directorateOptions={directorateOptions}
                          employmentTypeOptions={employmentTypeOptions}
                          onChange={handleChange}
                        />
                      );
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
                <button type="button" onClick={prevStep} className="bg-gradient-to-l from-red-400 to-gray-50 w-22">
                  Back
                </button>
              ) : (
                <div />
              )}
              {currentStep < stepTitles.length - 1 ? (
                <button type="button" onClick={nextStep} className="h-10 px-6 bg-gradient-to-r from-blue-300 to blue-200">
                  Next
                </button>
              ) : (
                <AnimatedSubmitButton onClick={handleSubmit} disabled={loading} className="h-10 px-6 bg-gradient-to-r from-blue-300 to blue-200">
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
