import { useEffect, useState, type JSX } from "react";
import axios from "axios";
import {
  User, Edit, Trash,
  Search, Users, Briefcase, Building2
} from "lucide-react";
import GradientSidebar from "../components/Sidebar";
import { Combobox } from "@headlessui/react";
import UserFilters from "../components/UserFilters";
import type { InternetUser } from "../types/types";
import { route } from "../config";

const headers = [
  "Phone", "Employment Type", "Directorate", "Deputy Ministry", "Position", "Device Limit", "Device Type", "Group Type",
  "MAC Address", "Status", "Violations Count", "Violation Type", "Comment"
];

const fixedHeaders = ["Name", "Username", "Last Name", "Email", "Actions"];

export default function InternetUsersList(): JSX.Element {
  const [users, setUsers] = useState<InternetUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<InternetUser | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<InternetUser>>({});
  const [deputyMinistryOptions, setDeputyMinistryOptions] = useState<{ id: number; name: string }[]>([]);
  const [directorateOptions, setDirectorateOptions] = useState<{ id: number; name: string }[]>([]);
  const [selectedDeputyMinistry, setSelectedDeputyMinistry] = useState<string>("");
  const [selectedDirectorate, setSelectedDirectorate] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [employmentTypes, setEmploymentTypes] = useState<{ id: number; name: string }[]>([]);
  const [selectedDirectorateEdit, setSelectedDirectorateEdit] = useState<{ id: number; name: string } | null>(null);
  const [queryDirectorate, setQueryDirectorate] = useState("");
  const [selectedDeputyMinistryEdit, setSelectedDeputyMinistryEdit] = useState<{ id: number; name: string } | null>(null);
  const [queryDeputyMinistryEdit, setQueryDeputyMinistryEdit] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [expanded, setExpanded] = useState(false);



  const totalUsers = users.length;
  const activeUsers = users.filter((user) => user.status === 1).length;
  const deactiveUsers = users.filter((user) => user.status === 0).length;

  const employmentTypeCounts: Record<string, number> = users.reduce((acc, user) => {
    const type = user.employment_type || "Unknown";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);


  const filteredDirectorates =
    queryDirectorate === ""
      ? directorateOptions
      : directorateOptions.filter((dir) =>
        dir.name.toLowerCase().includes(queryDirectorate.toLowerCase())
      );

  const deputyMinistryCounts: Record<string, number> = users.reduce((acc, user) => {
    const ministry = user.deputy || "Unknown";
    acc[ministry] = (acc[ministry] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);


  const filteredDeputyMinistriesEdit =
    queryDeputyMinistryEdit === ""
      ? deputyMinistryOptions.filter(dm => dm.id >= 1 && dm.id <= 5)
      : deputyMinistryOptions
        .filter(dm => dm.id >= 1 && dm.id <= 5)
        .filter((dm) =>
          dm.name.toLowerCase().includes(queryDeputyMinistryEdit.toLowerCase())
        );


  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get<InternetUser[]>(`${route}/internet`);
        console.log("API Response:", response.data); // Add this line
        setUsers(response.data);
      } catch (err) {
        setError("Failed to fetch users. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();

    async function fetchFilters() {
      try {
        const [depRes, dirRes, empTypeRes] = await Promise.all([
          axios.get(`${route}/directorate`),
          axios.get(`${route}/directorate`),
          axios.get(`${route}/employment-type`),
        ]);


        setDeputyMinistryOptions(depRes.data); // Already array of { id, name }
        setDirectorateOptions(dirRes.data);
        setEmploymentTypes(empTypeRes.data);
      } catch (err) {
        console.log("error fetching data!", err);
      }
    }
    fetchFilters();
  }, []);


  const handleEdit = (user: InternetUser) => {
    setSelectedUser(user);
    setEditForm({
      ...user,
      status: user.status || "active",
      violations_count: user.violations_count || "0",
      comment: user.comment || "No comment"
    });

    // Preselect directorate object
    const matchingDepMinistry = deputyMinistryOptions.find((d) => d.name === user.deputy);
    setSelectedDeputyMinistryEdit(matchingDepMinistry || null);
    setIsEditOpen(true);

  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!selectedUser) return;
    try {
      const response = await axios.put(
        `${route}/internet/${selectedUser.id}`,
        editForm
      );
      setUsers((prev) =>
        prev.map((u) => (u.id === selectedUser.id ? response.data : u))
      );
      setIsEditOpen(false);
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update user.");
    }
  };

  const handleDelete = async (id: string) => {
    const token = JSON.parse(localStorage.getItem("loggedInUser") || "{}").token;
    const confirm = window.confirm("Are you sure you want to delete this user?");
    if (!confirm) return;

    try {
      await axios.delete(`${route}/internet/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      alert("Failed to delete user.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex bg-white 
    shadow-md shadow-indigo-700">
      <div className="fixed top-0 left-0 bottom-0 w-64 border-r 
      border-gray-200 bg-white shadow-sm z-20">
        <GradientSidebar />
      </div>
      <main className="flex-1 ml-64 p-8 overflow-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 🔵 Total Users */}
          <div className="relative overflow-hidden rounded-md p-6 shadow-sm bg-white 
        border border-blue-100 group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <User className="w-6 h-6 text-blue-400" />
                <span className="text-blue-400 text-sm">Total Users</span>
              </div>
              <div className="text-blue-400 text-xs uppercase tracking-wider">Summary</div>
            </div>
            <div className="text-4xl font-bold text-blue-400 text-center mt-10">{totalUsers}</div>
          </div>
          {/* 🟦 Active / Deactive */}
          <div className="relative overflow-hidden rounded-md p-6 shadow-sm bg-white border border-blue-100 group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-blue-400" />
                <span className="text-blue-400 font-semibold text-sm">Active / Deactive</span>
              </div>
              <div className="text-blue-400 text-xs uppercase tracking-wider">Status</div>
            </div>
            <div className="space-y-1 text-blue-400">
              <div className="flex justify-between text-sm">
                <span>Active</span>
                <span className="font-bold">{activeUsers}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Deactive</span>
                <span className="font-bold">{deactiveUsers}</span>
              </div>
            </div>
          </div>
          {/* 👔 Employment Type */}
          <div className="relative overflow-hidden rounded-md p-6 shadow-sm bg-white border border-blue-100 group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Briefcase className="w-6 h-6 text-blue-400" />
                <span className="text-blue-400 font-semibold text-sm">Employment Types</span>
              </div>
              <div className="text-blue-400 text-xs uppercase tracking-wider">Type</div>
            </div>
            <ul className="space-y-1 text-sm text-blue-400 max-h-32 overflow-auto pr-1">
              {Object.entries(employmentTypeCounts).map(([type, count]) => (
                <li key={type} className="flex justify-between">
                  <span>{type}</span>
                  <span className="font-bold">{count}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* 🏛️ Deputy Ministry */}
          <div className="relative overflow-hidden rounded-md p-6 shadow-sm bg-white border border-blue-100 group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Building2 className="w-6 h-6 text-blue-400" />
                <span className="text-blue-400 font-semibold text-sm">Deputy Ministries</span>
              </div>
              <div className="text-blue-400 text-xs uppercase tracking-wider">Groups</div>
            </div>
            <ul className="space-y-1 text-sm text-blue-400 max-h-32 overflow-auto pr-1 text-[10px]">
              {Object.entries(deputyMinistryCounts).map(([name, count]) => (
                <li key={name} className="flex justify-between">
                  <span>{name}</span>
                  <span className="font-bold">{count}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex gap-4 mb-4 mt-5 justify-center items-center">
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
          <div className="relative w-full sm:w-[900px] mt-5">
            <input
              id="searchInput"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users..."
              className="w-100 px-4 py-2 pl-10 rounded-sm shadow-sm border border-blue-200 
                    focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm 
                    placeholder:text-blue-300 text-gray-700 
                    bg-white"
              autoComplete="on"
              autoCorrect="on"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-4 h-4" />
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
            <div className="overflow-x-auto rounded-sm shadow-lg bg-white border border-white max-w-full">
              <div className="mt-2">
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
                >
                  {expanded ? "Compress" : "Expand"}
                </button>
              </div>
              <table className="table-auto w-full text-left text-sm">
                {/* Table Head */}
                <thead>
                  <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs uppercase 
              tracking-wider select-none rounded-t-xl">
                    {fixedHeaders.map((header) => (
                      <th
                        key={header}
                        className="px-3 py-2 border-r bg-blue-300 text-[10px] font-semibold"
                        style={{ textShadow: "0 1px 1px rgba(0,0,0,0.15)" }}
                      >
                        {header}
                      </th>

                    ))}

                    {expanded && (
                      <>
                        {headers.map((header) => (
                          <th
                            key={header}
                            className="px-3 py-2 border-r last:border-r-0 bg-blue-300 text-[10px] font-semibold"
                            style={{ textShadow: "0 1px 1px rgba(0,0,0,0.15)" }}
                          >
                            {header}
                          </th>
                        ))}
                      </>
                    )}
                  </tr>
                </thead>

                {/* Table Body */}

                <tbody>
                  {users
                    .filter((user) =>
                      (selectedDeputyMinistry === "" || user.deputy === selectedDeputyMinistry) &&
                      (selectedDirectorate === "" || user.directorate === selectedDirectorate) &&
                      (selectedStatus === "" || (selectedStatus === "active" && user.status === 1) || (selectedStatus === "deactive" && user.status === 0)) &&
                      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
                      user.employment_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      user.device_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      (user.violation_type && user.violation_type.toLowerCase().includes(searchTerm.toLowerCase())) ||
                      String(user.violations_count).toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((user, idx) => {
                      const isRedCard = user.violations_count === "2";
                      const isYellowCard = user.violations_count === "1";

                      return (
                        <tr
                          key={user.id}
                          className={`transition-colors duration-200 ${isRedCard
                            ? "bg-red-100"
                            : idx % 2 === 0
                              ? "bg-gray-100"
                              : "bg-white"
                            } hover:bg-blue-100`}
                        >
                          {/* Name */}
                          <td className="px-3 py-2 text-gray-700 text-[10px] whitespace-nowrap 
                      flex items-center gap-1 font-medium">
                            {user.name}
                            {isYellowCard && <span className="ml-1">🟨</span>}
                            {isRedCard && <span className="ml-1">🟥</span>}
                          </td>

                          {/* Username */}
                          <td className="px-3 py-2 text-gray-700 text-[10px]">{user.username}</td>

                          {/* Last Name */}
                          <td className="px-3 py-2 text-gray-700 text-[10px]">{user.lastname}</td>

                          {/* email */}
                          <td className="px-3 py-2 text-gray-700 text-[10px]">{user.email}</td>
                          {expanded && (
                            <>
                              {/* Phone */}
                              <td className="px-3 py-2 text-gray-700 text-[10px]">{user.phone}</td>

                              <td className="px-3 py-2 text-gray-700 text-[10px]">{user.employment_type || "-"}</td>

                              {/* Directorate */}
                              <td className="px-3 py-2 text-gray-700 text-[8px]">{user.directorate}</td>

                              {/* Deputy Ministry */}
                              <td className="px-3 py-2  text-gray-700 text-[9px]">{user.deputy}</td>

                              <td className="px-3 py-2 text-gray-700 text-[8px]">{user.position}</td>

                              <td className="px-3 py-2 text-gray-700 text-[8px]">{user.device_limit}</td>

                              <td className="px-3 py-2 text-gray-700 text-[8px]">{user.device_type}</td>

                              <td className="px-3 py-2 text-gray-700 text-[8px]">{user.groups}</td>

                              <td className="px-3 py-2 text-gray-700 text-[8px]">{user.mac_address}</td>

                              {/* Status */}
                              <td className="px-3 py-2 text-gray-700 text-[10px]">
                                {user.status === 1 ? "active" : user.status === 0 ? "deactive" : "-"}
                              </td>

                              {/* Violations */}
                              <td className="px-3 py-2 text-gray-700 text-[10px]">{user.violations_count}</td>

                              {/* Violation type */}
                              <td className="px-3 py-2 text-gray-700 text-[10px]">{user.violation_type}</td>

                              {/* Comment */}
                              <td className="px-3 py-2 text-gray-700 text-[10px] truncate max-w-[120px]">
                                {user.comment || "-"}
                              </td>


                            </>
                          )}

                          {/* Actions */}
                          <td className="px-3 py-2 text-blue-400 text-center">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleEdit(user)}
                                className="hover:text-blue-100"
                                title="Edit"
                              >
                                <Edit className="w-5 h-5 hover:text-blue-300" />
                              </button>
                              <button
                                onClick={() => handleDelete(user.id)}
                                className="hover:text-blue-100"
                                title="Delete"
                              >
                                <Trash className="w-5 h-5 hover:text-blue-300" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Edit Modal */}
      {isEditOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl border border-gray-200 flex flex-col lg:flex-row">

            {/* Left - Preview */}
            <div className="lg:w-1/2 w-full bg-gradient-to-br from-blue-100 to-blue-200 p-8 flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-blue-800 mb-2">Edit User</h2>
              <p className="text-sm text-blue-700 mb-4">Make changes to this user's profile.</p>
              <ul className="space-y-2 text-sm text-blue-900 overflow-auto max-h-[80vh] pr-2">
                {Object.entries(selectedUser).map(([key, value]) => (
                  <li key={key}>
                    <strong className="capitalize">{key.replace("_", " ")}:</strong> {value || "-"}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right - Form */}
            <div className="lg:w-1/2 w-full p-8 bg-white overflow-y-auto max-h-[90vh]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.keys(editForm).map((key) =>
                  key !== "status" && key !== "violations" && key !== "comment" && key !== "employment_type"
                    && key !== "directorate" && key !== "deputyMinistry" && key !== "count" && key !== "id" ? (
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

                {/* directorate type */}

                <div className="">
                  <label className="block text-sm font-medium text-gray-700">Directorate</label>
                  <Combobox
                    value={selectedDirectorateEdit}
                    onChange={(value) => {
                      setSelectedDirectorateEdit(value);
                      setEditForm((prev) => ({ ...prev, directorate: value?.name || "" }));
                    }}
                  >
                    <div className="relative mt-1">
                      <Combobox.Input
                        className="w-full border border-gray-300 rounded-md py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        displayValue={(dir: { name: string }) => dir?.name || ""}
                        onChange={(e) => setQueryDirectorate(e.target.value)}
                        placeholder="🔍 Search..."
                      />
                      <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg border border-gray-200 z-50">
                        {filteredDirectorates.length === 0 ? (
                          <div className="px-4 py-2 text-gray-500">No results found.</div>
                        ) : (
                          filteredDirectorates.map((dir) => (
                            <Combobox.Option
                              key={dir.id}
                              value={dir}
                              className={({ active }) =>
                                `cursor-pointer select-none px-4 py-2 ${active ? "bg-blue-500 text-white" : "text-gray-800"
                                }`
                              }
                            >
                              {dir.name}
                            </Combobox.Option>
                          ))
                        )}
                      </Combobox.Options>
                    </div>
                  </Combobox>
                </div>

                {/* deputy ministry  */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Deputy Ministry</label>
                  <Combobox
                    value={selectedDeputyMinistryEdit}
                    onChange={(value) => {
                      setSelectedDeputyMinistryEdit(value);
                      setEditForm((prev) => ({ ...prev, deputyMinistry: value?.name || "" }));
                    }}
                  >
                    <div className="relative mt-1">
                      <Combobox.Input
                        className="w-full border border-gray-300 rounded-md py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        displayValue={(dm: { name: string }) => dm?.name || ""}
                        onChange={(e) => setQueryDeputyMinistryEdit(e.target.value)}
                        placeholder="🔍 Search..."
                      />
                      <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg border border-gray-200 z-50">
                        {filteredDeputyMinistriesEdit.length === 0 ? (
                          <div className="px-4 py-2 text-gray-500">No results found.</div>
                        ) : (
                          filteredDeputyMinistriesEdit.map((dm) => (
                            <Combobox.Option
                              key={dm.id}
                              value={dm}
                              className={({ active }) =>
                                `cursor-pointer select-none px-4 py-2 ${active ? "bg-blue-500 text-white" : "text-gray-800"
                                }`
                              }
                            >
                              {dm.name}
                            </Combobox.Option>
                          ))
                        )}
                      </Combobox.Options>
                    </div>
                  </Combobox>
                </div>

                {/* Employment Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Employment Type</label>
                  <select
                    name="employment_type"
                    value={editForm.employment_type || ""}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none 
                  focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">Select Employment Type</option>
                    {employmentTypes.map((type) => (
                      <option key={type.id} value={type.name}>
                        {type.name}
                      </option>
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
                  <label className="block text-sm font-medium text-gray-700">Device Type</label>
                  <select
                    name="device_type"
                    value={editForm.device_type}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none 
                  focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">Select Device Type</option>
                    {employmentTypes.map((type) => (
                      <option key={type.id} value={type.name}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    name="status"
                    value={editForm.status || "active"}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none 
              focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="active">Active</option>
                    <option value="deactive">Deactive</option>
                  </select>
                </div>

                {/* Violations */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Violations</label>
                  <select
                    name="violations"
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