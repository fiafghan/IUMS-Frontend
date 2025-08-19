import { useEffect, useMemo, useState, type JSX } from "react";
import axios from "axios";
import GradientSidebar from "../components/Sidebar";
import type { InternetUser, ViolationType } from "../types/types";
import { route } from "../config";
import ScrollToTopButton from "../components/scrollToTop";
import UserRow from "../components/userRow";
import UserFiltersPanel from "../components/UserFilters";
import EditUserModal from "./editModal";

type Option = { id: number; name: string };

const headers = ["Name", "Last Name", "Username", "Directorate", "Position", "Group Type", "Status", "Actions"];

export default function InternetUsersList(): JSX.Element {
    const [users, setUsers] = useState<InternetUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<InternetUser | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [directorateOptions, setDirectorateOptions] = useState<Option[]>([]);
    const [deputyMinistryOptions, setDeputyMinistryOptions] = useState<Option[]>([]);

    const [selectedDeputyMinistry, setSelectedDeputyMinistry] = useState("");
    const [selectedDirectorate, setSelectedDirectorate] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const [violationTypes, setViolationTypes] = useState<ViolationType[]>([]);

    const currentUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
    const token = currentUser?.token;
    const isViewer = currentUser?.user.role === "viewer";

    // Fetch users
    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await axios.get<InternetUser[]>(`${route}/internet`, { headers: { Authorization: `Bearer ${token}` } });
                setUsers(res.data);
            } catch {
                setError("Failed to fetch users.");
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [token]);

    // Fetch directorates and deputy ministries
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const res = await axios.get(`${route}/directorate`, { headers: { Authorization: `Bearer ${token}` } });
                const data: any[] = res.data;
                setDirectorateOptions(data.map(d => ({ id: d.id, name: d.name })));
                setDeputyMinistryOptions(data.map(d => ({ id: d.id, name: d.name })));
            } catch (err) {
                console.error(err);
            }
        };
        fetchOptions();
    }, [token]);

    useEffect(() => { // add
        const fetchViolationTypes = async () => {
            try {
                const res = await axios.get(`${route}/violation`, { headers: { Authorization: `Bearer ${token}` } });
                setViolationTypes(res.data.data || []); // controller returns { message, data: [...] }
            } catch (err) {
                console.error("Failed to fetch violation types:", err);
            }
        };
        fetchViolationTypes();
    }, [token]);

    // Save updated user from Modal
    const handleUserSave = (updatedUser: Partial<InternetUser>) => {
        setUsers(prev => prev.map(u => (u.id === updatedUser.id ? { ...u, ...updatedUser } : u)));
    };

    const handleEditClick = (user: InternetUser) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await axios.delete(`${route}/internet/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            setUsers(prev => prev.filter(u => u.id !== id));
        } catch (err) {
            alert("Failed to delete user.");
        }
    };

    const filteredUsers = useMemo(() => {
        const search = searchTerm.toLowerCase();
        return users.filter(u =>
            (selectedDeputyMinistry === "" || u.deputy === selectedDeputyMinistry) &&
            (selectedDirectorate === "" || String(u.directorate_id) === selectedDirectorate) &&
            (selectedStatus === "" || (selectedStatus === "active" && u.status === 1) || (selectedStatus === "deactive" && u.status === 0)) &&
            (u.name.toLowerCase().includes(search) || u.lastname.toLowerCase().includes(search) || u.username.toLowerCase().includes(search))
        );
    }, [users, selectedDeputyMinistry, selectedDirectorate, selectedStatus, searchTerm]);

    const usersPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const visibleUsers = filteredUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    return (
        <div className="min-h-screen flex bg-white shadow-md shadow-indigo-700">
            <ScrollToTopButton />
            <div className="fixed top-0 left-0 bottom-0 w-64 border-r border-gray-200 bg-white shadow-sm z-20">
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
                    <div className="overflow-x-auto rounded-sm shadow-lg bg-white border border-gray-200 max-w-full">
                        <table className="table-auto w-full text-left text-sm">
                            <thead>
                                <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs uppercase tracking-wider select-none rounded-t-xl">
                                    {headers.map(h => (
                                        <th key={h} className="px-3 py-2 border-r border-white last:border-r-0 bg-gray-100 text-blue-400 text-[8px] font-semibold">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {visibleUsers.map((user, idx) => (
                                    <UserRow
                                        key={user.id}
                                        user={user}
                                        idx={idx}
                                        handleEdit={handleEditClick}
                                        handleDelete={handleDelete}
                                        isViewer={isViewer}
                                        currentUserRole={currentUser?.user.role}
                                        handleView={() => { }} // Optional: Add view logic
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="mt-4 flex gap-2 justify-center">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={`px-3 py-1 rounded-full border ${currentPage === i + 1 ? "bg-blue-300 text-white border-blue-500" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"}`}>
                            {i + 1}
                        </button>
                    ))}
                </div>
            </main>

            {isModalOpen && selectedUser && (
                <EditUserModal
                    user={selectedUser}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleUserSave}
                    violationTypes={violationTypes}
                    deputyMinistryOptions={deputyMinistryOptions}
                />
            )}
        </div>
    );
}
