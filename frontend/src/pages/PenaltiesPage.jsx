import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  AlertTriangle, User, Calendar, ShieldAlert, FileText, Edit3, Loader2, Clock 
} from "lucide-react";

const PenaltiesPage = () => {
  const navigate = useNavigate();
  const [soldiers, setSoldiers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPenalties = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/soldier/penalties-list");
        if (res.data.success) setSoldiers(res.data.list);
      } catch (err) {
        console.error("خطأ في جلب سجل الجزاءات");
      } finally {
        setLoading(false);
      }
    };
    fetchPenalties();
  }, []);

  const handleEditSoldier = (soldier) => {
    navigate("/admin-dashboard/career-data", { 
      state: { editMode: true, soldierData: soldier, militaryId: soldier.militaryId } 
    });
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="animate-spin text-red-600" size={60} />
    </div>
  );

  return (
    <div className="p-8 text-right font-sans bg-gray-100 min-h-screen" dir="rtl">
      
      <div className="bg-red-900 p-8 rounded-[3rem] shadow-2xl border-b-8 border-red-600 mb-10 flex justify-between items-center text-white">
        <div>
          <h2 className="text-4xl font-black italic flex items-center gap-4">
            <ShieldAlert size={45} className="text-red-400" /> سجل الانضباط العسكري
          </h2>
          <p className="text-red-200 font-bold mt-2">عرض الأفراد الصادر بحقهم عقوبات سارية ومسجلة</p>
        </div>
        <div className="bg-white/10 px-8 py-5 rounded-[2rem] border border-white/20 text-center shadow-inner">
          <span className="text-6xl font-black text-red-400 block">{soldiers.length}</span>
          <span className="text-sm font-bold">إجمالي المجازين</span>
        </div>
      </div>

      <div className="space-y-8">
        {soldiers.map((s) => (
          <div key={s._id} className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border-2 border-red-100 transition-all hover:shadow-2xl">
            <div className="bg-red-50 p-6 border-b flex justify-between items-center">
              <div className="flex items-center gap-6">
                <div className="bg-red-900 text-white px-6 py-2 rounded-2xl font-black text-lg shadow-md">{s.rank}</div>
                <div>
                  <h3 className="text-2xl font-black text-red-900">{s.name}</h3>
                  <p className="text-gray-500 font-bold text-sm tracking-widest">رقم عسكري: {s.militaryId}</p>
                </div>
              </div>
              <button onClick={() => handleEditSoldier(s)} className="bg-red-600 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-black transition-all shadow-lg">
                <Edit3 size={20} /> تعديل جزاءات الفرد
              </button>
            </div>

            <div className="p-8 space-y-6">
              {s.careerHistory?.penalties?.map((p, idx) => (
                <div key={idx} className="bg-gray-50 p-6 rounded-3xl border-r-[12px] border-red-600 relative shadow-inner">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 text-xs font-black text-gray-500 italic border-b border-red-100 pb-3">
                    <span className="flex items-center gap-2 text-red-800"><Calendar size={14}/> التوقيع: {p.date}</span>
                    <span className="flex items-center gap-2 text-green-700 font-black"><Clock size={14}/> البدء: {p.fromDate}</span>
                    <span className="flex items-center gap-2 text-red-600 font-black"><Clock size={14}/> الانتهاء: {p.toDate}</span>
                    <span className="bg-red-100 text-red-900 px-3 py-1 rounded-lg text-center">{p.penaltyType}</span>
                  </div>
                  <h4 className="font-black text-[#1a2e2a] mb-3 text-lg decoration-red-200">نص العقوبة التفصيلي:</h4>
                  <p className="text-gray-800 leading-relaxed font-bold text-xl whitespace-pre-wrap bg-white p-5 rounded-2xl border border-red-50 shadow-sm">{p.details}</p>
                  <div className="flex justify-end pt-4 border-t border-dashed border-red-200 mt-4">
                    <div className="text-left bg-red-50/50 p-3 rounded-xl border border-red-100">
                      <p className="text-xs text-gray-400 font-bold mb-1">الضابط الآمر بالعقوبة:</p>
                      <p className="font-black text-red-900 text-lg">{p.issuingOfficer?.rank} / {p.issuingOfficer?.name}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {soldiers.length === 0 && !loading && (
          <div className="text-center p-24 bg-green-50 rounded-[4rem] border-8 border-dashed border-green-200">
            <h3 className="text-4xl font-black text-green-700">السجل نظيف تماماً ✅</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default PenaltiesPage;