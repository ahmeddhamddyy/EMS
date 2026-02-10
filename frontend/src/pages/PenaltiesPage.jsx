import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  ShieldAlert, Edit3, Loader2, Clock, Calendar, CheckCircle, FileText, ShieldCheck
} from "lucide-react";

const PenaltiesPage = () => {
  const navigate = useNavigate();
  const [soldiers, setSoldiers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. جلب البيانات مع إضافة تكتيك منع الكاش (Cache Buster)
  useEffect(() => {
    const fetchPenalties = async () => {
      try {
        // أضفنا t=Date.now لضمان أن السيرفر يعطينا أحدث داتا دائماً ✅
        const res = await axios.get(`http://127.0.0.1:5000/api/soldier/penalties-list?t=${Date.now()}`);
        if (res.data.success) {
          setSoldiers(res.data.list);
        }
      } catch (err) {
        console.error("❌ خطأ في الاتصال بالسيرفر:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPenalties();
  }, []);

  // 2. دالة إلغاء الجزاء المحسنة
  const handleCancelPenalty = async (soldierId, penaltyIndex) => {
    if (!window.confirm("هل أنت متأكد من رفع الجزاء نهائياً؟")) return;

    try {
      console.log("Sending ID:", soldierId, "Index:", penaltyIndex);
      
      const res = await axios.put("http://127.0.0.1:5000/api/soldier/cancel-penalty", {
        soldierId: soldierId, // ده الـ _id التلقائي من MongoDB
        penaltyIndex: penaltyIndex
      });

      if (res.data.success) {
        // تحديث القائمة فوراً في الواجهة
        setSoldiers(prev => prev.map(s => {
          if (s._id === soldierId) {
            const updatedPenalties = [...s.careerHistory.penalties];
            updatedPenalties[penaltyIndex].isCancelled = true;
            return { ...s, careerHistory: { ...s.careerHistory, penalties: updatedPenalties } };
          }
          return s;
        }));
        alert("تم الحفظ بنجاح في قاعدة البيانات ✅");
      }
    } catch (err) {
      console.error(err);
      alert("❌ فشل الاتصال بالسيرفر. تأكد من تشغيل الـ Backend");
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="animate-spin text-red-600" size={60} />
    </div>
  );

  return (
    <div className="p-8 text-right font-sans bg-gray-100 min-h-screen" dir="rtl">
      
      {/* Header المنظومة */}
      <div className="bg-red-900 p-8 rounded-[3rem] shadow-2xl border-b-8 border-red-600 mb-10 flex justify-between items-center text-white relative overflow-hidden">
        <div className="z-10">
          <h2 className="text-4xl font-black italic flex items-center gap-4">
            <ShieldAlert size={45} className="text-red-400" /> سجل الانضباط العسكري
          </h2>
          <p className="text-red-200 font-bold mt-2">عرض العقوبات المسجلة (تحديث لحظي من القاعدة)</p>
        </div>
        <div className="bg-white/10 px-8 py-5 rounded-[2rem] border border-white/20 text-center shadow-inner z-10 backdrop-blur-sm">
          <span className="text-6xl font-black text-red-400 block">{soldiers.length}</span>
          <span className="text-sm font-bold uppercase">إجمالي الحالات</span>
        </div>
      </div>

      <div className="space-y-12">
        {soldiers.map((s) => (
          <div key={s._id} className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border-2 border-red-100 transition-all hover:shadow-2xl">
            
            <div className="bg-red-50 p-6 border-b-2 border-red-100 flex justify-between items-center">
              <div className="flex items-center gap-6">
                <div className="bg-red-900 text-white px-6 py-2 rounded-2xl font-black text-lg shadow-md">{s.rank}</div>
                <div>
                  <h3 className="text-2xl font-black text-red-900">{s.name}</h3>
                  <p className="text-gray-500 font-bold text-sm italic">رقم عسكري: {s.militaryId}</p>
                </div>
              </div>
              <button 
                onClick={() => navigate("/admin-dashboard/career-data", { state: { editMode: true, soldierData: s, militaryId: s.militaryId } })} 
                className="bg-gray-800 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-black transition-all"
              >
                <Edit3 size={20} /> تعديل السجل
              </button>
            </div>

            <div className="p-8 space-y-10">
              {/* ملاحظة: نقوم بعرض الجزاءات غير الملغية أولاً أو تمييز الملغي بشكل واضح */}
              {s.careerHistory?.penalties?.map((p, idx) => (
                <div key={idx} className={`p-8 rounded-[2rem] border-r-[15px] relative shadow-inner transition-all duration-500 ${
                  p.isCancelled ? "bg-green-50/30 border-green-500 opacity-60 grayscale-[0.5]" : "bg-gray-50 border-red-600 shadow-md"
                }`}>
                  
                  {/* Status Tag */}
                  <div className={`absolute -top-5 right-8 px-6 py-2 rounded-full font-black text-sm shadow-lg z-30 border-2 ${
                    p.isCancelled ? "bg-green-600 text-white border-green-200" : "bg-red-700 text-white border-red-200"
                  }`}>
                    {p.isCancelled ? "✅ تم رفع الجزاء" : `⚖️ جزاء ساري: ${p.penaltyType}`}
                  </div>

                  {!p.isCancelled && (
                    <button 
                      onClick={() => handleCancelPenalty(s._id, idx)}
                      className="absolute left-6 top-6 bg-white text-red-600 border-2 border-red-100 px-4 py-2 rounded-xl font-black text-xs hover:bg-red-600 hover:text-white transition-all z-20 shadow-sm"
                    >
                      🚫 رفع الجزاء فوراً
                    </button>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-4">
                    <div className="flex flex-col gap-1 border-l border-gray-200 pl-4">
                      <span className="text-gray-400 text-[10px] font-black uppercase tracking-tighter">تاريخ الواقعة</span>
                      <span className="flex items-center gap-2 text-red-900 font-black"><Calendar size={16}/> {p.date}</span>
                    </div>
                    <div className="flex flex-col gap-1 border-l border-gray-200 pl-4">
                      <span className="text-gray-400 text-[10px] font-black uppercase tracking-tighter">بداية العقوبة</span>
                      <span className="flex items-center gap-2 text-green-700 font-black"><Clock size={16}/> {p.fromDate}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-gray-400 text-[10px] font-black uppercase tracking-tighter">نهاية العقوبة</span>
                      <span className="flex items-center gap-2 text-red-600 font-black"><Clock size={16}/> {p.toDate}</span>
                    </div>
                  </div>

                  <div className="relative">
                    <h4 className="font-black text-[#1a2e2a] mb-4 text-lg flex items-center gap-2">
                      <FileText size={20} className="text-red-600" /> النص التفصيلي:
                    </h4>
                    <p className="text-gray-800 leading-relaxed font-bold text-xl whitespace-pre-wrap bg-white p-6 rounded-3xl border border-gray-100">
                      {p.details}
                    </p>
                  </div>
                  
                  <div className="flex justify-end pt-6 mt-6 border-t border-dashed border-gray-300">
                    <div className="bg-red-50 px-6 py-3 rounded-2xl border border-red-100 text-left">
                      <span className="text-[10px] text-gray-400 block font-black mb-1">الآمر بالعقوبة:</span>
                      <span className="font-black text-red-900 text-lg">{p.issuingOfficer?.rank} / {p.issuingOfficer?.name}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {soldiers.length === 0 && !loading && (
          <div className="text-center p-24 bg-green-50 rounded-[4rem] border-8 border-dashed border-green-200 flex flex-col items-center gap-6">
            <ShieldCheck size={100} className="text-green-500" />
            <h3 className="text-4xl font-black text-green-700">السجل نظيف تماماً ✅</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default PenaltiesPage;