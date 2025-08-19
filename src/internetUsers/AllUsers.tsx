import { useEffect, useMemo, useState, type JSX } from "react";
import axios from "axios";
import GradientSidebar from "../components/Sidebar";
import type { InternetUser, ViolationType } from "../types/types";
import { route } from "../config";
import ScrollToTopButton from "../components/scrollToTop";
import UserRow from "../components/userRow";
import UserFiltersPanel from "../components/UserFilters";
import EditUserModal from "./editModal";

const headers = [
  "Name", "Last Name", "Username", "Directorate", "Position", "Group Type",
  "Status", "Actions"
];


export default function InternetUsersList(): JSX.Element {
  const [users, setUsers] = useState<InternetUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<InternetUser | null>(null);
  const [editForm, setEditForm] = useState<Partial<InternetUser>>({});
  const [selectedDeputyMinistry, setSelectedDeputyMinistry] = useState<string>("");
  const [selectedDirectorate, setSelectedDirectorate] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewUser, setViewUser] = useState<InternetUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [directorateOptions, setDirectorateOptions] = useState<{ id: number; name: string }[]>([]);
  const [deputyMinistryOptions, setDeputyMinistryOptions] = useState<{ id: number; name: string }[]>([]);
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
      } catch {
        setError("Failed to fetch users. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);


  useEffect(() => {
    async function fetchDirectorates() {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${route}/directorate`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDirectorateOptions(response.data);
      } catch {
        setError("Failed to fetch directorates. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    async function fetchDeputyMinistries() {
      try {
        const response = await axios.get(`${route}/directorate`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDeputyMinistryOptions(response.data);
      } catch (err) {
        console.error("Error in fetching Deputy Ministries:", err);
      }
    }

    fetchDirectorates();
    fetchDeputyMinistries();
  }, []);





  const handleView = (user: InternetUser) => {
    setViewUser(user);
    setIsViewOpen(true);
  };

  const handleEditClick = (user: InternetUser) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleUserSave = (updatedUser: Partial<InternetUser>) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === updatedUser.id ? { ...u, ...updatedUser } : u
      )
    );
  };

  const handleEdit = (user: InternetUser) => {
    setSelectedUser(user);
    setEditForm({
      id: user.id,
      name: user.name,
      lastname: user.lastname,
      username: user.username,
      directorate_id: user.directorate_id,
      group_id: user.group_id,
      violation_type_id: user.violation_type_id,
      employee_type_id: user.employee_type_id,
      device_type_id: user.device_type_id,
      violations_count: user.violations_count,
      device_limit: user.device_limit,
    });
    setIsModalOpen(true);
  };



  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

 const handleUpdate = async () => {
  if (!selectedUser) return;

  const payload = {
    id: editForm.id,
    name: editForm.name,
    lastname: editForm.lastname,
    username: editForm.username,
    directorate_id: Number(editForm.directorate_id),
    group_id: Number(editForm.group_id),
    violation_type_id: Number(editForm.violation_type_id),
    employee_type_id: Number(editForm.employee_type_id),
    device_type_id: Number(editForm.device_type_id),
    violations_count: Number(editForm.violations_count),
    device_limit: Number(editForm.device_limit),
  };

  try {
    await axios.put(`${route}/internet/${selectedUser.id}`, payload);

    const res = await axios.get(`${route}/internet`);
    setUsers(res.data);

    setIsModalOpen(false);
  } catch (error) {
    console.error(error);
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
    let result = [];
    let count = 0;
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      if (
        (selectedDeputyMinistry === "" || user.deputy === selectedDeputyMinistry) &&
        (selectedDirectorate === "" || String(user.directorate_id) === selectedDirectorate) &&
        (selectedStatus === "" ||
          (selectedStatus === "active" && user.status === 1) ||
          (selectedStatus === "deactive" && user.status === 0)) &&
        (user.name.toLowerCase().includes(search) ||
          user.username.toLowerCase().includes(search) ||
          user.lastname.toLowerCase().includes(search))
      ) {
        result.push(user);
        count++;
      }
      if (count >= 30) break;
    }
    return result;
  }, [users, selectedDeputyMinistry, selectedDirectorate, selectedStatus, searchTerm]);

  const usersPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const visibleUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);



  return (
    <div className="min-h-screen flex bg-white shadow-md shadow-indigo-700">
      <ScrollToTopButton />
      <div className="fixed top-0 left-0 bottom-0 w-64 border-r 
      border-gray-200 bg-white shadow-sm z-20">
        <GradientSidebar />
      </div>
      <main className="flex-1 ml-64 p-8 overflow-auto">

        <div className="flex mb-4 mt-5 justify-center w-full">
          <UserFiltersPanel
            deputyMinistryOptions={deputyMinistryOptions}
            directorateOptions={directorateOptions}
            selectedDeputyMinistry={selectedDeputyMinistry}
            setSelectedDeputyMinistry={setSelectedDeputyMinistry}
            selectedDirectorate={selectedDirectorate}
            setSelectedDirectorate={setSelectedDirectorate}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
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
                        className="px-3 py-2 border-r border-white last:border-r-0 bg-gray-100 
                        text-blue-400 text-[8px] font-semibold"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Table Body */}

                <tbody>
                  {visibleUsers.map((user, idx) => (
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
        <div className="mt-4 flex gap-2 justify-center">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded-full border ${currentPage === i + 1
                ? "bg-blue-300 text-white border-blue-500"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

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
      {isModalOpen && selectedUser && (
        <EditUserModal
          user={selectedUser as InternetUser}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleUserSave}
          violationTypes={violationTypes}   // ای لست ره باید در پدر فیچ کنی
          deputyMinistryOptions={[]}        // اگر داشتی پاس بتی، اگر نداشتی خالی بده
        />


      )}


    </div>
  );
}