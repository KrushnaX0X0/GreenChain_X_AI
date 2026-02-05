import React, { useState } from 'react';
import axios from 'axios';
import { X, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const TicketResponseModal = ({ ticketId, existingResponse, onClose, onUpdate }) => {
    const [response, setResponse] = useState(existingResponse || '');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!response.trim()) {
            toast.error("Response cannot be empty");
            return;
        }

        setSubmitting(true);
        const token = localStorage.getItem('token');
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/api/support/tickets/${ticketId}/respond`, {
                response: response
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Response sent successfully!");
            onUpdate(ticketId, response);
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Failed to send response");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-green-50/50">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Send className="text-green-600" size={20} /> Reply to Ticket #{ticketId}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200/50 rounded-full transition-colors text-gray-500 hover:text-red-500"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <textarea
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        placeholder="Type your response to the user here..."
                        className="w-full h-40 p-4 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none font-medium"
                    />

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="px-6 py-3 rounded-xl text-sm font-bold text-white bg-green-600 hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                            {submitting ? 'Sending...' : 'Send Response'} <Send size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketResponseModal;
