import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUserShield,
  FaUserFriends,
  FaSignOutAlt,
  FaMedal,
  FaSearch,
  FaGavel,
  FaArchive,
  FaUserEdit // أيقونة للملف الشخصي الشامل
} from "react-icons/fa";

const AdminSidebar = () => {
  return (
    <div className="bg-teal-900 text-white h-screen fixed right-0 top-0 w-64 shadow-xl border-l-4 border-yellow-600 no-print" dir="rtl">
      
      {/* رأس القائمة الجانبية */}
      <div className="p-6 text-center border-b border-teal-800 bg-teal-950">
        <h2 className="text-xl font-black text-yellow-500 italic">منظومة الكتيبة 5</h2>
        <p className="text-[10px] text-teal-300 tracking-widest mt-1 font-bold">نظام إدارة السجلات الموحد</p>
      </div>

      <nav className="mt-4 overflow-y-auto h-[calc(100vh-180px)]">
        
        {/* 1. لوحة الإحصائيات - الرئيسية */}
        <MenuLink to="/admin-dashboard" icon={<FaTachometerAlt />} label="لوحة الإحصائيات" end />

        {/* 2. مركز الاستعلام العسكري - هو البوابة لملف المقاتل (Profile) ✅ */}
        <MenuLink 
          to="/admin-dashboard/search-soldier" 
          icon={<FaSearch className="text-yellow-500" />} 
          label="مركز الاستعلام العسكري" 
        />

        {/* 3. سجل البيانات العسكرية */}
        <MenuLink to="/admin-dashboard/military-data" icon={<FaUserShield />} label="سجل البيانات العسكرية" />

        {/* 4. البيانات الاجتماعية (الشخصية) */}
        <MenuLink to="/admin-dashboard/personal-data" icon={<FaUserFriends />} label="البيانات الاجتماعية" />

        {/* 5. السجل الوظيفي والجزاءات */}
        <MenuLink to="/admin-dashboard/career-data" icon={<FaMedal />} label="إدخال السجل الوظيفي" />

        {/* 6. سجل الانضباط الجماعي */}
        <MenuLink to="/admin-dashboard/penalties-list" icon={<FaGavel className="text-red-400" />} label="سجل الجزاءات والانضباط" />

        {/* 7. الأرشيف (الرديف) */}
        <MenuLink 
          to="/admin-dashboard/reserve-archive" 
          icon={<FaArchive className="text-blue-300" />} 
          label="دفتر سجلات الرديف" 
        />

        {/* زر تسجيل الخروج - ثابت في الأسفل */}
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

// مكون الوصلة (MenuLink) لضمان التنسيق الموحد
const MenuLink = ({ to, icon, label, end = false }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      `flex items-center p-4 mx-2 my-1 rounded-xl transition-all duration-300 font-bold text-sm ${
        isActive 
          ? "bg-yellow-600 text-teal-900 shadow-lg scale-105" 
          : "hover:bg-teal-800 text-teal-100"
      }`
    }
  >
    <span className="ml-3 text-lg">{icon}</span>
    <span>{label}</span>
  </NavLink>
);

export default AdminSidebar;