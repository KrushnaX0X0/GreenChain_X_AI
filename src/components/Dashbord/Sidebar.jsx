import React from "react";
import { FaHome, FaBoxOpen, FaPlusCircle, FaRobot, FaCloudSun, FaChartBar, FaCog, FaSignOutAlt, FaClipboardList, FaUsers, FaHeadset } from "react-icons/fa";
const Sidebar = ({ setActiveSection }) => {
  const menuItems = [
    { label: "Dashboard", value: "overview", icon: <FaHome /> },
    { label: "All Orders", value: "orders", icon: <FaClipboardList /> },
    { label: "My Products", value: "products", icon: <FaBoxOpen /> },
    { label: "Add Product", value: "addproduct", icon: <FaPlusCircle /> },
    { label: "Users", value: "users", icon: <FaUsers /> },
    { label: "Support", value: "tickets", icon: <FaHeadset /> },
    // { label: "AI Crop Advisor", value: "ai", icon: <FaRobot /> },
    // { label: "Weather", value: "weather", icon: <FaCloudSun /> },
    { label: "Analytics", value: "analytics", icon: <FaChartBar /> },
    // { label: "Settings", value: "settings", icon: <FaCog /> },
    { label: "Logout", value: "logout", icon: <FaSignOutAlt /> },
  ];

  return (
    <div className="w-[18vw] h-screen bg-green-700 text-white flex flex-col justify-center p-6 gap-6 fixed left-0 top-0 ">


      <ul className="flex flex-col justify-center gap-4 text-lg">
        {menuItems.map((item) => (
          <li
            key={item.value}
            onClick={() => setActiveSection(item.value)}
            className="hover:bg-green-600 p-3 rounded cursor-pointer flex items-center gap-3 shadow-black/50 shadow-2xl hover:shadow-xl transition-all duration-300"
          >
            <span className="text-xl text-yellow-400">{item.icon}</span>
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
