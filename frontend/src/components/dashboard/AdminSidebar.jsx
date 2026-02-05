import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUserShield,
  FaUserFriends,
  FaSignOutAlt,
  FaMedal,
  FaSearch,
  FaGavel // أيقونة الجزاءات ✅
} from "react-icons/fa";

const AdminSidebar = () => {
  return (
    <div className="bg-teal-900 text-white h-screen fixed right-0 top-0 w-64 shadow-xl border-l-4 border-yellow-600" dir="rtl">
      <div className="p-6 text-center border-b border-teal-800 bg-teal-950">
        <h2 className="text-xl font-black text-yellow-500 italic">منظومة الكتيبة 5</h2>
        <p className="text-[10px] text-teal-300 tracking-widest mt-1 font-bold">نظام إدارة السجلات الموحد</p>
      </div>

      <nav className="mt-4">
        {/* لوحة الإحصائيات */}
        <MenuLink to="/admin-dashboard" icon={<FaTachometerAlt />} label="لوحة الإحصائيات" end />

        {/* الاستعلام العسكري */}
        <MenuLink to="/admin-dashboard/search-soldier" icon={<FaSearch />} label="مركز الاستعلام العسكري" />

        {/* البيانات العسكرية */}
        <MenuLink to="/admin-dashboard/military-data" icon={<FaUserShield />} label="سجل البيانات العسكرية" />

        {/* البيانات الشخصية */}
        <MenuLink to="/admin-dashboard/personal-data" icon={<FaUserFriends />} label="البيانات الاجتماعية" />

        {/* السجل الوظيفي */}
        <MenuLink to="/admin-dashboard/career-data" icon={<FaMedal />} label="إدخال السجل الوظيفي" />

        {/* سجل الجزاءات - مضاف حديثاً ✅ */}
        <MenuLink to="/admin-dashboard/penalties-list" icon={<FaGavel className="text-red-400" />} label="سجل الجزاءات والانضباط" />

        {/* زر تسجيل الخروج */}
        <div className="absolute bottom-0 w-full p-4 border-t border-teal-800 bg-teal-950">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.reload();
            }}
            className="flex items-center text-red-400 hover:text-red-300 hover:bg-red-900/20 p-3 rounded-xl transition-all w-full font-black text-sm"
          >
            <FaSignOutAlt className="ml-3 text-lg" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

// مكون فرعي للروابط لتقليل التكرار
const MenuLink = ({ to, icon, label, end = false }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      `flex items-center p-4 mx-2 my-1 rounded-xl transition-all duration-300 font-bold text-sm ${
        isActive ? "bg-yellow-600 text-teal-900 shadow-lg scale-105" : "hover:bg-teal-800 text-teal-100"
      }`
    }
  >
    <span className="ml-3 text-lg">{icon}</span>
    <span>{label}</span>
  </NavLink>
);

export default AdminSidebar;