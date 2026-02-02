import React, { useEffect, useState } from "react";
import axios from "axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { ShieldCheck, Users, Star, Loader2 } from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminSummary = () => {
  const [stats, setStats] = useState({
    officers: 0,
    sergeants: 0,
    soldiers: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // الحصول على التوكن من التخزين المحلي
        const token = localStorage.getItem("token");

        const res = await axios.get("http://127.0.0.1:5000/api/soldier/stats", {
          headers: {
            // إرسال التوكن لتخطي حجز authMiddleware في الباك إند
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.success) {
          setStats({
            officers: res.data.officers || 0,
            sergeants: res.data.sergeants || 0,
            soldiers: res.data.soldiers || 0,
            total: res.data.total || 0,
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
        borderColor: ["#ffffff"],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    cutout: "70%",
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
    },
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#eaeeed]">
        <Loader2 className="animate-spin text-[#1a2e2a]" size={50} />
      </div>
    );
  }

  return (
    <div
      className="space-y-8 animate-in fade-in duration-700 relative z-0 text-right"
      dir="rtl"
    >
      {/* Header القوة البشرية */}
      <div className="bg-[#1a2e2a] p-8 rounded-3xl shadow-2xl border-b-8 border-yellow-600 flex justify-between items-center text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-600 opacity-10 rounded-full -translate-x-16 -translate-y-16"></div>
        <div className="z-10">
          <h2 className="text-4xl font-black italic mb-2 tracking-tighter">
            تمام القوة البشرية
          </h2>
          <p className="text-yellow-500 font-bold uppercase tracking-widest text-sm">
            إجمالي السجلات المسجلة بالمنظومة
          </p>
        </div>
        <div className="text-center bg-white/10 p-4 rounded-2xl border border-white/20 z-10 min-w-[120px]">
          <span className="block text-5xl font-black text-yellow-500">
            {stats.total}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
            محارب
          </span>
        </div>
      </div>

      {/* كروت الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="إجمالي الضباط"
          count={stats.officers}
          icon={<Star size={45} />}
          color="border-yellow-600"
          iconColor="text-yellow-600"
        />
        <StatCard
          title="إجمالي ضباط الصف"
          count={stats.sergeants}
          icon={<ShieldCheck size={45} />}
          color="border-[#1a2e2a]"
          iconColor="text-[#1a2e2a]"
        />
        <StatCard
          title="إجمالي الجنود"
          count={stats.soldiers}
          icon={<Users size={45} />}
          color="border-green-600"
          iconColor="text-green-600"
        />
      </div>

      {/* تحليل التوزيع والرسم البياني */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-white p-10 rounded-3xl shadow-2xl border border-gray-100 relative">
        <div className="space-y-6">
          <h3 className="text-3xl font-black text-[#1a2e2a] border-r-8 border-yellow-600 pr-4 italic">
            تحليل توزيع القوة
          </h3>
          <p className="text-gray-600 leading-relaxed font-bold text-lg">
            يوضح هذا الرسم البياني النسبة المئوية لكل فئة داخل الكتيبة ٥. يتم
            تحديث البيانات لحظياً لضمان دقة "التمام اليومي".
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <LegendItem color="bg-yellow-600" label="ضباط" />
            <LegendItem color="bg-[#1a2e2a]" label="صف ضباط" />
            <LegendItem color="bg-green-400" label="جنود" />
          </div>
        </div>

        <div className="relative max-w-[300px] mx-auto group">
          <div className="transition-transform group-hover:scale-105 duration-500">
            <Doughnut data={chartData} options={chartOptions} />
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">
              إجمالي
            </span>
            <span className="text-3xl font-black text-[#1a2e2a]">
              {stats.total}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// مكونات فرعية لتنظيف الكود
const StatCard = ({ title, count, icon, color, iconColor }) => (
  <div
    className={`bg-white p-6 rounded-3xl shadow-xl border-r-8 ${color} flex items-center justify-between transition-all hover:translate-y-[-5px]`}
  >
    <div>
      <p className="text-gray-500 font-bold text-sm mb-1">{title}</p>
      <h3 className="text-3xl font-black text-[#1a2e2a]">{count}</h3>
    </div>
    <div className={`${iconColor} opacity-20`}>{icon}</div>
  </div>
);

const LegendItem = ({ color, label }) => (
  <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
    <span className={`w-3 h-3 ${color} rounded-full shadow-sm`}></span>
    <span className="font-black text-[#1a2e2a] text-sm">{label}</span>
  </div>
);

export default AdminSummary;
