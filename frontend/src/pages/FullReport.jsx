import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { 
  User, Shield, Medal, Gavel, Award, 
  MapPin, Phone, Calendar, Star, Printer, 
  Loader2, AlertTriangle, Briefcase, ChevronRight
} from "lucide-react";

const FullReport = () => {
  const { id } = useParams();
  const [soldier, setSoldier] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFullData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/soldier/full-report/${id}`);
        if (res.data.success) {
          setSoldier(res.data.soldier);
        }
      } catch (err) {
        console.error("خطأ في جلب البيانات:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFullData();
  }, [id]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="animate-spin text-[#1a2e2a]" size={60} />
    </div>
  );

  if (!soldier) return <div className="text-center p-20 font-black text-red-600">⚠️ خطأ: لم يتم العثور على السجل</div>;

  return (
    <div className="p-4 md:p-10 text-right font-sans bg-gray-100 min-h-screen print:bg-white print:p-0" dir="rtl">
      
      {/* CSS مخصص للتحكم في شكل الورقة عند الطباعة ✅ */}
      <style>
        {`
          @media print {
            nav, .sidebar, button, .print-hidden {
              display: none !important;
            }
            .report-container {
              margin: 0 !important;
              padding: 0 !important;
              max-width: 100% !important;
              background: white !important;
            }
            .report-card {
              border: 1px solid #000 !important;
              box-shadow: none !important;
              border-radius: 0 !important;
            }
            @page {
              size: A4;
              margin: 1.5cm;
            }
          }
        `}
      </style>

      <div className="max-w-6xl mx-auto space-y-6 report-container">
        
        {/* شريط الأدوات العلوي - يختفي عند الطباعة */}
        <div className="flex justify-between items-center print:hidden mb-4">
          <h2 className="text-[#1a2e2a] font-black text-xl flex items-center gap-2">
            <Shield size={24} /> معاينة البيان الرسمي
          </h2>
          <button 
            onClick={() => window.print()} 
            className="bg-[#1a2e2a] text-yellow-500 px-10 py-4 rounded-2xl font-black flex items-center gap-3 shadow-xl hover:bg-black transition-all"
          >
            <Printer size={24} /> تنفيذ أمر الطباعة
          </button>
        </div>

        {/* جسم التقرير الرئيسي */}
        <div className="bg-white p-8 rounded-[3rem] shadow-2xl border-2 border-gray-100 report-card relative overflow-hidden">
          
          {/* ترويسة التقرير الرسمية (Header) ✅ */}
          <div className="flex justify-between items-start border-b-4 border-[#1a2e2a] pb-6 mb-8">
            <div className="text-right font-black text-lg space-y-1">
              <p>قوات الحرس الجمهوري</p>
              <p>الكتيبة الخامسة</p>
              <p className="text-sm font-bold text-gray-500">منظومة السجلات الرقمية</p>
            </div>
            <div className="text-center">
              <Shield size={60} className="text-[#1a2e2a] mx-auto mb-2" />
              <h1 className="text-2xl font-black underline decoration-double underline-offset-8">بيان حالة مقاتل</h1>
            </div>
            <div className="text-left font-bold text-sm text-gray-400 space-y-1">
              <p>تاريخ الاستخراج: {new Date().toLocaleDateString('ar-EG')}</p>
              <p>رقم السجل الرقمي: {soldier._id.slice(-6).toUpperCase()}</p>
            </div>
          </div>

          {/* الكارت التعريفي المدمج في التقرير */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-10 bg-gray-50 p-6 rounded-3xl border border-gray-200">
            <div className="w-44 h-52 bg-white border-4 border-[#1a2e2a] rounded-2xl overflow-hidden shadow-md">
              {soldier.image ? (
                <img src={soldier.image} alt={soldier.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300"><User size={60} /></div>
              )}
            </div>
            <div className="flex-1 text-center md:text-right space-y-2">
              <h2 className="text-3xl font-black text-[#1a2e2a]">{soldier.name}</h2>
              <div className="grid grid-cols-2 gap-y-2 text-lg">
                <p className="font-bold">الرتبة: <span className="font-black">{soldier.rank}</span></p>
                <p className="font-bold">الرقم العسكري: <span className="font-black tracking-widest">{soldier.militaryId}</span></p>
                <p className="font-bold">التخصص: <span className="font-black">{soldier.specialization}</span></p>
                <p className="font-bold">السرية: <span className="font-black">{soldier.companyPlatoon}</span></p>
              </div>
            </div>
          </div>

          {/* شبكة البيانات التفصيلية */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            
            {/* البيانات العسكرية */}
            <div className="space-y-4">
              <h3 className="font-black text-[#1a2e2a] border-r-4 border-yellow-600 pr-3 mb-4 italic text-xl">أولاً: بيانات الخدمة</h3>
              <div className="grid grid-cols-1 gap-2 bg-white rounded-xl">
                <InfoItem label="نوع الخدمة" value={soldier.serviceType} />
                <InfoItem label="مدة الخدمة" value={soldier.serviceDuration} />
                <InfoItem label="تاريخ الالتحاق" value={soldier.joinDate} />
                <InfoItem label="تاريخ التسريح" value={soldier.dischargeDate} />
                <InfoItem label="منطقة التجنيد" value={soldier.recruitmentArea} />
                <InfoItem label="الرقم الثلاثي" value={soldier.tripleNumber} />
                <InfoItem label="مأمورية إلى" value={soldier.missionTo} />
              </div>
            </div>

            {/* البيانات الشخصية */}
            <div className="space-y-4">
              <h3 className="font-black text-[#1a2e2a] border-r-4 border-yellow-600 pr-3 mb-4 italic text-xl">ثانياً: البيانات الاجتماعية</h3>
              <div className="grid grid-cols-1 gap-2">
                <InfoItem label="العنوان السكني" value={soldier.address} />
                <InfoItem label="رقم الهاتف" value={soldier.phone} />
                <InfoItem label="الحالة الاجتماعية" value={soldier.socialStatus} />
                <InfoItem label="المؤهل الدراسي" value={soldier.education} />
                <InfoItem label="المهنة قبل التجنيد" value={soldier.civilianJob} />
              </div>
            </div>
          </div>

          {/* قسم الجزاءات والفرق - عرض كامل */}
          <div className="space-y-8 mb-20">
            {/* الجزاءات */}
            <div className="border-2 border-gray-100 rounded-3xl p-6">
              <h3 className="font-black text-red-800 flex items-center gap-2 mb-4"><Gavel size={20}/> سجل الانضباط والجزاءات</h3>
              {soldier.careerHistory?.penalties?.length > 0 ? (
                <div className="space-y-4">
                  {soldier.careerHistory.penalties.map((p, idx) => (
                    <div key={idx} className="bg-gray-50 p-4 rounded-xl border-r-4 border-red-600 text-sm">
                      <p className="font-black mb-1">بتاريخ {p.date} - {p.penaltyType} (بند أوامر {p.orderNumber}):</p>
                      <p className="text-gray-600 leading-relaxed font-bold italic">"{p.details}"</p>
                      <p className="text-[10px] text-gray-400 mt-2">الآمر: {p.issuingOfficer?.rank} / {p.issuingOfficer?.name}</p>
                    </div>
                  ))}
                </div>
              ) : <p className="text-center font-bold text-green-600">لا يوجد جزاءات مسجلة</p>}
            </div>

            {/* الفرق التعليمية */}
            <div className="border-2 border-gray-100 rounded-3xl p-6">
              <h3 className="font-black text-blue-800 flex items-center gap-2 mb-4"><Award size={20}/> الفرق التعليمية والدورات</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {soldier.careerHistory?.courses?.map((c, idx) => (
                  <div key={idx} className="bg-blue-50 p-3 rounded-xl border-r-4 border-blue-600 text-sm font-black">
                    {c.courseName} - {c.place} 
                    <p className="text-[10px] text-blue-400">من {c.fromDate} إلى {c.toDate} (بند {c.orderNumber})</p>
                  </div>
                )) || <p className="text-center font-bold text-gray-400">لا يوجد فرق مسجلة</p>}
              </div>
            </div>
          </div>

          {/* قسم التوقيعات (Signature Section) ✅ */}
          <div className="mt-20 grid grid-cols-2 gap-20 text-center font-black pb-10">
            <div className="space-y-16">
              <p className="text-lg underline underline-offset-4">توقيع مساعد تعليم</p>
              <div className="pt-4 italic text-gray-300">..................................................</div>
            </div>
            <div className="space-y-16">
              <p className="text-lg underline underline-offset-4">توقيع قائد الكتيبة</p>
              <div className="pt-4 italic text-gray-300">..................................................</div>
            </div>
          </div>

          {/* تذييل الصفحة للطباعة فقط */}
          <div className="absolute bottom-2 left-0 right-0 text-center text-[8px] text-gray-300 font-bold hidden print:block">
            طُبع بواسطة منظومة الإدارة الرقمية - الكتيبة الخامسة - {new Date().getFullYear()}
          </div>

        </div>
      </div>
    </div>
  );
};

// مكون عرض المعلومة بشكل رسمي
const InfoItem = ({ label, value }) => (
  <div className="flex justify-between border-b border-gray-100 py-2 text-sm px-2 hover:bg-gray-50 transition-colors">
    <span className="text-gray-400 font-black">{label}:</span>
    <span className="font-black text-[#1a2e2a]">{value || "---"}</span>
  </div>
);

export default FullReport;