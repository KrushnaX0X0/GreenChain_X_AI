import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LayoutDashboard, ShoppingBag, LogOut, ChevronDown, ChevronUp, Package, MapPin 
} from 'lucide-react';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:8080/api/orders/my-orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login'; // Or your routing logic
  };

  return (
    <div className="flex h-screen bg-[#F0FDF4] font-sans ">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b flex flex-col justify-center from-[#16a34a] to-[#065f46] text-white flex flex-col shadow-xl">
        <div className="p-6 flex items-center gap-2 text-xl font-bold border-b border-white/10">
          <div className="bg-white/20 p-1 rounded-lg">🍃</div>
          GreenChain
        </div>
        <nav className="flex-1 px-3 mt-4 space-y-1">
          <SidebarLink name="Dashboard" active={activeTab} setter={setActiveTab} icon={<LayoutDashboard size={20}/>} />
          <SidebarLink name="My Orders" active={activeTab} setter={setActiveTab} icon={<ShoppingBag size={20}/>} />
        </nav>

         <button 
          onClick={handleLogout}
          className="w-[90%] flex items-center gap-3 px-4 py-3 rounded-xl flex justify-evenly transition-all border-none bg-gray-100 hover:bg-gray-300 cursor-pointer outline-none"
        >
          <span className="text-[10px] t font-black text-gray-900 uppercase tracking-[0.2em] group-hover:text-gray-400 transition-colors">
            Logout
          </span>
          <span className="text-gray-900 group-hover:text-gray-400 transition-colors">
            →
          </span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="p-10 overflow-y-auto">
          {activeTab === 'Dashboard' && <StatsSummary orders={orders} />}
          {activeTab === 'My Orders' && <OrderList orders={orders} loading={loading} />}
        </div>
      </main>



  

    </div>
  );
};

// --- Sub-Components ---

const OrderList = ({ orders, loading }) => (
  <div className="bg-white rounded-[32px] border border-gray-100 overflow-hidden">
    <div className="p-10 border-b border-gray-50 flex justify-between items-end">
      <div>
        <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Ledger</h2>
        <h3 className="text-4xl font-black text-gray-900 tracking-tighter">Order History</h3>
      </div>
      <div className="text-right hidden md:block">
        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Database Sync</p>
        <p className="text-xs font-black text-gray-900 italic">v2.0.4.8</p>
      </div>
    </div>
    
    {loading ? (
      <div className="p-32 text-center">
        <div className="inline-block h-8 w-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Retrieving Data...</p>
      </div>
    ) : (
      <div className="divide-y divide-gray-50">
        {orders.map((order) => (
          <OrderRow key={order?.orderId} order={order} />
        ))}
      </div>
    )}
  </div>
);

const OrderRow = ({ order }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`group transition-all duration-500 ${isOpen ? 'bg-gray-50/50' : 'bg-white'}`}>
      {/* Primary Interaction Area */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between p-10 cursor-pointer hover:px-12 transition-all duration-300"
      >
        <div className="flex items-center gap-12">
          <div>
            <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest block mb-1">Ref.</span>
            <span className="text-xl font-black text-gray-900 tracking-tight group-hover:italic transition-all">
              #{order.orderId}
            </span>
          </div>
          <div>
            <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest block mb-1">Destination</span>
            <span className="text-sm font-bold text-gray-600">{order?.city}</span>
          </div>
        </div>

        <div className="flex items-center gap-16">
          <div className="text-right">
            <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest block mb-1">Value</span>
            <span className="text-2xl font-black text-gray-900 tracking-tighter">
              ₹{order?.totalAmount.toLocaleString()}
            </span>
          </div>
          <div className={`h-10 w-10 rounded-full border border-gray-100 flex items-center justify-center transition-all ${isOpen ? 'bg-gray-900 border-gray-900 text-white' : 'text-gray-400'}`}>
            <span className="text-xs font-bold">{isOpen ? '−' : '+'}</span>
          </div>
        </div>
      </div>

      {/* Product Detail "Glass" View */}
      {isOpen && (
        <div className="px-10 pb-10 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="bg-white border border-gray-100 rounded-[24px] shadow-2xl shadow-gray-200/50 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-50 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  <th className="px-8 py-5">Product Identifier</th>
                  <th className="px-8 py-5">Unit Cost</th>
                  <th className="px-8 py-5">Quantity</th>
                  <th className="px-8 py-5 text-right">Line Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {order.items?.map((item, index) => (
                  <tr key={index} className="text-sm group/item hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-6 font-black text-gray-800 tracking-tight">{item?.productName}</td>
                    <td className="px-8 py-6 text-gray-500 font-medium italic">₹{item?.price}</td>
                    <td className="px-8 py-6 text-gray-500 font-medium">{item.quantity}</td>
                    <td className="px-8 py-6 text-right font-black text-gray-900 tracking-tight">
                      ₹{item.price * item?.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="bg-gray-50/50 px-8 py-4 flex justify-between items-center">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Transaction Verified</span>
              <span className="text-xs font-bold text-gray-900">Total Settlement: ₹{order?.totalAmount}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SidebarLink = ({ name, active, setter, icon }) => (
  <button
    onClick={() => setter(name)}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
      active === name ? 'bg-white text-green-900 shadow-lg font-bold translate-x-2' : 'hover:bg-white/10'
    }`}
  >
    {icon} <span className="text-sm tracking-wide">{name}</span>
  </button>
);

const StatsSummary = ({ orders = [] }) => {
  const totalSpent = orders.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
  const totalItems = orders.reduce((acc, curr) => acc + (curr.items?.length || 0), 0);
  const avgOrderValue = orders.length > 0 ? (totalSpent / orders.length).toFixed(0) : 0;

  return (
    <div className="space-y-8">
      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Capital Invested" value={`₹${totalSpent.toLocaleString()}`} label="Gross" />
        <StatCard title="Procured Units" value={totalItems} label="Volume" />
        <StatCard title="Average Value" value={`₹${Number(avgOrderValue).toLocaleString()}`} label="AOV" />
        <StatCard title="Active Logistics" value={orders.length} label="Transit" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Large Data Module */}
        <div className="lg:col-span-2 bg-white rounded-[32px] p-10 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-10">Utilization Index</h3>
            <div className="flex items-baseline gap-4">
              <span className="text-7xl font-black text-gray-900 tracking-tighter italic">
                {((totalSpent / 50000) * 100).toFixed(0)}%
              </span>
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-500 uppercase">Monthly Capacity</p>
                <div className="flex gap-1">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className={`h-1 w-4 rounded-full ${i < 6 ? 'bg-gray-900' : 'bg-gray-100'}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Subtle Geometric Background */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gray-50 to-transparent pointer-events-none" />
        </div>

        {/* Action Canvas */}
        <div className="bg-gray-900 rounded-[32px] p-10 text-white flex flex-col justify-between hover:bg-black transition-all duration-500 shadow-2xl shadow-gray-200 group">
          <div className="space-y-2">
            <div className="h-0.5 w-8 bg-white group-hover:w-16 transition-all duration-500" />
            <h3 className="text-2xl font-light tracking-tight italic">System<br/>Overlook</h3>
          </div>
          <button className="w-full py-4 bg-white text-gray-900 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:tracking-[0.3em] transition-all">
            Secure Marketplace
          </button>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, label }) => (
  <div className="bg-white p-8 rounded-[24px] border border-gray-100 group hover:border-gray-900 transition-all duration-300">
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center mb-6">
        <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">{label}</span>
        <div className="h-1 w-1 bg-gray-200 rounded-full group-hover:scale-[3] group-hover:bg-gray-900 transition-all" />
      </div>
      <h4 className="text-gray-400 text-xs font-medium">{title}</h4>
      <p className="text-4xl font-black text-gray-900 tracking-tighter leading-none">
        {value}
      </p>
    </div>
  </div>
); 

export default UserDashboard;