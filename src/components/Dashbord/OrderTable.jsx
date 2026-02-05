import React, { useEffect, useState } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
import { FaTrash, FaSearch } from "react-icons/fa";

const OrderTable = () => {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(res.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/api/orders/${id}/status`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Order status updated");
            fetchOrders(); // Refresh list
        } catch (error) {
            console.error(error);
            toast.error("Failed to update status");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this order?")) return;

        const token = localStorage.getItem('token');
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/orders/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Order deleted");
            setOrders(orders.filter(o => o.orderId !== id));
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete order");
        }
    };

    const filteredOrders = orders.filter(order =>
        order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.orderId?.toString().includes(searchTerm)
    );

    if (loading) {
        return <div className="text-center p-10 text-green-700">Loading Orders...</div>;
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-green-800 font-serif">
                    All Orders
                </h2>
                <div className="relative">
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search orders..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-green-50 text-green-800 border-b border-green-200">
                            <th className="p-4 font-semibold">Order ID</th>
                            <th className="p-4 font-semibold">Customer</th>
                            <th className="p-4 font-semibold">Date</th>
                            <th className="p-4 font-semibold">Status</th>
                            <th className="p-4 font-semibold">Total</th>
                            <th className="p-4 font-semibold">Items</th>
                            <th className="p-4 font-semibold">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map((order) => (
                                <tr
                                    key={order.orderId}
                                    className="border-b border-gray-100 hover:bg-green-50/50 transition-colors"
                                >
                                    <td className="p-4 text-gray-700">#{order.orderId}</td>
                                    <td className="p-4">
                                        <div className="font-medium text-gray-800">{order.customerName}</div>
                                        <div className="text-xs text-gray-500">{order.mobile}</div>
                                        <div className="text-xs text-gray-400 truncate w-32" title={order.address}>{order.address}</div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">
                                        {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "N/A"}
                                        <br />
                                        <span className="text-xs text-gray-400">
                                            {order.orderDate ? new Date(order.orderDate).toLocaleTimeString() : ""}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <select
                                            className={`px-2 py-1 rounded-full text-xs font-semibold border-none focus:ring-2 focus:ring-green-400 cursor-pointer ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                                order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}
                                            value={order.status || 'Pending'}
                                            onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td className="p-4 font-bold text-green-700">
                                        ₹{order.totalAmount}
                                    </td>
                                    <td className="p-4 text-gray-600">
                                        <ul className="list-disc pl-4 text-sm">
                                            {order.items.map((item, idx) => (
                                                <li key={idx}>
                                                    {item.productName} (x{item.quantity})
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => handleDelete(order.orderId)}
                                            className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition"
                                            title="Delete Order"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="p-6 text-center text-gray-500">
                                    No orders found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderTable;
