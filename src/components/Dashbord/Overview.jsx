import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaShoppingCart, FaBoxOpen, FaUsers, FaMoneyBillWave, FaExclamationTriangle } from "react-icons/fa";

const Overview = () => {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem("token");
    try {
      // 1. Fetch All Data in Parallel
      const [productsRes, ordersRes, usersRes] = await Promise.all([
        axios.get("http://localhost:8080/api/products"),
        axios.get("http://localhost:8080/api/orders/all", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:8080/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      // 2. Process Products
      const allProducts = productsRes.data;
      const lowStockItems = allProducts.filter((p) => p.quantity < 10);

      // 3. Process Orders
      const allOrders = ordersRes.data;
      const totalRevenue = allOrders.reduce((sum, order) => sum + order.totalAmount, 0);

      // 4. Update State
      setStats({
        products: allProducts.length,
        orders: allOrders.length,
        users: usersRes.data.length,
        revenue: totalRevenue,
      });

      setRecentOrders(allOrders.slice(-5).reverse()); // Last 5 orders
      setLowStock(lowStockItems);
    } catch (error) {
      console.error("Error loading dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    { title: "Total Revenue", value: `₹${stats.revenue.toLocaleString()}`, note: "Lifetime Earnings", icon: <FaMoneyBillWave />, color: "bg-green-100 text-green-700" },
    { title: "Total Orders", value: stats.orders, note: "Orders Placed", icon: <FaShoppingCart />, color: "bg-blue-100 text-blue-700" },
    { title: "Active Products", value: stats.products, note: "In Inventory", icon: <FaBoxOpen />, color: "bg-purple-100 text-purple-700" },
    { title: "Total Users", value: stats.users, note: "Registered Customers", icon: <FaUsers />, color: "bg-orange-100 text-orange-700" },
  ];

  if (loading) return <div className="p-10 text-center text-gray-500">Loading Dashboard...</div>;

  return (
    <div className="space-y-8">
      {/* 📊 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">{card.title}</p>
              <h2 className="text-2xl font-bold text-gray-800">{card.value}</h2>
              <p className="text-xs text-gray-400 mt-2">{card.note}</p>
            </div>
            <div className={`p-4 rounded-2xl ${card.color} text-xl`}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 📦 Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-[32px] p-8 border border-gray-100 shadow-xl shadow-gray-100/50">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-sm text-gray-400 border-b border-gray-100">
                  <th className="py-3 font-normal">Order ID</th>
                  <th className="py-3 font-normal">Customer</th>
                  <th className="py-3 font-normal">Amount</th>
                  <th className="py-3 font-normal">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, index) => (
                  <tr key={order.id || `order-${index}`} className="border-b border-gray-50 last:border-none hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 text-sm font-bold text-gray-700">#{order.id}</td>
                    <td className="py-4 text-sm text-gray-600">{order.user?.email || "Guest"}</td>
                    <td className="py-4 text-sm font-medium text-gray-800">₹{order.totalAmount}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                        order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentOrders.length === 0 && <tr key="no-orders"><td colSpan="4" className="text-center py-4 text-gray-400">No recent orders</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        {/* ⚠️ Low Stock Alerts */}
        <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-xl shadow-gray-100/50">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FaExclamationTriangle className="text-amber-500" /> Low Stock
          </h2>
          <div className="space-y-4">
            {lowStock.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-3 bg-amber-50 rounded-2xl border border-amber-100">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-lg shadow-sm">
                  🌾
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-800">{item.name}</h4>
                  <p className="text-xs text-amber-600 font-medium">{item.quantity} remaining</p>
                </div>
              </div>
            ))}
            {lowStock.length === 0 && <div className="text-center text-gray-400 py-4">All stock levels healthy ✅</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
