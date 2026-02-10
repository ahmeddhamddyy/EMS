import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/dashboard/AdminSidebar';
import Navbar from '../components/dashboard/Navbar';
import RG_LOGO from '../assets/rg.png'; 

const AdminDashboard = () => {
    return (
        <div className="flex bg-[#f4f7f6] min-h-screen font-sans overflow-x-hidden" dir="rtl">
            {/* القائمة الجانبية ثابتة كما هي */}
            <AdminSidebar />

            <div className="flex-1 mr-64 flex flex-col min-h-screen relative">
                
                {/* 1. العلامة المائية - تم تقليل الـ opacity قليلاً لراحة العين عند قراءة الأرقام الجديدة */}
                <div 
                    className="fixed inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none z-0"
                    style={{ 
                        backgroundImage: `url(${RG_LOGO})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        backgroundSize: '600px'
                    }}
                >
                </div>

                {/* 2. الـ Navbar الثابت */}
                <header className="sticky top-0 z-50 bg-[#1a2e2a] shadow-2xl border-b-4 border-yellow-600 h-20">
                    <div className="flex items-center justify-between px-8 h-full relative">
                        
                        {/* اللوجو البارز - إضافة تأثير بسيط عند الهوفر */}
                        <div className="flex items-center gap-4 group cursor-default">
                            <div className="bg-white p-1 rounded-full shadow-lg border-2 border-yellow-500 w-14 h-14 overflow-hidden flex items-center justify-center transition-transform group-hover:scale-110">
                                <img src={RG_LOGO} alt="RG Logo" className="w-full h-full object-contain" />
                            </div>
                            <div className="hidden lg:block text-white">
                                <h2 className="text-lg font-black leading-none italic uppercase">الحرس الجمهوري</h2>
                                {/* تم تحديث النص ليعكس شمولية المنظومة */}
                                <span className="text-yellow-500 text-[10px] font-bold tracking-widest block mt-1">منظومة إدارة القوة والقطاعات الخارجية</span>
                            </div>
                        </div>

                        {/* عبارة الترحيب في السنتر */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 text-center pointer-events-none">
                            <h1 className="text-white font-black text-2xl tracking-tighter flex items-center gap-3">
                                <span className="text-yellow-500 italic opacity-40 select-none">//</span>
                                سجل الكتيبة ٥
                                <span className="text-yellow-500 italic opacity-40 select-none">//</span>
                            </h1>
                        </div>

                        <div className="z-10 relative">
                            <Navbar />
                        </div>
                    </div>
                </header>

                {/* 3. منطقة المحتوى - الـ Outlet هو اللي هيعرض AdminSummary.jsx المعدل */}
                <main className="p-8 flex-grow relative z-10">
                    {/* الانيميشن ده بيخلي دخول صفحة الإحصائيات (بألوانها الجديدة) شكلها شيك */}
                    <div className="animate-in fade-in duration-700 slide-in-from-bottom-6">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;