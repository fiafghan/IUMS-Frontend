import { useState, useEffect } from "react";
import axios from "axios";
import { Pencil } from "lucide-react";

type User = {
  id: number;
  name: string;
  lastname: string;
  email: string;
  phone: string;
  position: string;
  directorate_id: number;
  employment_id: number;
  group_id: number;
  username: string;
  status: number;
  device_limit: number;
  mac_address?: string;
  device_type_id: number;
};

export default function EditUserModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState<any>({});

  const openModal = (userData: User) => {
    setUser(userData);
    setForm(userData);
    setIsOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.put(`/api/internet/${user?.id}`, form);
      alert(res.data.message);
      setIsOpen(false);
    } catch (error: any) {
      alert(error.response?.data.message || "خطا در به‌روزرسانی");
    }
  };

  return (
    <div>
      {/* مثال: پنسل برای باز کردن مودال */}
      <Pencil className="cursor-pointer" onClick={() => openModal({
        id:1, name:"Fardin", lastname:"Ibrahimi", email:"fardin@example.com",
        phone:"0799769626", position:"Developer", directorate_id:1, employment_id:1,
        group_id:1, username:"fardin123", status:1, device_limit:3, device_type_id:1
      })} />

      {/* مودال */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Name</label>
                <input type="text" name="name" value={form.name || ""} onChange={handleChange} className="border p-2 w-full rounded" />
              </div>

              <div>
                <label className="text-sm text-gray-500">Lastname</label>
                <input type="text" name="lastname" value={form.lastname || ""} onChange={handleChange} className="border p-2 w-full rounded" />
              </div>

              <div>
                <label className="text-sm text-gray-500">Email</label>
                <input type="email" name="email" value={form.email || ""} onChange={handleChange} className="border p-2 w-full rounded" />
              </div>

              <div>
                <label className="text-sm text-gray-500">Phone</label>
                <input type="text" name="phone" value={form.phone || ""} onChange={handleChange} className="border p-2 w-full rounded" />
              </div>

              <div>
                <label className="text-sm text-gray-500">Username</label>
                <input type="text" name="username" value={form.username || ""} onChange={handleChange} className="border p-2 w-full rounded" />
              </div>

              <div>
                <label className="text-sm text-gray-500">Position</label>
                <input type="text" name="position" value={form.position || ""} onChange={handleChange} className="border p-2 w-full rounded" />
              </div>

              {/* اضافه کردن سلکت‌ها برای directorate، employment و group */}
              <div>
                <label className="text-sm text-gray-500">Directorate</label>
                <input type="number" name="directorate_id" value={form.directorate_id || ""} onChange={handleChange} className="border p-2 w-full rounded" />
              </div>

              <div>
                <label className="text-sm text-gray-500">Employment Type</label>
                <input type="number" name="employment_id" value={form.employment_id || ""} onChange={handleChange} className="border p-2 w-full rounded" />
              </div>

              <div>
                <label className="text-sm text-gray-500">Group</label>
                <input type="number" name="group_id" value={form.group_id || ""} onChange={handleChange} className="border p-2 w-full rounded" />
              </div>

              <div>
                <label className="text-sm text-gray-500">Device Limit</label>
                <input type="number" name="device_limit" value={form.device_limit || ""} onChange={handleChange} className="border p-2 w-full rounded" />
              </div>

              <div>
                <label className="text-sm text-gray-500">MAC Address</label>
                <input type="text" name="mac_address" value={form.mac_address || ""} onChange={handleChange} className="border p-2 w-full rounded" />
              </div>

              <div>
                <label className="text-sm text-gray-500">Device Type</label>
                <input type="number" name="device_type_id" value={form.device_type_id || ""} onChange={handleChange} className="border p-2 w-full rounded" />
              </div>
            </div>

            <div className="flex justify-end mt-6 gap-2">
              <button className="px-4 py-2 rounded bg-gray-400 text-white" onClick={() => setIsOpen(false)}>Cancel</button>
              <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={handleSubmit}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
