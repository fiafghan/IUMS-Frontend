import { Mail, Phone, User } from "lucide-react";
import type { FormState } from "../../types/types";
import { InputField } from "./InputField";
import type { JSX } from "react";

export function Step1({ form, onChange }: { form: FormState; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }): JSX.Element {
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