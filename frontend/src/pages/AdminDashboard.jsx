import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/dashboard/AdminSidebar';
import Navbar from '../components/dashboard/Navbar';

const AdminDashboard = () => {
    return (
        <div className="flex bg-gray-100 min-h-screen" dir="rtl">
            {/* القائمة الجانبية على اليمين */}
            <AdminSidebar />

            {/* المحتوى الرئيسي على اليسار */}
            <div className="flex-1 mr-64"> 
                <Navbar />
                <div className="p-6">
                    {/* هنا بتظهر الصفحات الفرعية زي الملخص أو البيانات العسكرية */}
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;