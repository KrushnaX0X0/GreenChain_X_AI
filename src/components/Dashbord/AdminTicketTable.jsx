import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MessageSquare, AlertCircle, CheckCircle, Clock, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import UserInfoModal from './UserInfoModal';
import TicketResponseModal from './TicketResponseModal';

const AdminTicketTable = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/support/tickets/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTickets(res.data);
        } catch (error) {
            console.error(error);
            if (error.response?.status === 401) {
                toast.error("Session expired. Please login again.");

            } else {
                toast.error("Failed to load tickets");
            }
        } finally {
            setLoading(false);
        }
    };

    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedTicket, setSelectedTicket] = useState(null);

    const updateStatus = async (id, newStatus) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/api/support/tickets/${id}/status`, null, {
                params: { status: newStatus },
                headers: { Authorization: `Bearer ${token}` }
            });
            setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
            toast.success("Ticket status updated");
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const deleteTicket = async (id) => {
        if (!window.confirm("Are you sure you want to delete this ticket?")) return;
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/support/tickets/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTickets(prev => prev.filter(t => t.id !== id));
            toast.success("Ticket deleted successfully");
        } catch (error) {
            toast.error("Failed to delete ticket");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'OPEN': return 'bg-blue-100 text-blue-700';
            case 'IN_REVIEW': return 'bg-yellow-100 text-yellow-700';
            case 'CLOSED': return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    if (loading) return <div className="p-10 text-center text-gray-500">Loading Tickets...</div>;

    return (
        <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-xl shadow-gray-100/50">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Support Console</h2>
            <div className="grid gap-4">
                {tickets.map(ticket => (
                    <div key={ticket.id} className="p-6 rounded-[24px] border border-gray-100 hover:border-green-200 transition-all bg-gray-50/30">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-white rounded-xl shadow-sm text-green-600">
                                    <MessageSquare size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">#{ticket.id} • {ticket.ticketType}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="text-xs text-gray-500">by {ticket.user?.email || "Unknown User"}</p>
                                        {ticket.user && (
                                            <button
                                                onClick={() => setSelectedUserId(ticket.user.id)}
                                                className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full hover:bg-blue-100 transition-colors font-medium flex items-center gap-1"
                                                title="View User Details"
                                            >
                                                Info
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <select
                                    value={ticket.status}
                                    onChange={(e) => updateStatus(ticket.id, e.target.value)}
                                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer border-none ${getStatusColor(ticket.status)}`}
                                >
                                    <option value="OPEN">Open</option>
                                    <option value="IN_REVIEW">In Review</option>
                                    <option value="CLOSED">Closed</option>
                                </select>
                                <button
                                    onClick={() => deleteTicket(ticket.id)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                    title="Delete Ticket"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed mb-4 pl-14">
                            {ticket.description}
                        </p>

                        {ticket.adminResponse && (
                            <div className="ml-14 mb-4 p-3 bg-green-50 border border-green-100 rounded-xl">
                                <p className="text-xs font-bold text-green-700 uppercase mb-1">Admin Response</p>
                                <p className="text-sm text-gray-700">{ticket.adminResponse}</p>
                            </div>
                        )}

                        <div className="pl-14 flex items-center justify-between">
                            {ticket.order && (
                                <div className="text-xs font-mono text-gray-400">
                                    Ref: Order #{ticket.order.id}
                                </div>
                            )}
                            <button
                                onClick={() => setSelectedTicket(ticket)}
                                className="text-xs bg-green-50 text-green-600 px-3 py-1 rounded-full hover:bg-green-100 transition-colors font-medium"
                            >
                                Reply
                            </button>
                        </div>
                    </div>
                ))}
                {tickets.length === 0 && <p className="text-center text-gray-400 py-10">No active tickets</p>}
            </div>

            {selectedUserId && (
                <UserInfoModal
                    userId={selectedUserId}
                    onClose={() => setSelectedUserId(null)}
                />
            )}

            {selectedTicket && (
                <TicketResponseModal
                    ticketId={selectedTicket.id}
                    existingResponse={selectedTicket.adminResponse}
                    onClose={() => setSelectedTicket(null)}
                    onUpdate={(id, response) => {
                        setTickets(prev => prev.map(t => t.id === id ? { ...t, adminResponse: response, status: 'IN_REVIEW' } : t));
                    }}
                />
            )}
        </div>
    );
};

export default AdminTicketTable;
