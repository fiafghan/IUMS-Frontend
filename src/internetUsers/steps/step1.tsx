import { IdCard, Mail, Phone, User } from "lucide-react";
import type { FormState } from "../../types/types";
import { InputField } from "./InputField";
import { useEffect, useState, type JSX } from "react";
import axios from "axios";
import { route } from "../../config";

export function Step1({
  form,
  onChange,
}: {
  form: FormState;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}): JSX.Element {
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  // Sanitize inputs: email should only contain ASCII (English) characters and must include '@'
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") {
      // Remove any non-ASCII characters
      const asciiOnly = value.replace(/[^\x00-\x7F]/g, "");
      // Optionally trim spaces
      const sanitized = asciiOnly.replace(/\s+/g, "");

      // Inline validation messages
      if (sanitized !== value) {
        setEmailError("Email must contain only English (ASCII) characters.");
      } else if (sanitized && !sanitized.includes("@")) {
        setEmailError("Email must contain @ symbol.");
      } else if (
        emailError === "Email must contain only English (ASCII) characters." ||
        emailError === "Email must contain @ symbol."
      ) {
        // Clear only our inline messages; server messages remain managed by checkEmail
        setEmailError(null);
      }

      onChange({ ...e, target: { ...e.target, name, value: sanitized } });
      return;
    }

    onChange(e);
  };

  const checkPhone = (phoneToCheck: string) => {
    if (!phoneToCheck) {
      setPhoneError(null);
      return;
    }

    if (!phoneToCheck.startsWith("+93")) {
      phoneToCheck = "+93" + phoneToCheck.replace(/^(\+93)?/, "");
    }

    if (phoneToCheck.length !== 12) {
      setPhoneError("Phone number must be 10 characters!");
    }

    if (phoneToCheck[3] !== "7") {
      setPhoneError("The phone number must be 7xxxxxxxx!");
      return;
    }
    const { token } = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
    axios
      .post(
        `${route}/check-phone-of-internet-user`,
        { phone: phoneToCheck },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res.data.exists) {
          setPhoneError(res.data.message);
        } else {
          setPhoneError(null);
        }
      })
      .catch(() => {
        setPhoneError(null);
      });
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      checkPhone(form.phone);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [form.phone]);

  const checkEmail = (emailToCheck: string) => {
    if (!emailToCheck) {
      setEmailError(null);
      return;
    }
    // Basic client-side guards before hitting the API
    if (!/^[\x00-\x7F]+$/.test(emailToCheck)) {
      setEmailError("Email must contain only English (ASCII) characters.");
      return;
    }
    if (!emailToCheck.includes("@")) {
      setEmailError("Email must contain @ symbol.");
      return;
    }
    const { token } = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
    axios
      .post(
        `${route}/check-email-of-internet-users`,
        { email: emailToCheck },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res.data.exists) {
          setEmailError(
            res.data.message ||
              "This email is already registered! Please try another one!"
          );
        } else {
          setEmailError(null);
        }
      })
      .catch(() => {
        setEmailError(null);
      });
  };

  useEffect(() => {
    if (!form.username) {
      setUsernameError(null);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      const { token } = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
      axios
        .post(
          `${route}/check-username`,
          { username: form.username },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          if (res.data.exists) {
            setUsernameError("This User name is already taken try another one!");
          } else {
            setUsernameError(null);
          }
        })
        .catch(() => {
          setUsernameError(null);
        });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [form.username]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      checkEmail(form.email);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [form.email]);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 md:p-8 max-w-5xl mx-auto">
      <h2 className="text-3xl font-extrabold mb-6 tracking-tight text-slate-900">
        User Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Name */}
        <div className="flex flex-col">
          <InputField
            label="Name"
            icon={
              <User className="w-5 h-5 text-white bg-slate-600 rounded-sm p-1 scale-150 mr-2" />
            }
            name="name"
            type="text"
            placeholder="Ahmad"
            value={form.name}
            onChange={onChange}
          />
        </div>

        {/* Last Name */}
        <div className="flex flex-col">
          <InputField
            label="Last Name"
            icon={
              <IdCard className="w-5 h-5 text-white bg-slate-600 rounded-sm p-1 scale-150 mr-2" />
            }
            name="last_name"
            type="text"
            placeholder="Ahmadi"
            value={form.last_name}
            onChange={onChange}
          />
        </div>

        {/* Username */}
        <div className="flex flex-col">
          <InputField
            label="Username"
            icon={
              <User className="w-5 h-5 text-white bg-slate-600 rounded-sm p-1 scale-150 mr-2" />
            }
            name="username"
            type="text"
            placeholder="Ahmadi-it"
            value={form.username}
            onChange={onChange}
          />
          {usernameError && (
            <p className="text-red-600 text-xs mt-2">{usernameError}</p>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <InputField
            label="Email"
            icon={
              <Mail className="w-5 h-5 text-white bg-slate-600 rounded-sm p-1 scale-150 mr-2" />
            }
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleInputChange}
          />
          {emailError && (
            <p className="text-red-600 text-xs mt-2">{emailError}</p>
          )}
        </div>

        {/* Phone */}
        <div className="flex flex-col">
          <InputField
            label="Phone"
            icon={
              <Phone className="w-5 h-5 text-white bg-slate-600 rounded-sm p-1 scale-150 mr-2" />
            }
            name="phone"
            type="tel"
            placeholder="+937xxxxxxxx"
            value={form.phone}
            onChange={onChange}
          />
          {phoneError && (
            <p className="text-red-600 text-xs mt-2">{phoneError}</p>
          )}
        </div>
      </div>
    </div>
  );
}
