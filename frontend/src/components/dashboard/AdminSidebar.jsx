import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaUserShield, FaSignOutAlt } from 'react-icons/fa';

const AdminSidebar = () => {
    return (
        <div className="bg-teal-900 text-white h-screen fixed right-0 top-0 w-64 shadow-xl" dir="rtl">
            <div className="p-6 text-center border-b border-teal-800">
                <h2 className="text-xl font-black text-yellow-500">منظومة الكتيبة 5</h2>
                <p className="text-xs text-teal-300">نظام إدارة السجلات</p>
            </div>

            <nav className="mt-6">
                {/* رابط الرئيسية - الملخص */}
                <NavLink to="/admin-dashboard" end className={({ isActive }) => 
                    `flex items-center p-4 hover:bg-teal-800 transition ${isActive ? 'bg-teal-700 border-r-4 border-yellow-500 text-yellow-500' : ''}`
                }>
                    <FaTachometerAlt className="ml-3" />
                    <span className="font-bold">لوحة الإحصائيات</span>
                </NavLink>

                {/* رابط البيانات العسكرية - الشغل الأساسي */}
                <NavLink to="/admin-dashboard/military-data" className={({ isActive }) => 
                    `flex items-center p-4 hover:bg-teal-800 transition ${isActive ? 'bg-teal-700 border-r-4 border-yellow-500 text-yellow-500' : ''}`
                }>
                    <FaUserShield className="ml-3" />
                    <span className="font-bold">سجل البيانات العسكرية</span>
                </NavLink>

                {/* زر تسجيل الخروج في الأسفل */}
                <div className="absolute bottom-0 w-full p-4 border-t border-teal-800">
                    <button 
                        onClick={() => {
                            localStorage.removeItem("token");
                            window.location.reload();
                        }}
                        className="flex items-center text-red-400 hover:text-red-200 transition w-full"
                    >
                        <FaSignOutAlt className="ml-3" />
                        <span className="font-bold">تسجيل الخروج</span>
                    </button>
                </div>
            </nav>
        </div>
    );
};

export default AdminSidebar;