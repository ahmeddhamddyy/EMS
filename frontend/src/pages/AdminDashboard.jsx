import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/dashboard/AdminSidebar';
import Navbar from '../components/dashboard/Navbar';

// استيراد اللوجو من مجلد assets الذي أنشأته
import RG_LOGO from '../assets/rg.png'; 

const AdminDashboard = () => {
    return (
        <div className="flex bg-[#f4f7f6] min-h-screen font-sans overflow-x-hidden" dir="rtl">
            {/* القائمة الجانبية */}
            <AdminSidebar />

            <div className="flex-1 mr-64 flex flex-col min-h-screen relative">
                
                {/* 1. العلامة المائية في الخلفية (Watermark) */}
                <div 
                    className="fixed inset-0 flex items-center justify-center opacity-[0.05] pointer-events-none z-0"
                    style={{ 
                        backgroundImage: `url(${RG_LOGO})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        backgroundSize: '500px'
                    }}
                >
                </div>

                {/* 2. الـ Navbar الثابت */}
                <header className="sticky top-0 z-50 bg-[#1a2e2a] shadow-2xl border-b-4 border-yellow-600 h-20">
                    <div className="flex items-center justify-between px-8 h-full relative">
                        
                        {/* اللوجو البارز */}
                        <div className="flex items-center gap-4">
                            <div className="bg-white p-1 rounded-full shadow-lg border-2 border-yellow-500 w-14 h-14 overflow-hidden flex items-center justify-center">
                                <img src={RG_LOGO} alt="RG Logo" className="w-full h-full object-contain" />
                            </div>
                            <div className="hidden lg:block text-white">
                                <h2 className="text-lg font-black leading-none italic">الحرس الجمهوري</h2>
                                <span className="text-yellow-500 text-[10px] font-bold tracking-widest block mt-1">الكتيبة ٥ - القوة البشرية</span>
                            </div>
                        </div>

                        {/* عبارة الترحيب في السنتر */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 text-center pointer-events-none">
                            <h1 className="text-white font-black text-2xl tracking-tighter flex items-center gap-3">
                                <span className="text-yellow-500 italic opacity-40 select-none">//</span>
                                مرحبا، أدمن
                                <span className="text-yellow-500 italic opacity-40 select-none">//</span>
                            </h1>
                        </div>

                        <div className="z-10 relative">
                            <Navbar />
                        </div>
                    </div>
                </header>

                {/* 3. منطقة المحتوى */}
                <main className="p-8 flex-grow relative z-10">
                    <div className="animate-in fade-in duration-700 slide-in-from-bottom-4">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;