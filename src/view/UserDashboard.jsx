import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  LayoutDashboard, ShoppingBag, LogOut, ChevronDown, ChevronUp,
  Package, MapPin, Leaf, ShieldCheck, HelpCircle, Trophy, Recycle, Settings as SettingsIcon, Heart, Trash2, FileText
} from 'lucide-react';
import Navbar from '../components/Navbar';

// ... (rest of imports/code)



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
    window.location.href = '/login';
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8080/api/orders/my-orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(prev => prev.filter(o => o.orderId !== orderId));
      toast.success("Order cancelled successfully");
    } catch (err) {
      console.error("Delete Error:", err);
      toast.error("Failed to cancel order. You might not be allowed to delete this order.");
    }
  };

  return (
    <div className="flex h-screen bg-[#F0FDF4] font-sans">
      <Navbar />

      {/* Sidebar - Updated with more navigation options */}
      <aside className="w-64 bg-gradient-to-b from-[#16a34a] to-[#065f46] text-white flex flex-col shadow-xl">
        <nav className="flex-1 px-3 mt-20 space-y-1">
          <SidebarLink name="Dashboard" active={activeTab} setter={setActiveTab} icon={<LayoutDashboard size={18} />} />
          <SidebarLink name="My Orders" active={activeTab} setter={setActiveTab} icon={<ShoppingBag size={18} />} />
          <SidebarLink name="Eco Impact" active={activeTab} setter={setActiveTab} icon={<Leaf size={18} />} />
          <SidebarLink name="Support" active={activeTab} setter={setActiveTab} icon={<HelpCircle size={18} />} />
        </nav>

        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all border-none bg-gray-100 hover:bg-gray-300 cursor-pointer outline-none group"
          >
            <span className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em]">Logout</span>
            <span className="text-gray-900 group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="p-10 overflow-y-auto">
          {activeTab === 'Dashboard' && (
            <>
              <StatsSummary orders={orders} />
              <div className="mt-8">
                <SustainabilityFeatures />
              </div>
            </>
          )}
          {activeTab === 'My Orders' && <OrderList orders={orders} loading={loading} onDelete={handleDeleteOrder} />}
          {activeTab === 'Farm Insights' && <FarmInsights />}
          {activeTab === 'Eco Impact' && <EcoImpactDetailed orders={orders} />}
          {activeTab === 'Support' && <SupportFeature />}
          {activeTab === 'Settings' && <ProfileSettings />}
          {activeTab === 'Wishlist' && <WishlistComponent />}
        </div>
      </main>
    </div>
  );
};


// --- NEW FEATURE: Sustainability Modules ---

const SustainabilityFeatures = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Gamification Badge System */}
    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
      <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6">Achievements</h3>
      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-2">
          <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center text-green-600 shadow-inner">
            <Trophy size={24} />
          </div>
          <span className="text-[9px] font-bold text-gray-500 uppercase">Seedling</span>
        </div>
        <div className="flex flex-col items-center gap-2 opacity-30 grayscale">
          <div className="h-14 w-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
            <ShieldCheck size={24} />
          </div>
          <span className="text-[9px] font-bold text-gray-500 uppercase">Protector</span>
        </div>
      </div>
      <p className="mt-6 text-sm text-gray-600 leading-relaxed font-medium">
        You are <span className="text-green-600 font-bold">2 orders away</span> from the "Earth Protector" badge.
      </p>
    </div>

    {/* Recycling Quick Action */}
    <div className="bg-green-50 p-8 rounded-[32px] border border-green-100 flex justify-between items-center group cursor-pointer hover:bg-green-100 transition-all">
      <div>
        <h3 className="text-xl font-black text-green-900 tracking-tighter">Recycle Program</h3>
        <p className="text-xs text-green-700 font-medium">Schedule a pickup for used packaging.</p>
      </div>
      <div className="h-12 w-12 bg-green-600 text-white rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
        <Recycle size={20} />
      </div>
    </div>
  </div>
);

// --- NEW FEATURE: Eco Impact Detailed ---

const EcoImpactDetailed = ({ orders }) => {
  const carbonSaved = orders.length * 2.4; // Dummy logic: 2.4kg per order
  return (
    <div className="animate-in fade-in duration-700">
      <h2 className="text-4xl font-black text-gray-900 tracking-tighter mb-8">Eco Impact Score</h2>
      <div className="bg-white rounded-[40px] p-12 border border-gray-100 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between gap-10">
          <div className="space-y-4">
            <div className="text-[10px] font-black text-green-500 uppercase tracking-widest">Calculated Savings</div>
            <div className="text-8xl font-black text-gray-900 tracking-tighter">
              {carbonSaved.toFixed(1)} <span className="text-3xl">kg/CO2</span>
            </div>
            <p className="text-gray-500 max-w-md font-medium">
              By using GreenChain for your last {orders.length} transactions, you've prevented carbon emissions equivalent to planting {Math.floor(carbonSaved / 0.5)} small trees.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-6 rounded-2xl">
              <p className="text-[9px] font-black text-gray-400 uppercase">Plastic Saved</p>
              <p className="text-xl font-black">{orders.length * 0.5}kg</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl">
              <p className="text-[9px] font-black text-gray-400 uppercase">Green Points</p>
              <p className="text-xl font-black">{orders.length * 100}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- NEW FEATURE: Support Hub ---

const SupportFeature = ({ orders }) => {
  const [ticketType, setTicketType] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [formData, setFormData] = useState({ orderId: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:8080/api/support/tickets/my-tickets', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTickets(response.data);
    } catch (error) {
      console.error("Failed to fetch tickets", error);
    }
  };

  const handleSubmit = async () => {
    if (!formData.description) return;
    setSubmitting(true);
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:8080/api/support/tickets', {
        ticketType: ticketType,
        orderId: formData.orderId ? parseInt(formData.orderId) : null,
        description: formData.description
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTicketType(null); // Reset form
      setFormData({ orderId: '', description: '' });
      fetchTickets(); // Refresh list
      toast.success("Ticket Created Successfully!");
    } catch (error) {
      console.error("Failed to create ticket", error);
      toast.error("Failed to create ticket.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl animate-in slide-in-from-bottom-4 duration-500 space-y-10">
      <header>
        <h2 className="text-[10px] font-black text-green-600 uppercase tracking-[0.3em] mb-2">Service Center</h2>
        <h3 className="text-4xl font-black text-gray-900 tracking-tighter">How can we help you today?</h3>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left: Quick Actions & Ticket Creation */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {[
              { id: 'orders', label: 'Order Issues', icon: <Package size={20} /> },
              { id: 'refund', label: 'Refund Status', icon: <ShieldCheck size={20} /> },
              { id: 'recycling', label: 'Recycling Help', icon: <Leaf size={20} /> },
              // { id: 'tech', label: 'Technical Support', icon: <Settings size={20} /> }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setTicketType(item.id)}
                className={`p-6 rounded-3xl border text-left transition-all flex flex-col gap-4 ${ticketType === item.id
                  ? 'bg-green-600 border-green-600 text-white shadow-xl translate-y-[-4px]'
                  : 'bg-white border-gray-100 text-gray-800 hover:border-green-400 hover:shadow-lg'
                  }`}
              >
                <div className={`${ticketType === item.id ? 'text-white' : 'text-green-600'}`}>
                  {item.icon}
                </div>
                <span className="font-black text-sm uppercase tracking-wider">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Conditional Ticket Form */}
          {ticketType && (
            <div className="bg-white p-8 rounded-[32px] border-2 border-green-600 animate-in zoom-in-95 duration-300">
              <h4 className="font-black text-gray-900 mb-4 uppercase text-xs tracking-widest">Submit a {ticketType} Ticket</h4>
              <div className="space-y-4">
                <select
                  className="w-full p-4 rounded-xl border border-gray-100 bg-gray-50 text-sm font-bold outline-none focus:ring-2 focus:ring-green-500"
                  onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                  value={formData.orderId}
                >
                  <option value="">Select Related Order (Optional)</option>
                  {orders?.map(o => (
                    <option key={o?.orderId} value={o?.orderId}>Order #{o?.orderId} - ₹{o?.totalAmount}</option>
                  ))}
                </select>
                <textarea
                  placeholder="Describe your issue in detail..."
                  className="w-full p-4 h-32 rounded-xl border border-gray-100 bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-green-500"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full py-4 bg-gray-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </div>
          )}

          {/* FAQ Section */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Frequent Questions</h4>
            {[
              { q: "How do I track my carbon savings?", a: "Carbon savings are calculated automatically based on the weight and type of eco-friendly products purchased." },
              { q: "What items can I recycle via GreenChain?", a: "We currently accept all corrugated cardboard packaging and glass containers provided in your orders." }
            ].map((faq, i) => (
              <details key={i} className="group bg-white border border-gray-100 rounded-2xl">
                <summary className="list-none p-6 flex justify-between items-center cursor-pointer font-bold text-gray-800">
                  {faq?.q}
                  <ChevronDown size={18} className="group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-6 pb-6 text-sm text-gray-500 leading-relaxed font-medium">
                  {faq?.a}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Right: Live Status & AI Chatbot */}
        <div className="space-y-6">
          {/* Live Agent Status */}
          <div className="bg-gray-900 rounded-[32px] p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-green-400">Agents Online</span>
              </div>
              <h4 className="text-2xl font-black tracking-tight mb-2 italic">Instant Connect</h4>
              <p className="text-gray-400 text-xs mb-8 leading-relaxed">Average response time: <span className="text-white font-bold">2 minutes</span></p>
              <button className="w-full py-4 bg-white text-gray-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-green-50 transition-all">
                Start Live Chat
              </button>
            </div>
            {/* Design Element */}
            <div className="absolute -bottom-10 -right-10 opacity-10">
              <HelpCircle size={150} />
            </div>
          </div>

          {/* Support Ticket History (Mini) */}
          <div className="bg-white p-8 rounded-[32px] border border-gray-100">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Recent Tickets</h4>
            <div className="space-y-4">
              {tickets.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">No tickets found</p>
              ) : (
                tickets.slice(0, 3).map((ticket) => (
                  <div key={ticket.id}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-black text-gray-900">#TK-{ticket.id}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">{ticket.ticketType}</p>
                      </div>
                      <span className={`px-3 py-1 text-[9px] font-black rounded-full uppercase ${ticket.status === 'CLOSED' ? 'bg-green-100 text-green-700' :
                        ticket.status === 'IN_REVIEW' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                        {ticket.status}
                      </span>
                    </div>

                    {
                      ticket.adminResponse && (
                        <div className="mt-3 p-3 bg-green-50 rounded-xl border border-green-100">
                          <p className="text-[9px] font-black text-green-600 uppercase mb-1">Response from Support</p>
                          <p className="text-xs text-gray-700 font-medium leading-relaxed">{ticket.adminResponse}</p>
                        </div>
                      )
                    }

                    < div className="h-[1px] bg-gray-50 w-full my-2" />
                  </div>
                ))
              )}
            </div>
            {tickets.length > 3 && (
              <button className="w-full text-center text-[10px] font-bold text-green-600 uppercase mt-4 hover:underline">
                View All Tickets
              </button>
            )}
          </div>
        </div>

      </div>
    </div >
  );
};

// --- Rest of your original components remain here (OrderList, OrderRow, SidebarLink, StatsSummary, StatCard) ---
// (Ensure you keep them exactly as they were in your previous snippet)

const OrderList = ({ orders, loading, onDelete }) => (
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
          <OrderRow key={order?.orderId} order={order} onDelete={onDelete} />
        ))}
      </div>
    )}
  </div>
);

const OrderRow = ({ order, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleViewBill = (e) => {
    e.stopPropagation();
    // Normalize order data to match Bill.jsx expectations
    const billData = {
      orderId: order.orderId,
      date: order.orderDate || new Date().toLocaleDateString(), // Fallback if no date
      total: order.totalAmount,
      paymentId: order.paymentId || 'Prepaid',
      customer: {
        name: "User", // We might want to pass the user's name if available, or just generic
        address: order.address || "N/A",
        city: order.city || "N/A",
        phone: order.phoneNumber || "N/A",
        payment: "Online"
      },
      items: order.items.map(item => ({
        id: item.id || Math.random(),
        name: item.productName,
        qty: item.quantity,
        price: item.price
      }))
    };
    navigate('/bill', { state: { order: billData } });
  };


  return (
    <div className={`group transition-all duration-500 ${isOpen ? 'bg-gray-50/50' : 'bg-white'}`}>
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
            <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest block mb-1">Status</span>
            <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
              order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
              {order.status || 'Pending'}
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
              ₹{order?.totalAmount?.toLocaleString()}
            </span>
          </div>
          <div className={`h-10 w-10 rounded-full border border-gray-100 flex items-center justify-center transition-all ${isOpen ? 'bg-gray-900 border-gray-900 text-white' : 'text-gray-400'}`}>
            <span className="text-xs font-bold">{isOpen ? '−' : '+'}</span>
          </div>
        </div>
      </div>



      {/* Cancel Button - Only show if not delivered/cancelled */}
      {/* Action Buttons */}
      <div className="flex justify-end px-10 pb-6 gap-4">
        <button
          onClick={handleViewBill}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-green-600 hover:text-green-800 transition-all border border-green-100 px-4 py-2 rounded-lg hover:bg-green-50"
        >
          <FileText size={14} /> View Invoice
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(order.orderId);
          }}
          className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-600 hover:underline transition-all px-4 py-2"
        >
          Cancel Order
        </button>
      </div>

      {
        isOpen && (
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
            </div>
          </div>
        )
      }
    </div >
  );
};

const SidebarLink = ({ name, active, setter, icon }) => (
  <button
    onClick={() => setter(name)}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${active === name ? 'bg-white text-green-900 shadow-lg font-bold translate-x-2' : 'hover:bg-white/10 text-white'
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Capital Invested" value={`₹${totalSpent.toLocaleString()}`} label="Gross" />
        <StatCard title="Procured Units" value={totalItems} label="Volume" />
        <StatCard title="Average Value" value={`₹${Number(avgOrderValue).toLocaleString()}`} label="AOV" />
        <StatCard title="Active Logistics" value={orders.length} label="Transit" />
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
      <p className="text-4xl font-black text-gray-900 tracking-tighter leading-none">{value}</p>
    </div>
  </div>
);

export default UserDashboard;

const ProfileSettings = () => {
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    mobile: '',
    address: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:8080/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data);
    } catch (error) {
      console.error("Failed to fetch profile", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const token = localStorage.getItem('token');
    try {
      await axios.put('http://localhost:8080/api/users/profile', profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Profile Updated Successfully!");
    } catch (error) {
      console.error("Failed to update profile", error);
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center text-gray-500">Loading Profile...</div>;

  return (
    <div className="max-w-3xl animate-in slide-in-from-right duration-500">
      <header className="mb-8">
        <h2 className="text-[10px] font-black text-green-600 uppercase tracking-[0.3em] mb-2">Account</h2>
        <h3 className="text-4xl font-black text-gray-900 tracking-tighter">Profile Settings</h3>
      </header>

      <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Display Name</label>
            <input
              type="text"
              value={profile.username}
              onChange={(e) => setProfile({ ...profile, username: e.target.value })}
              className="w-full p-4 rounded-xl border border-gray-100 bg-gray-50 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Email Address</label>
            <input
              type="text"
              value={profile.email}
              disabled
              className="w-full p-4 rounded-xl border border-gray-100 bg-gray-100 font-bold text-gray-500 cursor-not-allowed"
            />
            <p className="text-[10px] text-gray-400 italic px-2">Email cannot be changed completely.</p>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Mobile Number</label>
            <input
              type="text"
              placeholder="+91 00000 00000"
              value={profile.mobile || ''}
              onChange={(e) => setProfile({ ...profile, mobile: e.target.value })}
              className="w-full p-4 rounded-xl border border-gray-100 bg-gray-50 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Delivery Address</label>
            <textarea
              placeholder="Enter your full address..."
              value={profile.address || ''}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              className="w-full p-4 h-32 rounded-xl border border-gray-100 bg-gray-50 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-gray-50 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-10 py-4 bg-gray-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-green-600 transition-all disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};