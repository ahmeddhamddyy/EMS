/*
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  User, Shield, Medal, Gavel, Award, MapPin, Phone, Calendar, Star, Printer, 
  Loader2, Heart, Users, Activity, Ruler, UserPlus, Fingerprint, Edit3, Clock, Briefcase
} from "lucide-react";

const FullReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [soldier, setSoldier] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFullData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/soldier/full-report/${id}`);
        if (res.data.success) setSoldier(res.data.soldier);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchFullData();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#1a2e2a]" size={60} /></div>;
  if (!soldier) return <div className="text-center p-20 font-black text-red-600">⚠️ السجل غير موجود</div>;

  const goToEdit = (path) => {
    navigate(path, { state: { editMode: true, soldierData: soldier } });
  };

  return (
    <div className="p-4 md:p-10 text-right font-sans bg-gray-100 min-h-screen print:bg-white print:p-0" dir="rtl">
      
      <style>
        {`
          @media print {
            nav, .sidebar, button, .print-hidden { display: none !important; }
            .report-container { margin: 0 !important; padding: 0 !important; max-width: 100% !important; }
            .report-card { border: 1px solid #000 !important; box-shadow: none !important; border-radius: 0 !important; }
            @page { size: A4; margin: 1cm; }
          }
        `}
      </style>

      <div className="max-w-6xl mx-auto space-y-6 report-container">
        
        <div className="flex justify-between items-center print:hidden mb-4">
          <h2 className="font-black text-[#1a2e2a] flex items-center gap-2">
            <Shield size={24} className="text-yellow-600"/> السجل الرسمي الكامل للمقاتل
          </h2>
          <button onClick={() => window.print()} className="bg-[#1a2e2a] text-yellow-500 px-8 py-3 rounded-2xl font-black flex items-center gap-3 shadow-xl hover:bg-black transition-all">
            <Printer size={24} /> طباعة البيان
          </button>
        </div>

        <div className="bg-[#1a2e2a] text-white p-8 rounded-[3rem] shadow-2xl border-b-8 border-yellow-600 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden report-card">
          <button onClick={() => goToEdit("/admin-dashboard/military-data")} className="absolute top-6 left-6 bg-yellow-600 p-3 rounded-full hover:bg-yellow-500 transition-all print:hidden shadow-lg z-20 group">
            <Edit3 size={20} className="text-[#1a2e2a]" />
          </button>
          <div className="w-44 h-52 border-4 border-yellow-500 rounded-2xl overflow-hidden bg-white shadow-2xl z-10">
            {soldier.image ? <img src={soldier.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300"><User size={60} /></div>}
          </div>
          <div className="flex-1 z-10">
            <h1 className="text-4xl font-black mb-2">{soldier.name}</h1>
            <div className="grid grid-cols-2 gap-4 text-lg">
              <p className="font-bold">الرتبة: <span className="text-yellow-500 font-black">{soldier.rank}</span></p>
              <p className="font-bold">الرقم العسكري: <span className="text-yellow-500 font-black tracking-widest">{soldier.militaryId}</span></p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <section className="bg-white p-6 rounded-[2.5rem] shadow-lg border-r-8 border-[#1a2e2a]">
            <h3 className="text-xl font-black mb-4 flex items-center gap-2 text-[#1a2e2a] border-b pb-2">
              <Shield size={24} className="text-yellow-600"/> سجل الخدمة والبيانات العسكرية
            </h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <InfoItem label="الفئة" value={soldier.rankCategory} />
              <InfoItem label="السلاح" value={soldier.specialization} />
              <InfoItem label="السرية/الفصيلة" value={soldier.companyPlatoon} />
              <InfoItem label="تاريخ الالتحاق" value={soldier.joinDate} />
              <InfoItem label="تاريخ التسريح" value={soldier.dischargeDate} />
              <InfoItem label="المستوى" value={soldier.warTraining} />
              <InfoItem label="نوع الخدمة" value={soldier.serviceType} />
              <InfoItem label="مركز التجنيد" value={soldier.recruitmentArea} />
            </div>
          </section>

          <section className="bg-white p-6 rounded-[2.5rem] shadow-lg border-r-8 border-teal-800 relative group">
            <button onClick={() => goToEdit("/admin-dashboard/personal-data")} className="absolute top-4 left-4 text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity print:hidden"><Edit3 size={18} /></button>
            <h3 className="text-xl font-black mb-4 flex items-center gap-2 text-teal-900 border-b pb-2"><Fingerprint size={24} className="text-yellow-600"/> البيانات المدنية والبدنية</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <InfoItem label="الرقم القومي" value={soldier.nationalId} />
              <InfoItem label="المؤهل" value={soldier.qualification} />
              <InfoItem label="فصيلة الدم" value={soldier.bloodType} className="text-red-600 font-black" />
              <InfoItem label="الطول/الوزن" value={`${soldier.height || "--"} سم / ${soldier.weight || "--"} كجم`} />
              <InfoItem label="الهاتف" value={soldier.phone} />
              <InfoItem label="العنوان" value={soldier.address} />
              <InfoItem label="المهنة سابقاً" value={soldier.jobBefore} />
              <InfoItem label="محل الميلاد" value={soldier.birthPlace} />
            </div>
          </section>

          <section className="bg-white p-6 rounded-[2.5rem] shadow-lg border-r-8 border-pink-700">
            <h3 className="text-xl font-black mb-4 flex items-center gap-2 text-pink-900 border-b pb-2"><Heart size={24} className="text-pink-600"/> الموقف العائلي والأبناء</h3>
            <div className="mb-4 bg-pink-50 p-4 rounded-xl border border-pink-100">
              <p className="font-black text-xs text-pink-800 mb-1">بيانات الزوجة:</p>
              <div className="grid grid-cols-2 text-xs font-bold gap-2">
                <span>الاسم: {soldier.spouse?.name || "---"}</span>
                <span>تاريخ الزواج: {soldier.spouse?.marriageDate || "---"}</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="font-black text-xs text-purple-800">الأبناء: ({soldier.children?.length || 0})</p>
              {soldier.children?.map((child, i) => (
                <div key={i} className="text-xs bg-purple-50 p-2 rounded-lg border border-purple-100 flex justify-between font-bold">
                  <span>{child.name} ({child.gender})</span>
                  <span>{child.birthDate}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white p-6 rounded-[2.5rem] shadow-lg border-r-8 border-orange-600">
            <h3 className="text-xl font-black mb-4 flex items-center gap-2 text-orange-900 border-b pb-2"><UserPlus size={24} className="text-orange-600"/> أقارب للطوارئ</h3>
            <div className="space-y-2">
              {soldier.relatives?.map((rel, i) => (
                <div key={i} className="bg-orange-50 p-3 rounded-xl text-xs font-bold flex justify-between border border-orange-100">
                  <span>{rel.name} ({rel.relation})</span>
                  <span>{rel.phone}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white p-6 rounded-[2.5rem] shadow-lg border-r-8 border-red-600 relative group lg:col-span-2">
            <button onClick={() => goToEdit("/admin-dashboard/career-data")} className="absolute top-4 left-4 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity print:hidden"><Edit3 size={18} /></button>
            <h3 className="text-xl font-black mb-4 flex items-center gap-2 text-red-900 border-b pb-2"><Gavel size={24} className="text-red-600"/> السجل الانضباطي (الجزاءات)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {soldier.careerHistory?.penalties?.length > 0 ? soldier.careerHistory.penalties.map((p, i) => (
                <div key={i} className="bg-red-50 p-4 rounded-xl border border-red-100">
                  <div className="flex justify-between font-black text-xs mb-2">
                    <span className="text-red-900">{p.penaltyType}</span>
                    <span className="text-gray-500 font-bold flex items-center gap-1"><Clock size={12}/> {p.fromDate} : {p.toDate}</span>
                  </div>
                  <p className="text-sm font-bold italic mb-2 leading-relaxed">"{p.details}"</p>
                  <div className="text-[10px] text-gray-400 border-t pt-2">
                    بند أوامر {p.orderNumber} - الآمر: {p.issuingOfficer?.rank} / {p.issuingOfficer?.name}
                  </div>
                </div>
              )) : <p className="text-center font-bold text-green-600 text-sm py-2 lg:col-span-2">نظيف السجل ✅</p>}
            </div>
          </section>

          <section className="bg-white p-6 rounded-[2.5rem] shadow-lg border-r-8 border-green-700 lg:col-span-2">
            <h3 className="text-xl font-black mb-4 flex items-center gap-2 text-green-900 border-b pb-2"><Star size={24} className="text-yellow-600"/> تقارير الكفاءة السنوية</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {soldier.careerHistory?.efficiencyReports?.map((r, i) => (
                <div key={i} className="bg-green-50 p-4 rounded-xl border border-green-100 shadow-sm">
                  <div className="flex justify-between font-black mb-2 border-b border-green-200 pb-1">
                    <span>عام {r.year}</span>
                    <span className="text-green-800">{r.rating} ({r.percentage}%)</span>
                  </div>
                  <div className="text-[10px] space-y-1 font-bold italic text-gray-600 mt-2">
                    <p>المباشر: {r.directOfficer?.rank} / {r.directOfficer?.name}</p>
                    <p>المصدق: {r.approvingOfficer?.rank} / {r.approvingOfficer?.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        <div className="mt-20 grid grid-cols-2 gap-20 text-center font-black pb-10">
          <div className="space-y-16">
            <p className="text-lg underline underline-offset-8">توقيع مساعد تعليم</p>
            <div className="pt-4 italic text-gray-300">..................................</div>
          </div>
          <div className="space-y-16">
            <p className="text-lg underline underline-offset-8">توقيع قائد الكتيبة</p>
            <div className="pt-4 italic text-gray-300">..................................</div>
          </div>
        </div>

      </div>
    </div>
  );
};

const InfoItem = ({ label, value, className = "" }) => (
  <div className={`flex justify-between border-b border-gray-100 py-2 text-xs ${className}`}>
    <span className="text-gray-400 font-bold">{label}:</span>
    <span className="font-black text-[#1a2e2a]">{value || "---"}</span>
  </div>
);

export default FullReport;
*/
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Printer, Loader2, ArrowRight } from "lucide-react";

const FullReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [soldier, setSoldier] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFullData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/soldier/full-report/${id}`);
        if (res.data.success) setSoldier(res.data.soldier);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchFullData();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-black" size={40} /></div>;
  if (!soldier) return <div className="text-center p-20 font-bold">⚠️ السجل غير موجود</div>;

  return (
    <div className="min-h-screen bg-gray-600 p-0 md:p-10 print:bg-white print:p-0" dir="rtl">
      
      <style>
        {`
          @media print {
            nav, .sidebar, aside, header, .no-print, [class*="sidebar"], [class*="Sidebar"] { 
              display: none !important; 
              width: 0 !important;
            }
            body, html, #root, main { 
              margin: 0 !important; 
              padding: 0 !important; 
              width: 210mm !important;
              background: white !important;
            }
            .report-page { 
              position: fixed !important;
              top: 0 !important;
              right: 0 !important;
              width: 210mm !important; 
              height: 297mm !important; 
              padding: 15mm !important;
              margin: 0 !important;
              border: none !important;
              box-shadow: none !important;
              z-index: 9999 !important;
            }
            @page { size: A4; margin: 0; }
          }

          .report-page {
            width: 210mm;
            height: 297mm;
            background: white;
            padding: 15mm;
            margin: auto;
            position: relative;
            color: black;
          }

          .bg-logo {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 400px;
            opacity: 0.04;
            z-index: 0;
            pointer-events: none;
          }

          .main-content { position: relative; z-index: 10; width: 100%; }

          table { width: 100%; border-collapse: collapse; margin-top: 10px; table-layout: fixed; }
          th, td { border: 1px solid black !important; padding: 6px 10px; text-align: right; }
          
          .label { background-color: #f2f2f2 !important; font-weight: bold; width: 22%; font-size: 13px; }
          .value { font-weight: 900; font-size: 15px; }
          
          .section-title {
            border: 1px solid black;
            background: #e0e0e0 !important;
            text-align: center;
            font-weight: bold;
            padding: 4px;
            margin-top: 15px;
            font-size: 14px;
          }
          .header-table { border: none !important; }
          .header-table td { border: none !important; }
        `}
      </style>

      <div className="max-w-[210mm] mx-auto mb-4 flex justify-between no-print p-4 bg-white shadow-lg rounded-xl">
        <button onClick={() => navigate(-1)} className="font-bold flex items-center gap-2 text-[#1a2e2a]">
           <ArrowRight size={18}/> العودة للمنظومة
        </button>
        <button onClick={() => window.print()} className="bg-black text-yellow-500 px-10 py-2 rounded-lg font-black flex items-center gap-2">
          <Printer size={20} /> طباعة البيان الرسمي
        </button>
      </div>

      <div className="report-page shadow-2xl border border-gray-400 print:border-none">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Emblem_of_the_Egyptian_Republican_Guard.svg/1200px-Emblem_of_the_Egyptian_Republican_Guard.svg.png" className="bg-logo" alt="logo" />

        <div className="main-content flex flex-col h-full">
          
          <table className="header-table">
            <tbody>
              <tr>
                <td style={{width: '33%'}} className="text-center font-bold">
                  <p>القوات المسلحة</p>
                  <p>قوات الحرس الجمهوري</p>
                  <p>الكتيبةالخامسه </p>
                </td>
                <td style={{width: '34%'}} className="text-center">
                  <h1 className="text-2xl font-black underline">بيان حالة مقاتل</h1>
                </td>
                <td style={{width: '33%'}} className="flex justify-center">
                  {/* الحل النهائي للصورة: أبعاد طبيعية وملء احترافي ✅ */}
                  <div className="w-60 h-20 border-2 border-black bg-white flex items-center justify-center overflow-hidden shadow-sm">
                    {soldier.image ? (
                      <img 
                        src={soldier.image} 
                        className="w-full h-full object-cover object-top" 
                        style={{objectPosition: 'center 15%'}}
                        alt="soldier" 
                      />
                    ) :  (
                      <span className="text-[10px]">بدون صورة</span>
                    )}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="section-title">أولاً: البيانات الأساسية والعسكرية</div>
          <table>
            <tbody>
              <tr>
                <td className="label">الاســم:</td>
                <td colSpan="3" className="value pr-4 font-black">{soldier.name}</td>
              </tr>
              <tr>
                <td className="label">الرتبة:</td>
                <td className="value">{soldier.rank}</td>
                <td className="label">الرقم العسكري:</td>
                <td className="value tracking-widest">{soldier.militaryId}</td>
              </tr>
              <tr>
                <td className="label">السلاح:</td>
                <td className="value">{soldier.specialization}</td>
                <td className="label">السرية:</td>
                <td className="value">{soldier.companyPlatoon}</td>
              </tr>
              <tr>
                <td className="label">تاريخ الضم:</td>
                <td className="value">{soldier.unitJoinDate || soldier.joinDate}</td>
                <td className="label">تاريخ التسريح:</td>
                <td className="value text-red-600 font-black">{soldier.dischargeDate}</td>
              </tr>
              <tr>
                <td className="label">الرقم القومي:</td>
                <td className="value">{soldier.nationalId}</td>
                <td className="label">فصيلة الدم:</td>
                <td className="value font-black text-red-700">{soldier.bloodType}</td>
              </tr>
            </tbody>
          </table>

          <div className="section-title">ثانياً: سجل الجزاءات (الانضباط)</div>
          <table className="text-center">
            <thead>
              <tr className="bg-gray-100">
                <th style={{width: '15%'}}>تاريخ الجزاء</th>
                <th style={{width: '15%'}}>العقوبة</th>
                <th>نص الجزاء الملحق</th>
                <th style={{width: '12%'}}>بند الأوامر</th>
              </tr>
            </thead>
            <tbody>
              {soldier.careerHistory?.penalties?.length > 0 ? (
                soldier.careerHistory.penalties.slice(-5).map((p, i) => (
                  <tr key={i}>
                    <td>{p.date}</td>
                    <td className="font-bold">{p.penaltyType}</td>
                    <td className="text-right text-[11px] pr-2 leading-tight">{p.details}</td>
                    <td>{p.orderNumber}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="py-4 font-bold text-green-700 italic text-[14px]">السجل الانضباطي نظيف تماماً ✅</td></tr>
              )}
            </tbody>
          </table>

          <div className="flex gap-0 mt-2">
             <table style={{width: '50%', margin: 0}}>
                <thead><tr><th colSpan="3" className="bg-gray-100 border-b-0 text-[12px]">تقارير الكفاءة السنوية</th></tr></thead>
                <tbody>
                   {soldier.careerHistory?.efficiencyReports?.map((r, i) => (
                      <tr key={i} className="text-center text-[11px]"><td>{r.year}</td><td>{r.percentage}%</td><td className="font-bold">{r.rating}</td></tr>
                   ))}
                </tbody>
             </table>
             <table style={{width: '50%', margin: 0}}>
                <thead><tr><th colSpan="2" className="bg-gray-100 border-b-0 text-[12px]">الفرق الحتمية / التعليمية</th></tr></thead>
                <tbody>
                   {soldier.careerHistory?.courses?.map((c, i) => (
                      <tr key={i} className="text-center text-[11px]"><td>{c.courseName}</td><td className="font-bold">{c.place}</td></tr>
                   ))}
                </tbody>
             </table>
          </div>

          {/* التوقيعات مضبوطة في مكانها الصحيح */}
          <div className="mt-auto pt-12 grid grid-cols-2 text-center pb-8">
            <div className="font-bold">
              <p className=" mb-12">مساعد تعليم /</p>
              <p>( ........................................ )</p>
            </div>
            <div className="font-bold">
              <p className=" mb-12 text-red-800">قائد الكتيبة ٥  </p>
              <p>عقيد / ( ............................ )</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FullReport;