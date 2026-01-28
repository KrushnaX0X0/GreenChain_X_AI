import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/bg.png";
import signature from "../../assets/signature1.png";

const Bill = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);

  const invoiceNo = Date.now();
  const todayDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  // Load data
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

    if (!userData || cartItems.length === 0) {
      navigate("/");
      return;
    }

    setUser(userData);
    setItems(cartItems);
  }, [navigate]);

  // Calculations
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const deliveryCharge = subtotal > 500 ? 0 : 40;
  const discount = subtotal > 1000 ? 100 : 0;
  const grandTotal = subtotal + deliveryCharge - discount;

  if (!user) return null;

  return (
    <div className="h-screen bg-gray-100 flex justify-center overflow-hidden">

      {/* SCROLL CONTAINER */}
      <div className="w-full max-w-4xl bg-white shadow-xl my-6 rounded-xl overflow-y-auto p-8">

        {/* HEADER */}
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <div className="flex items-center gap-4">
            <img src={logo} alt="Logo" className="w-14 h-14" />
            <div>
              <h1 className="text-2xl font-extrabold text-green-600">
                AGRIMART
              </h1>
              <p className="text-sm text-gray-500">
                Fresh Farm Products
              </p>
            </div>
          </div>

          <div className="text-right text-sm">
            <p><b>Invoice #</b> {invoiceNo}</p>
            <p><b>Date:</b> {todayDate}</p>
            <span className="inline-block mt-2 px-3 py-1 text-xs font-bold bg-green-100 text-green-700 rounded-full">
              PAID
            </span>
          </div>
        </div>

        {/* USER DETAILS */}
        <div className="grid md:grid-cols-2 gap-6 text-sm mb-6">
          <div>
            <h3 className="font-bold mb-2">Billed To</h3>
            <p>{user.name}</p>
            <p>{user.address}</p>
            <p>{user.city}</p>
            <p>📞 {user.phone}</p>
          </div>

          <div className="md:text-right">
            <h3 className="font-bold mb-2">Payment Method</h3>
            <p className="uppercase">{user.payment || "ONLINE"}</p>
          </div>
        </div>

        {/* PRODUCTS TABLE */}
        <table className="w-full border text-sm mb-8">
          <thead className="bg-green-100">
            <tr>
              <th className="border p-3 text-left">Product</th>
              <th className="border p-3 text-center">Qty</th>
              <th className="border p-3 text-right">Price</th>
              <th className="border p-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td className="border p-3">{item.name}</td>
                <td className="border p-3 text-center">{item.qty}</td>
                <td className="border p-3 text-right">₹ {item.price}</td>
                <td className="border p-3 text-right">
                  ₹ {item.price * item.qty}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* TOTAL SECTION */}
        <div className="max-w-sm ml-auto text-sm space-y-2 mb-8">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹ {subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery</span>
            <span>₹ {deliveryCharge}</span>
          </div>
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>- ₹ {discount}</span>
          </div>
          <hr />
          <div className="flex justify-between text-lg font-bold">
            <span>Grand Total</span>
            <span>₹ {grandTotal}</span>
          </div>
        </div>

        {/* SIGNATURE */}
        <div className="flex justify-between items-end mb-8">
          <p className="text-xs text-gray-500">
            Thank you for shopping with AgriMart 🌱
          </p>

          <div className="text-center">
            <img src={signature} className="w-[20vw] mx-auto " />
            <p className="text-sm font-semibold border-t ">
              Authorized Signature
            </p>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-4">
          <button
            onClick={() => window.print()}
            className="bg-green-600 cursor-pointer text-white px-10 py-2 rounded-lg font-semibold hover:scale-105 transition"
          >
            Print Bill
          </button>

         
        </div>

      </div>
    </div>
  );
};

export default Bill;
