import { Mail, Phone, User } from "lucide-react";
import type { FormState } from "../../types/types";
import { InputField } from "./InputField";
import { useEffect, useState, type JSX } from "react";
import axios from "axios";
import { route } from "../../config";

export function Step1({ form, onChange }: { form: FormState; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }): JSX.Element {
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const checkPhone = (phoneToCheck: string) => {
    if (!phoneToCheck) {
      setPhoneError(null);
      return;
    }
    axios.post(`${route}/check-phone-of-internet-user`, { phone: phoneToCheck })
      .then(res => {
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
    axios.post(`${route}/check-email-of-internet-users`, { email: emailToCheck })
      .then(res => {
        if (res.data.exists) {
          setEmailError(res.data.message || "This email is already registered! Please try another one!");
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
      axios.post(`${route}/check-username`, { username: form.username })  // مسیر api رو درست کن اگر فرق داره
        .then(res => {
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
    <div>
      <InputField label="Name" icon={<User className="w-5 h-5 text-gray-500" />}
        name="name" type="text" placeholder="Ahmad" value={form.name} onChange={onChange} />
      <InputField label="Last Name" icon={<User className="w-5 h-5 text-gray-500" />}
        name="last_name" type="text" placeholder="Ahmadi" value={form.last_name} onChange={onChange} />
      <InputField label="Username" icon={<User className="w-5 h-5 text-gray-500" />}
        name="username" type="text" placeholder="Ahmadi-it" value={form.username} onChange={onChange} />
      {usernameError && <p className="text-red-600 text-sm mt-1">{usernameError}</p>}
      <InputField label="Email" icon={<Mail className="w-5 h-5 text-gray-500" />}
        name="email" type="email" placeholder="you@example.com" value={form.email} onChange={onChange} />
      {emailError && <p className="text-red-600">{emailError}</p>}
      <InputField label="Phone" icon={<Phone className="w-5 h-5 text-gray-500" />}
        name="phone" type="tel" placeholder="+1234567890" value={form.phone} onChange={onChange} />
        {phoneError && <p className="text-red-600 text-sm mt-1">{phoneError}</p>}
    </div>
  );
}