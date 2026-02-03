import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import confetti from "canvas-confetti";
import {
  Download, Printer, Home, CheckCircle,
  Leaf, MapPin, Phone, Hash
} from "lucide-react";

import logo from "../../assets/bg.png";
import signature from "../../assets/signature1.png";

import { useLocation } from "react-router-dom"; // Add this import

const Bill = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get passed state
  const printRef = useRef();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // 1. Try to get order from navigation state first, then localStorage
    const navOrder = location.state?.order;
    const lastOrder = navOrder || JSON.parse(localStorage.getItem("lastOrder"));

    if (!lastOrder) {
      navigate("/");
      return;
    }

    setOrder(lastOrder);

    // 2. Trigger Celebration only if it's a new order (from localStorage usually means just paid)
    // If navigation state is present, maybe skip confetti or keep it. Let's keep it for fun.
    if (!navOrder) { // Only play confetti for new checkouts (localStorage)
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#16a34a', '#4ade80', '#ffffff']
      });
    }
  }, [navigate, location.state]);

  // --- FEATURE: DOWNLOAD AS PDF ---
  const downloadPDF = async () => {
    const element = printRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const data = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`AgriMart_Invoice_${order.orderId}.pdf`);
  };

  if (!order) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      {/* ACTION TOP BAR */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-slate-500 hover:text-green-600 font-bold text-sm transition">
          <Home size={18} /> Back to Home
        </button>
        <div className="flex gap-3">
          <button onClick={() => window.print()} className="p-2 bg-slate-100 rounded-lg text-slate-600 hover:bg-slate-200 transition">
            <Printer size={20} />
          </button>
          <button onClick={downloadPDF} className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-green-700 transition shadow-lg shadow-green-200">
            <Download size={18} /> Download PDF
          </button>
        </div>
      </div>

      {/* INVOICE CONTAINER */}
      <div
        ref={printRef}
        className="max-w-4xl mx-auto bg-white shadow-2xl rounded-[2rem] overflow-hidden border border-slate-100 mb-10"
      >
        {/* TOP ACCENT BAR */}
        <div className="h-3 bg-gradient-to-r from-green-400 to-emerald-600" />

        <div className="p-10 md:p-16">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row justify-between gap-8 mb-12">
            <div className="flex items-center gap-5">
              <div className="bg-green-50 p-3 rounded-2xl">
                <img src={logo} alt="Logo" className="w-16 h-16 object-contain" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tighter">AGRIMART</h1>
                <p className="text-green-600 font-bold text-xs uppercase tracking-widest flex items-center gap-1">
                  <Leaf size={12} /> Certified Organic Farm
                </p>
              </div>
            </div>

            <div className="text-left md:text-right space-y-1">
              <h2 className="text-4xl font-black text-slate-200 uppercase">Invoice</h2>
              <div className="flex items-center md:justify-end gap-2 text-slate-500 font-bold text-sm">
                <Hash size={14} /> <span>{order.orderId}</span>
              </div>
              <p className="text-slate-400 text-xs font-medium">{order.date}</p>
              <div className="pt-2">
                <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Successfully Paid
                </span>
              </div>
            </div>
          </div>

          {/* DETAILS GRID */}
          <div className="grid md:grid-cols-3 gap-8 mb-12 bg-slate-50 p-8 rounded-[1.5rem] border border-slate-100">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Billed To</p>
              <h4 className="font-black text-slate-800 text-lg">{order.customer.name}</h4>
              <p className="text-slate-500 text-sm leading-relaxed">{order.customer.address}</p>
              <p className="text-slate-500 text-sm">{order.customer.city}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Contact</p>
              <div className="flex items-center gap-2 text-slate-600 font-bold text-sm mb-1">
                <Phone size={14} className="text-green-500" /> {order.customer.phone}
              </div>
              <p className="text-slate-500 text-xs italic">Delivery within 24 hours</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Transaction ID</p>
              <p className="text-slate-800 font-mono text-xs break-all">{order.paymentId}</p>
              <p className="text-slate-400 text-[10px] mt-2 uppercase font-bold">Method: {order.customer.payment}</p>
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto mb-10">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-slate-100">
                  <th className="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Description</th>
                  <th className="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Qty</th>
                  <th className="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Unit Price</th>
                  <th className="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {order.items.map((item) => (
                  <tr key={item.id} className="group hover:bg-slate-50 transition">
                    <td className="py-5">
                      <p className="font-bold text-slate-800">{item.name}</p>
                      <span className="text-[10px] text-green-500 font-bold uppercase">Organic Pick</span>
                    </td>
                    <td className="py-5 text-center font-bold text-slate-600">{item.qty}</td>
                    <td className="py-5 text-right font-bold text-slate-600">₹{item.price}</td>
                    <td className="py-5 text-right font-black text-slate-800">₹{item.price * item.qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* TOTALS */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
            <div className="max-w-xs">
              <div className="flex items-center gap-3 text-green-600 mb-2">
                <CheckCircle size={20} />
                <p className="font-bold text-sm">Payment Verified</p>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed italic">
                This is a computer-generated invoice and doesn't require a physical signature for digital verification.
              </p>
            </div>

            <div className="w-full md:w-80 space-y-3">
              <div className="flex justify-between text-sm font-bold text-slate-500">
                <span>Subtotal</span>
                <span>₹{order.total}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-500">
                <span>Shipping Fee</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="h-[1px] bg-slate-100" />
              <div className="flex justify-between items-center bg-slate-900 text-white p-5 rounded-2xl shadow-xl shadow-slate-200">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Amount Paid</span>
                <span className="text-2xl font-black text-green-400">₹{order.total}</span>
              </div>
            </div>
          </div>

          {/* SIGNATURE AREA */}
          <div className="mt-16 pt-10 border-t border-slate-50 flex justify-between items-center">
            <div>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Sustainability Note</p>
              <p className="text-slate-400 text-[10px] font-medium max-w-[200px]">By choosing AgriMart, you saved 2.4kg of Carbon Emissions today. 🌱</p>
            </div>
            <div className="text-center">
              <img src={signature} alt="Signature" className="w-32 mx-auto mix-blend-multiply opacity-80" />
              <div className="h-[1px] bg-slate-200 w-40 mx-auto my-2" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Operations Head</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bill;