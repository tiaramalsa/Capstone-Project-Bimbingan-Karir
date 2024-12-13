import React from "react";
import { NavLink } from "react-router-dom";
import { 
  FaHome, 
  FaCalendarAlt, 
  FaClipboardCheck, 
  FaHistory, 
  FaUserCircle, 
  FaSignOutAlt 
} from "react-icons/fa";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000/api";

const SidebarDokter = () => {
  const menuItems = [
    { name: "Dashboard", path: "/dashboarddokter", icon: <FaHome /> },
    { name: "Jadwal Periksa", path: "/jadwal-periksa", icon: <FaCalendarAlt /> },
    { name: "Memeriksa Pasien", path: "/memeriksa-pasien", icon: <FaClipboardCheck /> },
    { name: "Riwayat Pasien", path: "/riwayat-pasien", icon: <FaHistory /> },
    { name: "Profil", path: "/profildokter", icon: <FaUserCircle /> },
  ];

  return (
    <div className="h-screen bg-blue-600 text-white w-64 flex flex-col fixed left-0 top-0">
      {/* Header */}
      <div className="py-4 text-center font-bold text-lg border-b border-gray-600">
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
                isActive
                  ? "bg-blue-800 text-white"
                  : "hover:bg-blue-800 hover:text-white"
              }`
            }
          >
            <span className="mr-3 text-lg">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Logout Menu */}
      <div className="border-t border-gray-600 mt-auto">
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
