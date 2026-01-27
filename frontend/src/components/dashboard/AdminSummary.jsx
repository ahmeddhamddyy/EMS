import React, { useEffect, useState } from 'react';
import { FaUserTie, FaUserShield, FaUsers } from 'react-icons/fa';
import axios from 'axios';

const AdminSummary = () => {
    const [stats, setStats] = useState({ officers: 0, sergeants: 0, soldiers: 0 });

    useEffect(() => {
        // جلب الإحصائيات من السيرفر
        const fetchStats = async () => {
            try {
                const res = await axios.get("http://127.0.0.1:5000/api/soldier/stats");
                setStats(res.data);
            } catch (err) { console.log("خطأ في جلب الإحصائيات"); }
        };
        fetchStats();
    }, []);

    return (
        <div className="p-6 bg-gray-100" dir="rtl">
            <h2 className="text-2xl font-bold mb-6 text-teal-900">ملخص القوة العسكرية - الكتيبة الخامسة</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* كارت الضباط */}
                <div className="bg-white p-6 rounded-lg shadow-md border-r-8 border-yellow-500 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 font-bold">إجمالي الضباط</p>
                        <p className="text-3xl font-black">{stats.officers}</p>
                    </div>
                    <FaUserTie className="text-4xl text-yellow-500" />
                </div>
                {/* كارت ضباط الصف */}
                <div className="bg-white p-6 rounded-lg shadow-md border-r-8 border-blue-500 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 font-bold">إجمالي ضباط الصف</p>
                        <p className="text-3xl font-black">{stats.sergeants}</p>
                    </div>
                    <FaUserShield className="text-4xl text-blue-500" />
                </div>
                {/* كارت الجنود */}
                <div className="bg-white p-6 rounded-lg shadow-md border-r-8 border-green-600 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 font-bold">إجمالي الجنود</p>
                        <p className="text-3xl font-black">{stats.soldiers}</p>
                    </div>
                    <FaUsers className="text-4xl text-green-600" />
                </div>
            </div>
        </div>
    );
};

export default AdminSummary;