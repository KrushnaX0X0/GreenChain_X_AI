import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, Shield, User } from 'lucide-react';
import toast from 'react-hot-toast';

const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const res = await axios.get("http://localhost:8080/api/users", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);
        } catch (error) {
            console.error(error);
            if (error.response?.status === 401) {
                toast.error("Session expired");
                // Optional: Auto-logout could go here
            } else {
                toast.error("Failed to load users");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to remove this user? This action cannot be undone.")) return;

        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:8080/api/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(prev => prev.filter(u => u.id !== id));
            toast.success("User removed successfully");
        } catch (error) {
            toast.error("Failed to delete user");
        }
    };

    if (loading) return <div className="p-10 text-center text-gray-500">Loading Users...</div>;

    return (
        <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-xl shadow-gray-100/50">
            <h2 className="text-2xl font-black text-gray-900 mb-6">User Registry</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-100 text-[10px] uppercase font-black text-gray-400 tracking-widest">
                            <th className="pb-4">User Identity</th>
                            <th className="pb-4">Role</th>
                            <th className="pb-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {users.map(user => (
                            <tr key={user.id} className="group hover:bg-gray-50/50 transition-colors">
                                <td className="py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                                            <User size={18} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 text-sm">{user.name}</p>
                                            <p className="text-xs text-gray-400 font-medium">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4">
                                    {user.roles?.some(r => r.name === "ROLE_ADMIN") ? (
                                        <span className="flex items-center gap-1 w-fit px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-[10px] font-black uppercase tracking-wider">
                                            <Shield size={12} /> Admin
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                                            User
                                        </span>
                                    )}
                                </td>
                                <td className="py-4 text-right">
                                    {!user.roles?.some(r => r.name === "ROLE_ADMIN") && (
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                            title="Delete User"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserTable;
