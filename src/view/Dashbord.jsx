import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Sidebar from "../components/Dashbord/Sidebar";
import Overview from "../components/Dashbord/Overview";
import ProductTable from "../components/Dashbord/ProductTable";
import AIAdvisor from "../components/Dashbord/AIAdvisor";
import Weather from "../components/Dashbord/Weather";
import Analytics from "../components/Dashbord/Analytics";
import AddProduct from "../components/Dashbord/AddProduct";
import OrderTable from "../components/Dashbord/OrderTable";
import UserTable from "../components/Dashbord/UserTable";
import AdminTicketTable from "../components/Dashbord/AdminTicketTable";
import Navbar from "../components/Navbar"

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const mainRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "ADMIN") {
      navigate("/userdashbord");
    }
  }, [navigate]);

  useEffect(() => {
    if (activeSection === "logout") {
      localStorage.clear();
      toast.success("Logged out successfully");
      navigate("/");
    }
  }, [activeSection, navigate]);

  useGSAP(() => {
    gsap.from(mainRef.current, {
      opacity: 0,
      y: 40,
      duration: 1,
      ease: "power3.out",
    });
  }, [activeSection]);


  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <Overview />;
      case "products":
        return <ProductTable />;
      case "ai":
        return <AIAdvisor />;
      case "orders":
        return <OrderTable />;
      case "weather":
        return <Weather />;
      case "analytics":
        return <Analytics />;
      case "addproduct":
        return <AddProduct />;
      case "users":
        return <UserTable />;
      case "tickets":
        return <AdminTicketTable />;
      default:
        return <Overview />;
    }
  };

  return (
    <>
      <Navbar />
      <div className="h-screen w-screen bg-green-50 flex font-sans pt-10">

        <div className="pt-10">
          <Sidebar setActiveSection={setActiveSection} />
        </div>
        <div
          ref={mainRef}
          className="flex-1 ml-[18vw] p-8 overflow-y-auto flex flex-col gap-10"
        >
          {renderSection()}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
