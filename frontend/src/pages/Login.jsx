import axios from 'axios';
import React, { useState } from 'react';
import { useAuth } from "../context/authContext";
import { useNavigate } from 'react-router-dom';
import RG_LOGO from '../assets/rg.png'; 

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://127.0.0.1:5000/api/auth/login", { email, password });
            if (response.data.success) {
                login(response.data.user);
                localStorage.setItem("token", response.data.token);
                if (response.data.user.role === "admin") {
                    navigate('/admin-dashboard');
                } else {
                    navigate('/employee-dashboard');
                }
            }
        } catch (error) {
            setError(error.response?.data?.error || "خطأ في الاتصال بالسيرفر");
        }
    };

    return (
        <div className="flex flex-col items-center h-screen justify-center bg-[#f4f7f6] relative overflow-hidden font-sans" dir="rtl">
            
            {/* الخلفية العسكرية العلوية - تم تقليل ارتفاعها */}
            <div className="absolute top-0 w-full h-[40vh] bg-[#1a2e2a] border-b-4 border-yellow-600"></div>

            <div className="z-10 flex flex-col items-center w-full max-w-sm px-4">
                
                {/* اللوجو والترحيب - تقليل المسافات */}
                <div className="text-center mb-6">
                    <div className="bg-white p-2 rounded-full shadow-2xl border-2 border-yellow-600 inline-block mb-3">
                        <img src={RG_LOGO} alt="RG Logo" className="w-16 h-16 object-contain" />
                    </div>
                    <h2 className="text-2xl font-black text-white italic tracking-tight">
                        منظومة السجلات الرقمية
                    </h2>
                    <p className="text-yellow-500 font-bold tracking-widest text-[10px] uppercase opacity-90">
                        الكتيبة الخامسة - الحرس الجمهوري
                    </p>
                </div>

                {/* كارت تسجيل الدخول - مقاس مضبوط */}
                <div className="bg-white shadow-2xl rounded-2xl p-6 w-full border-t-4 border-[#1a2e2a]">
                    <h2 className="text-xl font-black text-[#1a2e2a] mb-5 text-center border-b pb-3">دخول المصرح لهم</h2>
                    
                    {error && (
                        <div className="bg-red-50 border-r-4 border-red-500 text-red-700 p-2 mb-4 rounded-lg text-[11px] font-bold">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 mb-1 mr-1">البريد الإلكتروني</label>
                            <input 
                                type="email"
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-[#1a2e2a] focus:border-[#1a2e2a] outline-none transition-all text-sm"
                                placeholder="name@domain.com" 
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-gray-400 mb-1 mr-1">كلمة المرور</label>
                            <input 
                                type="password" 
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-[#1a2e2a] focus:border-[#1a2e2a] outline-none transition-all text-sm"
                                placeholder="********"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between text-[10px] font-bold px-1">
                            <label className="flex items-center gap-2 cursor-pointer text-gray-500">
                                <input type="checkbox" className="w-3 h-3 accent-[#1a2e2a]" />
                                تذكر البيانات
                            </label> 
                            <a href="#" className="text-yellow-700 hover:underline">نسيت كلمة المرور؟</a>
                        </div> 

                        <button 
                            type="submit"
                            className="w-full bg-[#1a2e2a] hover:bg-black text-yellow-500 py-3 rounded-xl font-black text-lg shadow-lg transition-all transform active:scale-95 border-b-4 border-yellow-700 mt-2"
                        >
                            دخول
                        </button>
                    </form>
                </div>

                <p className="text-gray-400 text-[9px] font-bold mt-4 opacity-60">
                    نظام مراقب - للاستخدام العسكري فقط
                </p>
            </div>
        </div>
    );
};

export default Login;