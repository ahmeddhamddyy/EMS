import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUserShield,
  FaUserFriends,
  FaSignOutAlt,
  FaMedal,
  FaSearch, // أيقونة الاستعلام ✅
} from "react-icons/fa";

const AdminSidebar = () => {
  return (
    <div
      className="bg-teal-900 text-white h-screen fixed right-0 top-0 w-64 shadow-xl"
      dir="rtl"
    >
      <div className="p-6 text-center border-b border-teal-800">
        <h2 className="text-xl font-black text-yellow-500 italic">
          منظومة الكتيبة 5
        </h2>
        <p className="text-xs text-teal-300 tracking-widest mt-1">
          نظام إدارة السجلات الموحد
        </p>
      </div>

      <nav className="mt-6">
        <NavLink
          to="/admin-dashboard"
          end
          className={({ isActive }) =>
            `flex items-center p-4 hover:bg-teal-800 transition-all duration-300 ${
              isActive
                ? "bg-teal-700 border-r-4 border-yellow-500 text-yellow-500 shadow-inner"
                : ""
            }`
          }
        >
          <FaTachometerAlt className="ml-3 text-lg" />
          <span className="font-bold">لوحة الإحصائيات</span>
        </NavLink>

        {/* زر البحث والاستعلام - مضاف حديثاً ✅ */}
        <NavLink
          to="/admin-dashboard/search-soldier"
          className={({ isActive }) =>
            `flex items-center p-4 hover:bg-teal-800 transition-all duration-300 ${
              isActive
                ? "bg-teal-700 border-r-4 border-yellow-500 text-yellow-500 shadow-inner"
                : ""
            }`
          }
        >
          <FaSearch className="ml-3 text-lg" />
          <span className="font-bold">مركز الاستعلام العسكري</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/military-data"
          className={({ isActive }) =>
            `flex items-center p-4 hover:bg-teal-800 transition-all duration-300 ${
              isActive
                ? "bg-teal-700 border-r-4 border-yellow-500 text-yellow-500 shadow-inner"
                : ""
            }`
          }
        >
          <FaUserShield className="ml-3 text-lg" />
          <span className="font-bold">سجل البيانات العسكرية</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/personal-data"
          className={({ isActive }) =>
            `flex items-center p-4 hover:bg-teal-800 transition-all duration-300 ${
              isActive
                ? "bg-teal-700 border-r-4 border-yellow-500 text-yellow-500 shadow-inner"
                : ""
            }`
          }
        >
          <FaUserFriends className="ml-3 text-lg" />
          <span className="font-bold">البيانات الشخصية والاجتماعية</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/career-data"
          className={({ isActive }) =>
            `flex items-center p-4 hover:bg-teal-800 transition-all duration-300 ${
              isActive
                ? "bg-teal-700 border-r-4 border-yellow-500 text-yellow-500 shadow-inner"
                : ""
            }`
          }
        >
          <FaMedal className="ml-3 text-lg" />
          <span className="font-bold">السجل الوظيفي والانضباطي</span>
        </NavLink>

        <div className="absolute bottom-0 w-full p-4 border-t border-teal-800 bg-teal-950">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.reload();
            }}
            className="flex items-center text-red-400 hover:text-red-300 hover:bg-red-900/20 p-2 rounded transition-all w-full"
          >
            <FaSignOutAlt className="ml-3 text-lg" />
            <span className="font-bold">تسجيل الخروج</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default AdminSidebar;
