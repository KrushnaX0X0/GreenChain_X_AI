import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Logout = ({ setActiveSection }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        toast.success("Logged out successfully");
        navigate("/");
    };

    const handleCancel = () => {
        setActiveSection("overview");
    };

    return (
        <div className="flex h-full items-center justify-center p-6">
            <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-10 shadow-xl ring-1 ring-gray-900/5 sm:p-12">
                <div className="absolute top-0 right-0 p-4">
                    <button
                        onClick={handleCancel}
                        className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex flex-col items-center text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 mb-6">
                        <LogOut className="h-10 w-10 text-red-600" />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirm Logout</h2>
                    <p className="text-gray-500 mb-8">
                        Are you sure you want to log out of the admin dashboard?
                    </p>

                    <div className="flex w-full gap-4">
                        <button
                            onClick={handleCancel}
                            className="flex-1 rounded-xl bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 transition-colors"
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Logout;
