import React from 'react';
import { useAuth } from '../../context/authContext';

const Navbar = () => {
    const { user } = useAuth();

    return (
        <div className="flex items-center justify-between h-16 bg-white px-10 shadow-md" dir="rtl">
            <div className="font-bold text-teal-900 text-lg">
                مرحباً بك، {user ? user.name : 'قائد الوحدة'}
            </div>
            <button 
                className="bg-teal-700 text-white px-4 py-1 rounded hover:bg-teal-900 transition"
                onClick={() => {
                    localStorage.removeItem("token");
                    window.location.reload();
                }}
            >
                تسجيل الخروج
            </button>
        </div>
    );
};

export default Navbar;