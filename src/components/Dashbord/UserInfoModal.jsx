import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { X, User, Phone, MapPin, Mail, Shield } from 'lucide-react';
import { toast } from 'react-hot-toast';

const UserInfoModal = ({ userId, onClose }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;
        fetchUserDetails();
    }, [userId]);

    const fetchUserDetails = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(res.data);
        } catch (error) {
            console.error("Error fetching user details:", error);
            if (error.response?.status === 401) {
                toast.error("Session expired or unauthorized. Please relogin.");
            } else {
                toast.error("Failed to fetch user details");
            }
            onClose();
        } finally {
            setLoading(false);
        }
    };

    if (!userId) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-green-50/50">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <User className="text-green-600" /> User Details
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200/50 rounded-full transition-colors text-gray-500 hover:text-red-500"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8">
                    {loading ? (
                        <div className="flex flex-col items-center py-10 text-gray-400 gap-3">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                            <p className="text-sm font-medium">Loading User Info...</p>
                        </div>
                    ) : user ? (
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center text-2xl font-bold text-green-700 uppercase">
                                    {user.email?.charAt(0) || "U"}
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900">{user.username || "No Name"}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        {user.roles && user.roles.map(role => (
                                            <span key={role.id} className="text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                <Shield size={10} /> {role.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-4 mt-6">
                                <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-4 hover:bg-green-50/30 transition-colors border border-transparent hover:border-green-100">
                                    <div className="p-2 bg-white rounded-lg text-blue-500 shadow-sm">
                                        <Mail size={18} />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Email Address</label>
                                        <p className="text-sm font-semibold text-gray-800 break-all">{user.email}</p>
                                    </div>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-4 hover:bg-green-50/30 transition-colors border border-transparent hover:border-green-100">
                                    <div className="p-2 bg-white rounded-lg text-purple-500 shadow-sm">
                                        <Phone size={18} />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Phone Number</label>
                                        <p className="text-sm font-semibold text-gray-800">{user.mobile || "Not Provided"}</p>
                                    </div>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-4 hover:bg-green-50/30 transition-colors border border-transparent hover:border-green-100">
                                    <div className="p-2 bg-white rounded-lg text-orange-500 shadow-sm">
                                        <MapPin size={18} />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Address</label>
                                        <p className="text-sm font-semibold text-gray-800">{user.address || "Not Provided"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-red-500 py-10 font-medium">
                            User info not available
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserInfoModal;
