import { useEffect, useMemo, useState, type JSX } from "react";
import axios from "axios";
import {
  Search
} from "lucide-react";
import GradientSidebar from "../components/Sidebar";
import UserFilters from "../components/UserFilters";
import type { InternetUser, ViolationType } from "../types/types";
import { route } from "../config";
import ScrollToTopButton from "../components/scrollToTop";
import UserRow from "../components/userRow";

const headers = [
  "Name", "Last Name", "Username", "Directorate", "Position", "Group Type",
  "Status", "Actions"
];


export default function InternetUsersList(): JSX.Element {
  const [users, setUsers] = useState<InternetUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<InternetUser | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<InternetUser>>({});
  const [selectedDeputyMinistry, setSelectedDeputyMinistry] = useState<string>("");
  const [selectedDirectorate, setSelectedDirectorate] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewUser, setViewUser] = useState<InternetUser | null>(null);
  const deputyMinistryOptions: { id: number; name: string }[] = [];
  const directorateOptions: { id: number; name: string }[] = [];
  const employmentTypes: { id: number; name: string }[] = [];
  const deviceTypes: { id: number; name: string }[] = [];
  const groups: { id: number; name: string }[] = [];
  const violationTypes: ViolationType[] = [];


  const currentUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
  const token = currentUser?.token;
  const isViewer = currentUser?.user.role === 'viewer';


  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get<InternetUser[]>(`${route}/internet`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data);
      } catch (err) {
        setError("Failed to fetch users. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);



  const handleView = (user: InternetUser) => {
    setViewUser(user);
    setIsViewOpen(true);
  };


  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setEditForm({
      ...user,
      directorate_id: Number(user.directorate_id)
    });
    setIsEditOpen(true);
  };


  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!selectedUser) return;
    const payload = {
      ...editForm
    };

    try {
      await axios.put(`${route}/internet/${selectedUser.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsEditOpen(false);
      // refresh data
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error(err.response?.data);
      } else {
        console.error(err);
      }
    }
  };


  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Are you sure you want to delete this user?");
    if (!confirm) return;

    try {
      await axios.delete(`${route}/internet/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      alert("Failed to delete user.");
    }
  };


  const filteredUsers = useMemo(() => {
     const search = searchTerm.toLowerCase();
    return users.filter(user =>
      (selectedDeputyMinistry === "" || user.deputy === selectedDeputyMinistry) &&
      (selectedDirectorate === "" || String(user.directorate_id) === selectedDirectorate) &&
      (selectedStatus === "" ||
        (selectedStatus === "active" && user.status === 1) ||
        (selectedStatus === "deactive" && user.status === 0)) &&
      (
        user.name.toLowerCase().includes(search) ||
        user.username.toLowerCase().includes(search) ||
        user.phone.toLowerCase().includes(search) ||
        user.lastname.toLowerCase().includes(search) ||
        String(user.employee_type_id).toLowerCase().includes(search) ||
        String(user.device_type_id).toLowerCase().includes(search) ||
        (user.violation_type_id && String(user.violation_type_id).toLowerCase().includes(search) ||
        String(user.violations_count).toLowerCase().includes(search))
      )
    );
  }, [users, selectedDeputyMinistry, selectedDirectorate, selectedStatus, searchTerm]);


  return (
    <div className="min-h-screen flex bg-white shadow-md shadow-indigo-700">
      <ScrollToTopButton />
      <div className="fixed top-0 left-0 bottom-0 w-64 border-r 
      border-gray-200 bg-white shadow-sm z-20">
        <GradientSidebar />
      </div>
      <main className="flex-1 ml-64 p-8 overflow-auto">

        <div className="flex mb-4 mt-5 justify-center w-full">
          <UserFilters
            deputyMinistryOptions={deputyMinistryOptions
              .filter(dm => dm.id >= 1 && dm.id <= 5)
              .map(dm => ({ ...dm, id: String(dm.id) }))}
            directorateOptions={directorateOptions.map(dir => ({ ...dir, id: String(dir.id) }))}
            selectedDeputyMinistry={selectedDeputyMinistry}
            setSelectedDeputyMinistry={setSelectedDeputyMinistry}
            selectedDirectorate={selectedDirectorate}
            setSelectedDirectorate={setSelectedDirectorate}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
          />
          <div className="relative w-full max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 rounded-full bg-blue-400 p-1 text-amber-400 scale-120 shadow-md shadow-gray-500" />
            </div>
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="block w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300
                   text-gray-900 placeholder-gray-400 focus:outline-none
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                   transition duration-150 ease-in-out sm:text-sm border-r-blue-300 rounded-r-full 
                   border-l-blue-300 border-l-2 border-r-2 rounded-l-full"
              autoComplete="off"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Loading users...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : users.length === 0 ? (
          <p className="text-center py-6 text-gray-500 font-medium">No users found.</p>
        ) : (
          <div className="overflow-x-auto rounded-sm 
          shadow-lg bg-white border 
          border-gray-200 max-w-full">
            <div className="overflow-x-auto rounded-sm shadow-md bg-white border border-white max-w-full scrollbar-custom">
              <table className="table-auto w-full text-left text-sm">
                {/* Table Head */}
                <thead>
                  <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs uppercase 
              tracking-wider select-none rounded-t-xl">

                    {headers.map((header) => (
                      <th
                        key={header}
                        className="px-3 py-2 border-r border-white last:border-r-0 bg-gray-100 text-blue-400 text-[8px] font-semibold"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Table Body */}

                <tbody>
                  {filteredUsers.map((user, idx) => (
                    <UserRow
                      key={user.id}
                      user={user}
                      idx={idx}
                      handleEdit={handleEdit}
                      handleDelete={handleDelete}
                      handleView={handleView}
                      isViewer={isViewer}
                      currentUserRole={currentUser?.user.role}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* View Modal */}
      {isViewOpen && viewUser && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 px-6 py-4 flex items-center justify-between">
              <h2 className="text-white font-bold text-lg">User Details</h2>
              <button
                onClick={() => setIsViewOpen(false)}
                className="text-white text-sm bg-white/20 hover:bg-white/30 rounded-md px-3 py-1"
              >
                Close
              </button>
            </div>

            {/* Body */}
            <div className="p-6 max-h-[75vh] overflow-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="border rounded-lg p-3">
                  <div className="text-gray-500 text-xs">Name</div>
                  <div className="font-medium">{viewUser.name || "-"}</div>
                </div>

                <div className="border rounded-lg p-3">
                  <div className="text-gray-500 text-xs">Last Name</div>
                  <div className="font-medium">{viewUser.lastname || "-"}</div>
                </div>

                <div className="border rounded-lg p-3">
                  <div className="text-gray-500 text-xs">Username</div>
                  <div className="font-medium">{viewUser.username || "-"}</div>
                </div>

                <div className="border rounded-lg p-3">
                  <div className="text-gray-500 text-xs">Phone</div>
                  <div className="font-medium">{viewUser.phone || "-"}</div>
                </div>

                <div className="border rounded-lg p-3">
                  <div className="text-gray-500 text-xs">Directorate</div>
                  <div className="font-medium">{viewUser.directorate_id || "-"}</div>
                </div>

                <div className="border rounded-lg p-3">
                  <div className="text-gray-500 text-xs">Deputy Ministry</div>
                  <div className="font-medium">{viewUser.deputy || "-"}</div>
                </div>

                <div className="border rounded-lg p-3">
                  <div className="text-gray-500 text-xs">Position</div>
                  <div className="font-medium">{viewUser.position || "-"}</div>
                </div>

                <div className="border rounded-lg p-3">
                  <div className="text-gray-500 text-xs">Group</div>
                  <div className="font-medium">
                    {typeof viewUser.group_id === "number" ? viewUser.group_id : (viewUser.group_id as any) ?? "-"}
                  </div>
                </div>

                <div className="border rounded-lg p-3">
                  <div className="text-gray-500 text-xs">Employment Type</div>
                  <div className="font-medium">{viewUser.employee_type || "-"}</div>
                </div>

                <div className="border rounded-lg p-3">
                  <div className="text-gray-500 text-xs">Device Type</div>
                  <div className="font-medium">{viewUser.device_type_id || "-"}</div>
                </div>

                <div className="border rounded-lg p-3">
                  <div className="text-gray-500 text-xs">Device Limit</div>
                  <div className="font-medium">{viewUser.device_limit ?? "-"}</div>
                </div>

                <div className="border rounded-lg p-3">
                  <div className="text-gray-500 text-xs">Mac Address</div>
                  <div className="font-medium">{viewUser.mac_address || "-"}</div>
                </div>

                <div className="border rounded-lg p-3">
                  <div className="text-gray-500 text-xs">Violation Type</div>
                  <div className="font-medium">{viewUser.violation_type || "-"}</div>
                </div>

                <div className="border rounded-lg p-3">
                  <div className="text-gray-500 text-xs">Violations Count</div>
                  <div className="font-medium">{viewUser.violations_count ?? 0}</div>
                </div>

                <div className="border rounded-lg p-3">
                  <div className="text-gray-500 text-xs">Status</div>
                  <div className="font-medium">
                    {viewUser.status === 1 ? "active" : viewUser.status === 0 ? "deactive" : "-"}
                  </div>
                </div>

                <div className="md:col-span-2 border rounded-lg p-3">
                  <div className="text-gray-500 text-xs">Comment</div>
                  <div className="font-medium whitespace-pre-wrap">{viewUser.comment || "-"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditOpen && selectedUser && (
        <div className="fixed inset-0 bg-gradient-to-r from-blue-400 via-blue-300 to-blue-100 flex justify-center 
        items-center z-50 px-4 rounded-md">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl border border-gray-200 
          flex flex-col lg:flex-row scale-80">

            {/* Left - Preview */}
            <div className="lg:w-1/2 w-full bg-gradient-to-br from-blue-100 to-blue-200 
            p-8 flex flex-col justify-center">
              <h2 className="text-xl font-bold text-blue-800 mb-2">Edit User</h2>
              <p className="text-[13px] text-blue-700 mb-4">Make changes to this user's profile.</p>
              <ul className="space-y-2 text-[11px] text-blue-900 overflow-auto pr-2">
                {Object.entries(selectedUser).map(([key, value]) =>
                  key !== "status" ? (
                    <li key={key}>
                      <strong className="capitalize">{key.replace("_", " ")}:</strong> {value || "-"}
                    </li>
                  ) : null)}
              </ul>
            </div>

            {/* Right - Form */}
            <div className="lg:w-1/2 w-full p-8 bg-white max-h-[90vh] scale-80">
              <div className="grid grid-cols-3  gap-4">
                {Object.keys(editForm).map((key) =>
                  key !== "status" && key !== "violations_count" && key !== "comment" && key !== "employment_type"
                    && key !== "directorate" && key !== "deputyMinistry" && key !== "count" && key !== "id"
                    && key !== "device_type" && key !== "mac_address" && key !== "violation_type" && key !== "deputy" && key !== "group_id"
                    && key !== "violation_type_id" && key !== "employee_type_id" && key !== "device_type_id"
                    && key !== "directorate_id" && key !== "groups" && key !== "device_limit" && key !== "violations" ? (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 capitalize">{key.replace("_", " ")}</label>
                      <input
                        type="text"
                        name={key}
                        value={(editForm as any)[key] || ""}
                        onChange={handleEditChange}
                        className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                  ) : null
                )}

                {/* Directorate */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Directorate</label>
                  <select
                    name="directorate_id"
                    value={editForm.directorate_id || ""}
                    onChange={(e) =>
                      setEditForm(prev => ({ ...prev, directorate_id: Number(e.target.value) }))
                    }
                    className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    {directorateOptions.map(dir => (
                      <option key={dir.id} value={dir.id}>{dir.name}</option>
                    ))}
                  </select>
                </div>


                {/* mac address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 capitalize">Mac Address</label>
                  <input
                    type="text"
                    name={"mac_address"}
                    value={editForm.mac_address || ""}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                {/* violation type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Violation Type</label>
                  <select
                    name="violation_type_id"
                    value={editForm.violation_type_id || ""}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        violation_type_id: Number(e.target.value),
                      }))
                    }
                    className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    {violationTypes.map((vt) => (
                      <option key={vt.id} value={vt.id}>
                        {vt.name}
                      </option>
                    ))}
                  </select>

                </div>


                {/* Groups */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Group</label>
                  <select
                    name="group_id"
                    value={editForm.group_id || ""}
                    onChange={(e) => setEditForm(prev => ({ ...prev, group_id: Number(e.target.value) }))}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    {groups.map(group => (
                      <option key={group.id} value={group.id}>{group.name}</option>
                    ))}
                  </select>
                </div>


                {/* Employment Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
                  <select
                    name="employee_type_id"
                    value={editForm.employee_type_id || ""}
                    onChange={(e) => setEditForm(prev => ({ ...prev, employee_type_id: Number(e.target.value) }))}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    {employmentTypes.map(emp_type => (
                      <option key={emp_type.id} value={emp_type.id}>{emp_type.name}</option>
                    ))}
                  </select>
                </div>


                {/* Device limit */}
                <div>
                  <label htmlFor="">Device limit</label>
                  <input type="text" className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none 
              focus:ring-2 focus:ring-blue-40" value={editForm.device_limit} />
                </div>


                {/* Device Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Device Type</label>
                  <select
                    name="device_type_id"
                    value={editForm.device_type_id || ""}
                    onChange={(e) => setEditForm(prev => ({ ...prev, device_type_id: Number(e.target.value) }))}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm 
                    focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    {deviceTypes.map(dt => (
                      <option key={dt.id} value={dt.id}>{dt.name}</option>
                    ))}
                  </select>
                </div>

                {/* Violations */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Violations</label>
                  <select
                    name="violations_count"
                    value={editForm.violations_count || "0"}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none 
              focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                  </select>
                </div>

                {/* Comment */}
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700">Comment</label>
                  <textarea
                    name="comment"
                    value={editForm.comment || ""}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    rows={3}
                    placeholder="Write a comment..."
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex justify-end gap-4 border-t pt-4 border-gray-200">
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="px-5 py-2 rounded-md text-sm bg-white border border-gray-300 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-5 py-2 rounded-md text-sm text-white bg-blue-500 hover:bg-blue-600 transition shadow"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}