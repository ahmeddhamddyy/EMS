import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import {
  ShieldCheck,
  Users,
  Star,
  Loader2,
  PlaneTakeoff,
  Link2,
  Gavel
} from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminSummary = () => {
  const navigate = useNavigate(); 
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
        const res = await axios.get("http://localhost:5000/api/soldier/stats");
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
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-[#1a2e2a]" size={60} />
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 text-right p-4" dir="rtl">
      
      {/* Header - إجمالي القوة */}
      <div className="bg-[#1a2e2a] p-10 rounded-[3rem] shadow-2xl border-b-8 border-yellow-600 flex justify-between items-center text-white relative overflow-hidden">
        <div className="z-10">
          <h2 className="text-4xl font-black italic mb-2 tracking-tighter">تمام القوة البشرية اللحظي</h2>
          <p className="text-yellow-500 font-bold tracking-widest text-sm uppercase">الكتيبة الخامسة - حرس جمهوري</p>
        </div>
        <div className="bg-white/10 p-6 rounded-3xl border border-white/20 z-10 backdrop-blur-sm">
          <span className="block text-6xl font-black text-yellow-500">{stats.total}</span>
          <span className="text-xs font-bold uppercase tracking-widest text-center block">فرد مقاتل</span>
        </div>
      </div>

      {/* كروت الإحصائيات القابلة للضغط - تم تعديل الروابط ✅ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="إجمالي الضباط" 
          count={stats.officers} 
          icon={<Star size={40} />} 
          color="border-yellow-600" 
          onClick={() => navigate("/admin-dashboard/category/ضابط")} 
        />
        <StatCard 
          title="إجمالي صف ضباط" 
          count={stats.sergeants} 
          icon={<ShieldCheck size={40} />} 
          color="border-[#1a2e2a]" 
          onClick={() => navigate("/admin-dashboard/category/صف")}
        />
        <StatCard 
          title="إجمالي الجنود" 
          count={stats.soldiers} 
          icon={<Users size={40} />} 
          color="border-green-600" 
          onClick={() => navigate("/admin-dashboard/category/جندي")}
        />
      </div>

      {/* كروت التمام الميداني والجزاءات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-red-50 p-6 rounded-3xl border-r-8 border-red-600 flex justify-between items-center cursor-pointer hover:bg-red-100 transition-all"
             onClick={() => navigate("/admin-dashboard/penalties-list")}>
          <div>
            <p className="text-red-900 font-black text-lg">سجل الجزاءات</p>
            <h3 className="text-4xl font-black text-red-600 italic">عرض</h3>
          </div>
          <Gavel size={50} className="text-red-200" />
        </div>

        <div onClick={() => navigate("/admin-dashboard/category/onMission")} 
             className="bg-orange-50 p-6 rounded-3xl border-r-8 border-orange-600 flex justify-between items-center transition-all hover:bg-orange-100 cursor-pointer">
          <div>
            <p className="text-orange-900 font-black text-lg">خارج الوحدة (مأموريات)</p>
            <h3 className="text-4xl font-black text-orange-600">{stats.onMission}</h3>
          </div>
          <PlaneTakeoff size={50} className="text-orange-200" />
        </div>

        <div onClick={() => navigate("/admin-dashboard/category/attachedFrom")}
             className="bg-blue-50 p-6 rounded-3xl border-r-8 border-blue-600 flex justify-between items-center transition-all hover:bg-blue-100 cursor-pointer">
          <div>
            <p className="text-blue-900 font-black text-lg">ملحقون من وحدات أخرى</p>
            <h3 className="text-4xl font-black text-blue-600">{stats.attachedFrom}</h3>
          </div>
          <Link2 size={50} className="text-blue-200" />
        </div>
      </div>

      {/* الرسم البياني */}
      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 flex flex-col lg:flex-row items-center gap-10">
        <div className="flex-1 space-y-6">
          <h3 className="text-3xl font-black text-[#1a2e2a] border-r-8 border-yellow-600 pr-4">توزيع القوة البشرية</h3>
          <p className="text-gray-500 font-bold text-lg leading-relaxed">
            الرسم التوضيحي يظهر نسب توزيع الرتب داخل الكتيبة بناءً على قواعد البيانات المحدثة.
          </p>
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
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none font-sans">
            <span className="text-4xl font-black text-[#1a2e2a]">{stats.total}</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">إجمالي القوة</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// مكونات المساعدة المنفصلة
const StatCard = ({ title, count, icon, color, onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white p-8 rounded-3xl shadow-lg border-r-8 ${color} flex items-center justify-between cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group`}
  >
    <div>
      <p className="text-gray-500 font-bold mb-1 group-hover:text-[#1a2e2a]">{title}</p>
      <h3 className="text-4xl font-black text-[#1a2e2a]">{count}</h3>
    </div>
    <div className="opacity-10 text-[#1a2e2a] group-hover:opacity-100 group-hover:text-yellow-600 transition-all">{icon}</div>
  </div>
);

const LegendItem = ({ color, label, count }) => (
  <div className="flex items-center gap-3 bg-gray-50 px-5 py-3 rounded-2xl border border-gray-100 shadow-sm">
    <span className={`w-4 h-4 ${color} rounded-full`}></span>
    <span className="font-black text-[#1a2e2a]">{label}: {count}</span>
  </div>
);

export default AdminSummary;