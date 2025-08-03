import type { JSX } from "react";
import type { FormState } from "../../types/types";


export function Step4({ form }: { form: FormState }): JSX.Element {
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