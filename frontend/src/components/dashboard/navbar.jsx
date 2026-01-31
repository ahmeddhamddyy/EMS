import React from 'react';
import { LogOut } from 'lucide-react'; // استيراد أيقونة الخروج لشكل احترافي

const Navbar = () => {
    const handleLogout = () => {
        // منطق تسجيل الخروج الخاص بك
        console.log("Logout triggered");
    };

    return (
        <div className="flex items-center gap-4">
            {/* تم إزالة "مرحبا أدمن" من هنا بناءً على طلبك السابق */}
            
            <button 
                onClick={handleLogout}
                className="flex items-center gap-2 bg-[#0f1b18] hover:bg-black text-yellow-500 border border-yellow-600/50 px-5 py-2.5 rounded-xl font-black text-sm transition-all shadow-[0_4px_10px_rgba(0,0,0,0.3)] hover:shadow-yellow-600/20 active:scale-95 group"
            >
                <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span>تسجيل الخروج</span>
            </button>
        </div>
    );
};

export default Navbar;