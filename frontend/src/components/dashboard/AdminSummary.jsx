import React, { useEffect, useState } from "react";
import axios from "axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import {
  ShieldCheck,
  Users,
  Star,
  Loader2,
  PlaneTakeoff,
  Link2,
} from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminSummary = () => {
  const [stats, setStats] = useState({
    officers: 0,
    sergeants: 0,
    soldiers: 0,
    total: 0,
    onMission: 0,
    attachedFrom: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:5000/api/soldier/stats");
        if (res.data.success) {
          setStats({
            officers: res.data.officers || 0,
            sergeants: res.data.sergeants || 0,
            soldiers: res.data.soldiers || 0,
            total: res.data.total || 0,
            onMission: res.data.onMission || 0,
            attachedFrom: res.data.attachedFrom || 0,
          });
        }
      } catch (err) {
        console.error("خطأ في جلب الإحصائيات:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const chartData = {
    labels: ["ضباط", "صف ضباط", "جنود"],
    datasets: [
      {
        data: [stats.officers, stats.sergeants, stats.soldiers],
        backgroundColor: ["#ca8a04", "#1a2e2a", "#4ade80"],
        hoverOffset: 20,
      },
    ],
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[#1a2e2a]" size={50} />
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 text-right" dir="rtl">
      {/* Header - إجمالي القوة */}
      <div className="bg-[#1a2e2a] p-10 rounded-[2.5rem] shadow-2xl border-b-8 border-yellow-600 flex justify-between items-center text-white relative">
        <div className="z-10">
          <h2 className="text-4xl font-black italic mb-2 tracking-tighter">تمام القوة البشرية</h2>
          <p className="text-yellow-500 font-bold tracking-widest text-sm uppercase">الكتيبة الخامسة - حرس جمهوري</p>
        </div>
        <div className="bg-white/10 p-6 rounded-3xl border border-white/20 z-10">
          <span className="block text-6xl font-black text-yellow-500">{stats.total}</span>
          <span className="text-xs font-bold uppercase tracking-widest text-center block">فرد مقاتل</span>
        </div>
      </div>

      {/* كروت الإحصائيات الأساسية */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="إجمالي الضباط" count={stats.officers} icon={<Star size={40} />} color="border-yellow-600" />
        <StatCard title="إجمالي صف ضباط" count={stats.sergeants} icon={<ShieldCheck size={40} />} color="border-[#1a2e2a]" />
        <StatCard title="إجمالي الجنود" count={stats.soldiers} icon={<Users size={40} />} color="border-green-600" />
      </div>

      {/* كروت التمام الميداني (المأموريات والإلحاق) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-red-50 p-6 rounded-3xl border-r-8 border-red-600 flex justify-between items-center transition-all hover:bg-red-100">
          <div>
            <p className="text-red-900 font-black text-lg">خارج الوحدة (مأموريات)</p>
            <h3 className="text-4xl font-black text-red-600">{stats.onMission}</h3>
          </div>
          <PlaneTakeoff size={50} className="text-red-200" />
        </div>
        <div className="bg-blue-50 p-6 rounded-3xl border-r-8 border-blue-600 flex justify-between items-center transition-all hover:bg-blue-100">
          <div>
            <p className="text-blue-900 font-black text-lg">ملحقون من وحدات أخرى</p>
            <h3 className="text-4xl font-black text-blue-600">{stats.attachedFrom}</h3>
          </div>
          <Link2 size={50} className="text-blue-200" />
        </div>
      </div>

      {/* الرسم البياني والدليل */}
      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 flex flex-col lg:flex-row items-center gap-10">
        <div className="flex-1 space-y-6">
          <h3 className="text-3xl font-black text-[#1a2e2a] border-r-8 border-yellow-600 pr-4">تحليل توزيع القوة</h3>
          <p className="text-gray-500 font-bold text-lg leading-relaxed">
            يوضح الرسم البياني نسب القوة البشرية الفعلية المسجلة حالياً. الأرقام تعكس البيانات اللحظية بقاعدة بيانات الكتيبة.
          </p>
          
          {/* دليل الألوان (Legend) المفقود ✅ */}
          <div className="flex flex-wrap gap-4 pt-4">
            <LegendItem color="bg-yellow-600" label="ضباط" count={stats.officers} />
            <LegendItem color="bg-[#1a2e2a]" label="صف ضباط" count={stats.sergeants} />
            <LegendItem color="bg-green-400" label="جنود" count={stats.soldiers} />
          </div>
        </div>

        <div className="w-72 h-72 relative group transition-transform duration-500 hover:scale-105">
          <Doughnut
            data={chartData}
            options={{ cutout: "75%", plugins: { legend: { display: false } } }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-black text-[#1a2e2a]">{stats.total}</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">إجمالي</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// مكونات المساعدة (Helper Components)
const StatCard = ({ title, count, icon, color }) => (
  <div className={`bg-white p-8 rounded-3xl shadow-lg border-r-8 ${color} flex items-center justify-between hover:shadow-2xl transition-all`}>
    <div>
      <p className="text-gray-500 font-bold mb-1">{title}</p>
      <h3 className="text-4xl font-black text-[#1a2e2a]">{count}</h3>
    </div>
    <div className="opacity-10 text-[#1a2e2a]">{icon}</div>
  </div>
);

const LegendItem = ({ color, label, count }) => (
  <div className="flex items-center gap-3 bg-gray-50 px-5 py-3 rounded-2xl border border-gray-100 shadow-sm">
    <span className={`w-4 h-4 ${color} rounded-full`}></span>
    <span className="font-black text-[#1a2e2a]">{label}: {count}</span>
  </div>
);

export default AdminSummary;