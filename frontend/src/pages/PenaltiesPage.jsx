import React, { useState, useEffect } from "react";
import axios from "axios";
import { AlertTriangle, User, Calendar, ShieldAlert, FileText } from "lucide-react";

const PenaltiesPage = () => {
  const [soldiers, setSoldiers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPenalties = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/soldier/penalties-list");
        if (res.data.success) setSoldiers(res.data.list);
      } catch (err) {
        console.error("خطأ في جلب الجزاءات");
      } finally {
        setLoading(false);
      }
    };
    fetchPenalties();
  }, []);

  return (
    <div className="p-8 text-right font-sans" dir="rtl">
      <div className="bg-red-900 p-8 rounded-[2.5rem] shadow-2xl border-b-8 border-red-600 mb-10 flex justify-between items-center text-white">
        <div>
          <h2 className="text-4xl font-black italic flex items-center gap-4">
            <ShieldAlert size={45} className="text-red-400" /> سجل الجزاءات والانضباط
          </h2>
          <p className="text-red-200 font-bold mt-2">عرض الأفراد الصادر بحقهم عقوبات انضباطية</p>
        </div>
        <div className="bg-white/10 px-6 py-4 rounded-3xl border border-white/20">
          <span className="text-5xl font-black text-red-400">{soldiers.length}</span>
          <span className="text-xs block font-bold">فرد مجاز</span>
        </div>
      </div>

      <div className="space-y-6">
        {soldiers.map((s) => (
          <div key={s._id} className="bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-red-100">
            {/* رأس الكارت: بيانات الجندي */}
            <div className="bg-red-50 p-4 border-b flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="bg-red-900 text-white p-3 rounded-2xl font-black">{s.rank}</div>
                <h3 className="text-xl font-black text-red-900">{s.name}</h3>
                <span className="text-gray-500 font-bold tracking-widest text-sm">رقم عسكري: {s.militaryId}</span>
              </div>
            </div>

            {/* عرض الجزاءات (Paragraph الطويل) */}
            <div className="p-6 space-y-4">
              {s.careerHistory?.penalties?.map((p, idx) => (
                <div key={idx} className="bg-gray-50 p-6 rounded-2xl border-r-8 border-red-600 relative group">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-xs font-black text-gray-400 italic">
                    <span className="flex items-center gap-1"><Calendar size={14}/> تاريخ العقوبة: {p.date}</span>
                    <span className="flex items-center gap-1"><FileText size={14}/> بند أوامر: {p.orderNumber} (بتاريخ {p.orderDate})</span>
                    <span className="text-red-700">نوع العقوبة: {p.penaltyType}</span>
                  </div>
                  
                  {/* نص العقوبة الكبير ✅ */}
                  <h4 className="font-black text-[#1a2e2a] mb-2 underline decoration-red-200">نص العقوبة التفصيلي:</h4>
                  <p className="text-gray-700 leading-relaxed font-bold text-lg whitespace-pre-wrap mb-4 bg-white p-4 rounded-xl border border-red-50">
                    {p.details}
                  </p>

                  {/* الضابط الآمر ✅ */}
                  <div className="flex justify-end pt-4 border-t border-dashed border-red-200">
                    <div className="text-left">
                      <p className="text-xs text-gray-400 font-bold">الضابط الآمر بالعقوبة:</p>
                      <p className="font-black text-red-900 uppercase">
                        {p.issuingOfficer?.rank} / {p.issuingOfficer?.name}
                      </p>
                      <p className="text-[10px] font-black italic text-gray-500">{p.issuingOfficer?.job}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {soldiers.length === 0 && !loading && (
          <div className="text-center p-20 bg-green-50 rounded-[3rem] border-4 border-dashed border-green-200">
            <h3 className="text-2xl font-black text-green-700">لا يوجد أفراد مجازين حالياً (السجل نظيف) ✅</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default PenaltiesPage;