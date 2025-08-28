import { useEffect, useMemo, useState, type JSX } from "react";
import axios from "axios";
import GradientSidebar from "../components/Sidebar";
import type { InternetUser } from "../types/types";
import { route } from "../config";
import ScrollToTopButton from "../components/scrollToTop";
import UserRow from "../components/userRow";
import UserFiltersPanel from "../components/UserFilters";
import EditUserModal from "./editModal";
import { motion } from "framer-motion";
import { Users, AlertCircle } from "lucide-react";

type Option = { id: number; name: string };


export default function InternetUsersList(): JSX.Element {
    const [users, setUsers] = useState<InternetUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<InternetUser | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [directorateOptions, setDirectorateOptions] = useState<Option[]>([]);
    const [deputyMinistryOptions, setDeputyMinistryOptions] = useState<Option[]>([]);

    const [selectedDirectorate, setSelectedDirectorate] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [groupOptions, setGroupOptions] = useState<Option[]>([]);
    const [selectedGroup, setSelectedGroup] = useState("");


    const currentUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
    const token = currentUser?.token;
    const isViewer = currentUser?.user.role === "viewer";

    const headers = ["Name", "LastName", "Username", "Directorate", "Position", "Group Type", "Status", "Actions"];


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

    // Fetch directorates and groups
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [dirRes, groupRes] = await Promise.all([
                    axios.get(`${route}/directorate`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${route}/groups`, { headers: { Authorization: `Bearer ${token}` } })
                ]);
                const dirData: any[] = dirRes.data;
                const groupData: any[] = groupRes.data;
                setDirectorateOptions(dirData.map(d => ({ id: d.id, name: d.name })));
                setDeputyMinistryOptions(dirData.map(d => ({ id: d.id, name: d.name }))); // restore
                setGroupOptions(groupData.map(g => ({ id: g.id, name: g.name })));
            } catch (err) {
                console.error(err);
            }
        };
        fetchOptions();
    }, [token]);

    // Save updated user from Modal
    const handleUserSave = async () => {
        try {
            // Refetch the users data to get the latest information
            const res = await axios.get<InternetUser[]>(`${route}/internet`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);
        } catch (err) {
            console.error("Failed to refresh user data after update:", err);
        }
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
        return users.filter(u => {
            const directorateMatch = selectedDirectorate === "" || String(u.directorate) === selectedDirectorate;
            const groupMatch = selectedGroup === "" || String(u.groups) === selectedGroup;
            const statusMatch = selectedStatus === "" || (selectedStatus === "active" && u.status === 1) || (selectedStatus === "deactive" && u.status === 0);
            const searchMatch = u.name.toLowerCase().includes(search) || u.lastname.toLowerCase().includes(search) || u.username.toLowerCase().includes(search);
            return directorateMatch && groupMatch && statusMatch && searchMatch;
        });
    }, [users, selectedDirectorate, selectedGroup, selectedStatus, searchTerm]);

    const usersPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const visibleUsers = filteredUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    return (
        <div className="min-h-screen flex bg-white">
            <ScrollToTopButton />
            <div className="fixed top-0 left-0 bottom-0 w-64 border-r border-slate-200 bg-white shadow-lg z-20">
                <GradientSidebar />
            </div>
            <main className="flex-1 ml-64 p-8 overflow-auto">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-gradient-to-r from-slate-800 to-slate-600 rounded-md shadow-lg">
                            <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                                Internet Users
                            </h1>
                            <p className="text-slate-600 mt-1 font-medium">
                                Manage and monitor all internet users
                            </p>
                        </div>
                    </div>

                    {/* Filters Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className=""
                    >
                        <div className="bg-gray-100 rounded-sm p-0">
                            <UserFiltersPanel
                                directorateOptions={directorateOptions}
                                groupOptions={groupOptions}
                                selectedDirectorate={selectedDirectorate}
                                setSelectedDirectorate={setSelectedDirectorate}
                                selectedGroup={selectedGroup}
                                setSelectedGroup={setSelectedGroup}
                                selectedStatus={selectedStatus}
                                setSelectedStatus={setSelectedStatus}
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                            />
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-slate-800 to-slate-700">
                                            {headers.map((h, index) => (
                                                <motion.th
                                                    key={h}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                                                    className="px-6 py-4 text-left text-sm font-semibold text-white border-b border-slate-700"
                                                >
                                                    {h}
                                                </motion.th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {visibleUsers.map((user, index) => (
                                            <motion.tr
                                                key={user.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                                                className="border-b border-slate-100 hover:bg-slate-50 transition-colors duration-200"
                                            >
                                                <UserRow
                                                    user={user}
                                                    idx={index}
                                                    handleEdit={handleEditClick}
                                                    handleDelete={handleDelete}
                                                    handleView={() => { }}
                                                    isViewer={isViewer}
                                                    currentUserRole={currentUser?.user.role}
                                                />
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Content Section */}
                {loading ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-center items-center py-20"
                    >
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-slate-600 text-lg font-medium">Loading users...</p>
                        </div>
                    </motion.div>
                ) : error ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20"
                    >
                        <div className="p-6 bg-red-50 rounded-2xl border border-red-200 max-w-full mx-auto">
                            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Data</h3>
                            <p className="text-red-600">{error}</p>
                        </div>
                    </motion.div>
                ) : users.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20"
                    >
                        <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200 max-w-md mx-auto">
                            <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-slate-900 mb-2">No Users Found</h3>
                            <p className="text-slate-600">There are no internet users to display at the moment.</p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                        className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
                    >

                    </motion.div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9, duration: 0.6 }}
                        className="mt-4 flex justify-center"
                    >
                        <div className="flex gap-2">
                            {Array.from({ length: totalPages }, (_, i) => (
                                <motion.button
                                    key={i + 1}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${currentPage === i + 1
                                        ? "bg-gradient-to-r from-slate-800 to-slate-500 text-white shadow-lg"
                                        : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                                        }`}
                                >
                                    {i + 1}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </main>

            {isModalOpen && selectedUser && (
                <EditUserModal
                    user={selectedUser}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleUserSave}
                    deputyMinistryOptions={deputyMinistryOptions}
                />
            )}
        </div>
    );
}

