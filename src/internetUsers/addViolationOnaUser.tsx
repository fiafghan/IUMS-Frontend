// src/internetUsers/addvaiolationonauser.tsx
import React, { useState } from "react";
import { ApiDropdown } from "../components/ApiDropDown";

const AddVaiolationOnAUser: React.FC = () => {
  const [form, setForm] = useState({
    userId: "",
    violationType: "",
    status: "",
    numberOfViolations: "1",
    comment: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Replace this with your POST logic if needed
    console.log("Submitted violation:", form);
    alert("Violation submitted! (Check console for data)");
  };

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", padding: 24, border: "1px solid #eee", borderRadius: 8 }}>
      <h2>Add Violation On A User</h2>
      <form onSubmit={handleSubmit}>
        <ApiDropdown
          apiUrl="/api/users" // TODO: Update with your actual users API
          label="User Name"
          name="userId"
          value={form.userId}
          onChange={handleChange}
          icon={null}
          placeholder="Select user"
        />
        <br />
        <ApiDropdown
          apiUrl="/api/violation-types" // TODO: Update with your actual violation types API
          label="Violation Type"
          name="violationType"
          value={form.violationType}
          onChange={handleChange}
          icon={null}
          placeholder="Select violation type"
        />
        <br />
        <label>
          Number of Violations
          <select
            name="numberOfViolations"
            value={form.numberOfViolations}
            onChange={handleChange}
            style={{ display: "block", width: "100%", marginTop: 4, marginBottom: 16 }}
          >
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
        </label>
        <br />
        <ApiDropdown
          apiUrl="/api/statuses" // TODO: Update with your actual statuses API
          label="Status"
          name="status"
          value={form.status}
          onChange={handleChange}
          icon={null}
          placeholder="Select status"
        />
        <br />
        <label>
          Comment
          <textarea
            name="comment"
            value={form.comment}
            onChange={handleChange}
            rows={4}
            style={{ display: "block", width: "100%", marginTop: 4, marginBottom: 16 }}
            placeholder="Enter comment"
          />
        </label>
        <br />
        <button type="submit" style={{ width: "100%", padding: 12, background: "#1976d2", color: "#fff", border: "none", borderRadius: 4, fontWeight: "bold" }}>
          Send
        </button>
      </form>
    </div>
  );
};

export default AddVaiolationOnAUser;