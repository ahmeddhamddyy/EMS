import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { ShieldCheck, Users, UserCheck, Star } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminSummary = () => {
    const [stats, setStats] = useState({ officers: 0, sergeants: 0, soldiers: 0, total: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get("http://127.0.0.1:5000/api/soldier/stats");
                if (res.data) setStats(res.data);
            } catch (err) {
                console.error("خطأ في جلب الإحصائيات:", err);
            }
        };
        fetchStats();
    }, []);

    const chartData = {
        labels: ['ضباط', 'صف ضباط', 'جنود'],
        datasets: [
            {
                data: [stats.officers, stats.sergeants, stats.soldiers],
                backgroundColor: ['#ca8a04', '#1a2e2a', '#4ade80'],
                borderColor: ['#ffffff'],
                borderWidth: 2,
            },
        ],
    };

    // خيارات الرسم البياني لضمان عدم التداخل
    const chartOptions = {
        cutout: '70%',
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                display: false // نخفي الليجند الافتراضي ونستخدم اللي صممناه يدوياً
            }
        }
    };

    return (
        /* أضفنا relative و z-0 لضمان بقاء الصفحة تحت الـ Navbar */
        <div className="space-y-8 animate-in fade-in duration-700 relative z-0">
            
            {/* Header القوة البشرية */}
            <div className="bg-[#1a2e2a] p-8 rounded-3xl shadow-2xl border-b-8 border-yellow-600 flex justify-between items-center text-white relative">
                <div>
                    <h2 className="text-4xl font-black italic mb-2 tracking-tighter">تمام القوة البشرية</h2>
                    <p className="text-yellow-500 font-bold uppercase tracking-widest text-sm">إجمالي السجلات المسجلة بالمنظومة</p>
                </div>
                <div className="text-center bg-white/10 p-4 rounded-2xl border border-white/20">
                    <span className="block text-5xl font-black text-yellow-500">{stats.total || 0}</span>
                    <span className="text-[10px] font-bold uppercase">محارب</span>
                </div>
            </div>

            {/* كروت الإحصائيات */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-xl border-r-8 border-yellow-600 flex items-center justify-between transition-transform hover:scale-[1.02]">
                    <div>
                        <p className="text-gray-500 font-bold text-sm">إجمالي الضباط</p>
                        <h3 className="text-3xl font-black text-[#1a2e2a]">{stats.officers}</h3>
                    </div>
                    <Star size={45} className="text-yellow-600 opacity-20" />
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-xl border-r-8 border-[#1a2e2a] flex items-center justify-between transition-transform hover:scale-[1.02]">
                    <div>
                        <p className="text-gray-500 font-bold text-sm">إجمالي ضباط الصف</p>
                        <h3 className="text-3xl font-black text-[#1a2e2a]">{stats.sergeants}</h3>
                    </div>
                    <ShieldCheck size={45} className="text-[#1a2e2a] opacity-20" />
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-xl border-r-8 border-green-600 flex items-center justify-between transition-transform hover:scale-[1.02]">
                    <div>
                        <p className="text-gray-500 font-bold text-sm">إجمالي الجنود</p>
                        <h3 className="text-3xl font-black text-[#1a2e2a]">{stats.soldiers}</h3>
                    </div>
                    <Users size={45} className="text-green-600 opacity-20" />
                </div>
            </div>

            {/* تحليل التوزيع والرسم البياني */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-white p-10 rounded-3xl shadow-2xl border border-gray-100 relative overflow-hidden">
                <div className="space-y-6 relative z-10">
                    <h3 className="text-3xl font-black text-[#1a2e2a] border-r-8 border-yellow-600 pr-4">تحليل توزيع القوة</h3>
                    <p className="text-gray-600 leading-relaxed font-bold text-lg">
                        يوضح هذا الرسم البياني النسبة المئوية لكل فئة داخل الكتيبة ٥. يتم تحديث البيانات لحظياً لضمان دقة "التمام اليومي".
                    </p>
                    <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-3 bg-yellow-50 px-4 py-2 rounded-xl border border-yellow-100">
                            <span className="w-4 h-4 bg-yellow-600 rounded-full shadow-sm"></span>
                            <span className="font-black text-[#1a2e2a]">ضباط</span>
                        </div>
                        <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
                            <span className="w-4 h-4 bg-[#1a2e2a] rounded-full shadow-sm"></span>
                            <span className="font-black text-[#1a2e2a]">صف</span>
                        </div>
                        <div className="flex items-center gap-3 bg-green-50 px-4 py-2 rounded-xl border border-green-100">
                            <span className="w-4 h-4 bg-green-400 rounded-full shadow-sm"></span>
                            <span className="font-black text-[#1a2e2a]">جنود</span>
                        </div>
                    </div>
                </div>
                
                {/* الحاوية الخاصة بالرسم البياني مع ضمان الـ z-index */}
                <div className="relative max-w-[320px] mx-auto z-0">
                    <Doughnut data={chartData} options={chartOptions} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-gray-400 font-bold text-xs">إجمالي</span>
                        <span className="text-2xl font-black text-[#1a2e2a]">{stats.total}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSummary;