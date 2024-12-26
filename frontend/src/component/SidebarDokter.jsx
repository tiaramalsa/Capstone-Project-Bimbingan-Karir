import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaCalendarAlt,
  FaClipboardCheck,
  FaHistory,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000/api";

const SidebarDokter = () => {
  const [doctorId, setDoctorId] = useState("default");

  useEffect(() => {
    const doctorData = JSON.parse(localStorage.getItem("dokterId"));
    if (doctorData) {
      setDoctorId(doctorData.id);
    }
  }, []); // Runs once when the component mounts

  const menuItems = [
    { name: "Dashboard", path: `/dokter/${doctorId}/dashboarddokter`, icon: <FaHome /> },
    { name: "Jadwal Periksa", path: `/dokter/${doctorId}/jadwalperiksadokter`, icon: <FaCalendarAlt /> },
    { name: "Memeriksa Pasien", path: `/dokter/${doctorId}/daftarperiksadokter`, icon: <FaClipboardCheck /> },
    { name: "Riwayat Pasien", path: `/dokter/${doctorId}/riwayatpasien`, icon: <FaHistory /> },
    { name: "Profil", path: `/dokter/${doctorId}/profildokter`, icon: <FaUserCircle /> },
  ];

  return (
    <div className="h-screen bg-blue-600 text-white w-64 flex flex-col fixed left-0 top-0">
      {/* Header */}
      <div className="py-4 text-center font-bold text-lg border-b-2 border-white flex items-center justify-center">
        <img src="/src/assets/logoAdaSehat.png" alt="Doctorate Logo" className="h-8 w-8 mr-2" />
        Dokter
      </div>

      {/* Navigation Menu */}
      <nav className="mt-4 flex flex-col flex-grow">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center py-3 px-4 text-base font-medium transition-colors ${
                isActive ? "bg-blue-800 text-white" : "hover:bg-blue-800 hover:text-white"
              }`
            }
          >
            <span className="mr-3 text-lg">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Logout Menu */}
      <div className="border-t-2 border-white mt-auto">
        <NavLink
          to="/"
          className="flex items-center py-3 px-4 text-base font-medium transition-colors hover:bg-blue-800 hover:text-white"
        >
          <span className="mr-3 text-lg">
            <FaSignOutAlt />
          </span>
          Logout
        </NavLink>
      </div>
    </div>
  );
};

export default SidebarDokter;
