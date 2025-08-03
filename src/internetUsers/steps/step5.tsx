import { Hash, User } from "lucide-react";
import type { FormState } from "../../types/types";
import { SelectField } from "./selectfield";
import type { JSX } from "react";

export function Step5({ form, onChange }: { form: FormState; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void }): JSX.Element {
  return (
    <div>
      <SelectField
        label="Status"
        icon={<User className="w-5 h-5 text-gray-500" />}
        name="status"
        value={form.status}
        onChange={onChange}
        options={[
          { value: "Active", label: "Active" },
          { value: "Deactive", label: "Deactive" }
        ]}
      />

      <SelectField
        label="Number of Violations"
        icon={<Hash className="w-5 h-5 text-gray-500" />}
        name="violations"
        value={form.violations}
        onChange={onChange}
        options={[
          { value: "0", label: "0" },
          { value: "1", label: "1" },
          { value: "2", label: "2" }
        ]}
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