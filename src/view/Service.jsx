import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Leaf, Truck, ShieldCheck, Star, RefreshCcw, Headset, 
  ArrowRight, CheckCircle2, Globe, Zap 
} from "lucide-react";
import Navbar from "../components/Navbar";
import AgriChatbot from "../components/AI/AgriChatbot";

const Service = () => {
  const navigate = useNavigate();

  const services = [
    {
      title: "Organic Ecosystem",
      desc: "Direct farm-to-fork pipeline ensuring 100% pesticide-free produce.",
      icon: <Leaf className="text-green-500" size={32} />,
      tag: "Eco-Friendly"
    },
    {
      title: "Smart Logistics",
      desc: "Cold-chain delivery that preserves nutrients and flavor until your door.",
      icon: <Truck className="text-emerald-500" size={32} />,
      tag: "Fast"
    },
    {
      title: "Blockchain Security",
      desc: "Transparent transaction ledger for 100% secure, traceable payments.",
      icon: <ShieldCheck className="text-blue-500" size={32} />,
      tag: "Secure"
    },
    {
      title: "Quality Protocol",
      desc: "Every product undergoes a 12-point quality check before shipping.",
      icon: <Star className="text-yellow-500" size={32} />,
      tag: "Premium"
    },
    {
      title: "Circular Economy",
      desc: "Return packaging for credit. We recycle 100% of our delivery waste.",
      icon: <RefreshCcw className="text-orange-500" size={32} />,
      tag: "Sustainable"
    },
    {
      title: "Agri-Expert Help",
      desc: "Direct access to agricultural specialists for product inquiries.",
      icon: <Headset className="text-purple-500" size={32} />,
      tag: "24/7 Support"
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-green-100">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-100/40 via-transparent to-transparent -z-10" />
        
        <div className="max-w-7xl mx-auto text-center">
          <span className="px-4 py-2 rounded-full bg-green-100 text-green-700 text-xs font-black uppercase tracking-[0.2em] mb-6 inline-block">
            Our Capabilities
          </span>
          <h1 className="text-6xl md:text-7xl font-black text-gray-900 tracking-tighter mb-6">
            Beyond Just <span className="text-green-600 italic">Delivery.</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            GreenChain combines advanced blockchain logistics with sustainable farming to redefine how you consume nature's best.
          </p>
        </div>
      </section>

      {/* --- SERVICE GRID --- */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-white border border-gray-100 p-10 rounded-[40px] shadow-sm hover:shadow-2xl hover:shadow-green-900/5 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-green-600 group-hover:text-white transition-all duration-500">
                  {service.icon}
                </div>
                <span className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-2 block">
                  {service.tag}
                </span>
                <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">
                  {service.title}
                </h3>
                <p className="text-gray-500 font-medium leading-relaxed mb-6">
                  {service.desc}
                </p>
                <div className="flex items-center text-gray-900 font-bold text-sm gap-2 group-hover:gap-4 transition-all">
                  Learn More <ArrowRight size={16} />
                </div>
              </div>
              {/* Subtle background shape */}
              <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-gray-50 rounded-full group-hover:bg-green-50 transition-colors duration-500" />
            </div>
          ))}
        </div>
      </section>

      {/* --- NEW FEATURE: IMPACT STATS --- */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-gray-900 rounded-[50px] p-12 md:p-20 text-white flex flex-col md:flex-row justify-between items-center gap-12 overflow-hidden relative">
          <div className="relative z-10 space-y-8 max-w-md">
            <h2 className="text-4xl font-black tracking-tighter leading-none">
              The Impact of <br /> Switching to Green.
            </h2>
            <p className="text-gray-400 font-medium">
              Every order helps us fund reforestation projects and support fair-trade farmers across the region.
            </p>
            <div className="flex gap-4">
               <div className="flex flex-col">
                  <span className="text-3xl font-black text-green-400">12k+</span>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Trees Planted</span>
               </div>
               <div className="w-[1px] h-10 bg-gray-800" />
               <div className="flex flex-col">
                  <span className="text-3xl font-black text-green-400">400+</span>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Local Farmers</span>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 relative z-10">
            <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 flex flex-col items-center">
              <Globe className="text-green-400 mb-4" size={40} />
              <span className="text-xs font-black uppercase">Carbon Neutral</span>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 mt-8 flex flex-col items-center">
              <Zap className="text-yellow-400 mb-4" size={40} />
              <span className="text-xs font-black uppercase">Instant Payout</span>
            </div>
          </div>
          
          {/* Background Gradient */}
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-green-600/20 to-transparent pointer-events-none" />
        </div>
      </section>

      {/* --- CALL TO ACTION --- */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="bg-green-50 rounded-[40px] p-12 border border-green-100 inline-block w-full">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-6">
            Ready to taste the difference?
          </h2>
          <p className="text-gray-600 mb-10 font-medium max-w-xl mx-auto">
            Join 5,000+ households getting fresh, certified organic products delivered weekly.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate("/shop")}
              className="bg-green-600 text-white px-10 py-5 rounded-2xl text-lg font-black uppercase tracking-widest hover:bg-green-700 transition-all hover:shadow-xl shadow-green-200"
            >
              Start Shopping Now
            </button>
            <button className="bg-white text-gray-900 border border-gray-200 px-10 py-5 rounded-2xl text-lg font-black uppercase tracking-widest hover:bg-gray-50 transition-all">
              View Memberships
            </button>
          </div>
        </div>
      </section>

      <AgriChatbot />
    </div>
  );
};

export default Service;