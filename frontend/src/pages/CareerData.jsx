import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Medal, Gavel, Award, ClipboardCheck, Plus, 
  Trash2, Save, Loader2, Calendar, Star, Edit3 
} from "lucide-react";

const CareerData = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const passedData = location.state || {};
  const militaryId = passedData.militaryId;
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const officerRanks = ["ملازم", "ملازم أول", "نقيب", "رائد", "مقدم", "عقيد", "عميد", "لواء"];

  const [penalties, setPenalties] = useState([]);
  const [courses, setCourses] = useState([]);
  const [efficiencyReports, setEfficiencyReports] = useState([]);

  useEffect(() => {
    if (passedData.editMode && passedData.soldierData) {
      setIsEditMode(true);
      const ch = passedData.soldierData.careerHistory;
      if (ch) {
        setPenalties(ch.penalties || []);
        setCourses(ch.courses || []);
        setEfficiencyReports(ch.efficiencyReports || []);
      }
    }
  }, [passedData]);

  const addPenalty = () => {
    setPenalties([...penalties, { 
      date: "", fromDate: "", toDate: "", details: "", penaltyType: "", orderNumber: "", orderDate: "",
      issuingOfficer: { rank: "ملازم", name: "", job: "" } 
    }]);
  };

  const addCourse = () => {
    setCourses([...courses, { courseName: "", place: "", fromDate: "", toDate: "", orderNumber: "" }]);
  };

  const addEfficiency = () => {
    setEfficiencyReports([...efficiencyReports, { 
      year: new Date().getFullYear(), percentage: "", rating: "امتياز", 
      directOfficer: { rank: "نقيب", name: "" }, 
      approvingOfficer: { rank: "مقدم", name: "" } 
    }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/soldier/update-career", {
        militaryId,
        penalties,
        courses,
        efficiencyReports
      });
      if (res.data.success) {
        alert(isEditMode ? "✅ تم تحديث السجل بنجاح" : "✅ تم حفظ السجل بنجاح");
        navigate(`/admin-dashboard/full-report/${militaryId}`);
      }
    } catch (err) {
      alert("❌ خطأ في عملية الحفظ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 text-right font-sans bg-gray-50 min-h-screen" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className={`${isEditMode ? 'bg-blue-900' : 'bg-[#1a2e2a]'} p-8 rounded-[2.5rem] border-b-8 border-yellow-600 text-white shadow-2xl flex justify-between items-center transition-all`}>
          <div>
            <h2 className="text-3xl font-black italic flex items-center gap-4">
              {isEditMode ? <Edit3 className="text-yellow-500" size={40} /> : <Medal className="text-yellow-500" size={40} />}
              {isEditMode ? "تعديل السجل الوظيفي والانضباطي" : "السجل الوظيفي والتقارير السنوية"}
            </h2>
            <p className="mt-2 text-yellow-500 font-bold">رقم عسكري: {militaryId}</p>
          </div>
          <ClipboardCheck size={60} className="opacity-20" />
        </div>

        {/* 1. سجل الجزاءات */}
        <section className="bg-white p-8 rounded-[2.5rem] shadow-lg border-2 border-red-50">
          <div className="flex justify-between items-center border-b-4 border-red-600 pb-4 mb-6">
            <h3 className="text-2xl font-black text-red-900 flex items-center gap-2"><Gavel /> سجل الجزاءات</h3>
            <button type="button" onClick={addPenalty} className="bg-red-600 text-white px-5 py-2 rounded-2xl font-black flex items-center gap-2 hover:bg-red-700 transition-all shadow-md">
              <Plus size={20} /> إضافة جزاء
            </button>
          </div>
          {penalties.map((p, i) => (
            <div key={i} className="mb-8 p-6 bg-red-50/30 rounded-3xl border-2 border-red-100 relative shadow-sm">
              <button onClick={() => setPenalties(penalties.filter((_, idx) => idx !== i))} className="absolute left-4 top-4 text-red-400 hover:text-red-700 transition-colors"><Trash2 size={24}/></button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                <div>
                  <label className="text-[10px] font-black text-red-800 block mb-1">تاريخ التوقيع</label>
                  <input type="date" className="w-full p-2 rounded-xl border-2 font-bold text-sm" value={p.date} onChange={(e) => {const n = [...penalties]; n[i].date = e.target.value; setPenalties(n);}} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-green-700 block mb-1">تاريخ البدء ✅</label>
                  <input type="date" className="w-full p-2 rounded-xl border-2 font-bold text-sm bg-green-50/50" value={p.fromDate} onChange={(e) => {const n = [...penalties]; n[i].fromDate = e.target.value; setPenalties(n);}} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-red-700 block mb-1">تاريخ الانتهاء ✅</label>
                  <input type="date" className="w-full p-2 rounded-xl border-2 font-bold text-sm bg-red-50/50" value={p.toDate} onChange={(e) => {const n = [...penalties]; n[i].toDate = e.target.value; setPenalties(n);}} />
                </div>
                <div className="lg:col-span-1">
                  <label className="text-[10px] font-black text-gray-500 block mb-1">العقوبة</label>
                  <input type="text" className="w-full p-2 rounded-xl border-2 font-bold text-sm" placeholder="حبس/حجز" value={p.penaltyType} onChange={(e) => {const n = [...penalties]; n[i].penaltyType = e.target.value; setPenalties(n);}} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-500 block mb-1">بند الأوامر</label>
                  <input type="text" maxLength="5" className="w-full p-2 rounded-xl border-2 font-bold text-sm" placeholder="00000" value={p.orderNumber} onChange={(e) => {const n = [...penalties]; n[i].orderNumber = e.target.value; setPenalties(n);}} />
                </div>
              </div>

              <textarea rows="4" className="w-full p-4 rounded-2xl border-2 mb-4 font-bold text-sm" placeholder="نص العقوبة التفصيلي (Paragraph)..." value={p.details} onChange={(e) => {const n = [...penalties]; n[i].details = e.target.value; setPenalties(n);}}></textarea>
              
              <div className="bg-white p-4 rounded-2xl border border-red-200 grid grid-cols-1 md:grid-cols-3 gap-4 shadow-inner">
                <p className="md:col-span-3 text-xs font-black text-red-900">بيانات الضابط الآمر بالعقوبة:</p>
                <select className="p-2 border-2 rounded-xl font-bold bg-gray-50 text-xs" value={p.issuingOfficer.rank} onChange={(e) => {const n = [...penalties]; n[i].issuingOfficer.rank = e.target.value; setPenalties(n);}}>
                  {officerRanks.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <input placeholder="الاسم" className="p-2 border-2 rounded-xl font-bold text-xs" value={p.issuingOfficer.name} onChange={(e) => {const n = [...penalties]; n[i].issuingOfficer.name = e.target.value; setPenalties(n);}} />
                <input placeholder="الوظيفة" className="p-2 border-2 rounded-xl font-bold text-xs" value={p.issuingOfficer.job} onChange={(e) => {const n = [...penalties]; n[i].issuingOfficer.job = e.target.value; setPenalties(n);}} />
              </div>
            </div>
          ))}
        </section>

        {/* 2. الفرق التعليمية */}
        <section className="bg-white p-8 rounded-[2.5rem] shadow-lg border-2 border-blue-50">
          <div className="flex justify-between items-center border-b-4 border-blue-600 pb-4 mb-6">
            <h3 className="text-2xl font-black text-blue-900 flex items-center gap-2"><Award /> الفرق التعليمية والحتمية</h3>
            <button type="button" onClick={addCourse} className="bg-blue-600 text-white px-5 py-2 rounded-2xl font-black flex items-center gap-2 hover:bg-blue-700 transition-all"><Plus size={20} /> إضافة فرقة</button>
          </div>
          {courses.map((c, i) => (
            <div key={i} className="mb-6 bg-blue-50/50 p-6 rounded-3xl border border-blue-100 relative group shadow-sm">
              <button onClick={() => setCourses(courses.filter((_, idx) => idx !== i))} className="absolute left-4 top-4 text-blue-400 hover:text-red-600 transition-colors"><Trash2 size={20}/></button>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div><label className="block text-[11px] font-black text-blue-800 mb-1">اسم الفرقة</label>
                  <input placeholder="مثال: قادة فصائل" className="w-full p-2 rounded-xl border-2 font-bold text-sm" value={c.courseName} onChange={(e) => {const n = [...courses]; n[i].courseName = e.target.value; setCourses(n);}} />
                </div>
                <div><label className="block text-[11px] font-black text-blue-800 mb-1">مكان الانعقاد</label>
                  <input placeholder="مثال: معهد الإشارة" className="w-full p-2 rounded-xl border-2 font-bold text-sm" value={c.place} onChange={(e) => {const n = [...courses]; n[i].place = e.target.value; setCourses(n);}} />
                </div>
                <div><label className="block text-[11px] font-black text-green-700 mb-1">من تاريخ</label>
                  <input type="date" className="w-full p-2 rounded-xl border-2 font-bold text-sm" value={c.fromDate} onChange={(e) => {const n = [...courses]; n[i].fromDate = e.target.value; setCourses(n);}} />
                </div>
                <div><label className="block text-[11px] font-black text-red-700 mb-1">إلى تاريخ</label>
                  <input type="date" className="w-full p-2 rounded-xl border-2 font-bold text-sm" value={c.toDate} onChange={(e) => {const n = [...courses]; n[i].toDate = e.target.value; setCourses(n);}} />
                </div>
                <div><label className="block text-[11px] font-black text-blue-800 mb-1">بند الأوامر</label>
                  <input placeholder="00000" className="w-full p-2 rounded-xl border-2 font-bold text-sm" value={c.orderNumber} onChange={(e) => {const n = [...courses]; n[i].orderNumber = e.target.value; setCourses(n);}} />
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* 3. تقارير الكفاءة السنوية */}
        <section className="bg-white p-8 rounded-[2.5rem] shadow-lg border-2 border-green-50">
          <div className="flex justify-between items-center border-b-4 border-green-600 pb-4 mb-6">
            <h3 className="text-2xl font-black text-green-900 flex items-center gap-2"><Star /> تقارير الكفاءة السنوية</h3>
            <button type="button" onClick={addEfficiency} className="bg-green-600 text-white px-5 py-2 rounded-2xl font-black flex items-center gap-2 hover:bg-green-700 shadow-md transition-all"><Plus size={20} /> إضافة تقرير</button>
          </div>
          {efficiencyReports.map((r, i) => (
            <div key={i} className="bg-green-50/50 p-6 rounded-3xl border border-green-100 mb-6 space-y-4 relative shadow-sm">
              <button onClick={() => setEfficiencyReports(efficiencyReports.filter((_, idx) => idx !== i))} className="absolute left-4 top-4 text-red-400 hover:text-red-700 transition-colors"><Trash2 size={20}/></button>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-500 mb-1">السنة</label>
                  <input placeholder="السنة" className="w-full p-2 rounded-xl border-2 font-bold text-sm" value={r.year} onChange={(e) => {const n = [...efficiencyReports]; n[i].year = e.target.value; setEfficiencyReports(n);}} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 mb-1">النسبة المئوية</label>
                  <input placeholder="النسبة المئوية" className="w-full p-2 rounded-xl border-2 font-bold text-sm" value={r.percentage} onChange={(e) => {const n = [...efficiencyReports]; n[i].percentage = e.target.value; setEfficiencyReports(n);}} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 mb-1">التقدير</label>
                  <select className="w-full p-2 rounded-xl border-2 font-bold text-sm" value={r.rating} onChange={(e) => {const n = [...efficiencyReports]; n[i].rating = e.target.value; setEfficiencyReports(n);}}>
                    <option value="امتياز">امتياز</option><option value="جيد جداً">جيد جداً</option><option value="جيد">جيد</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-2xl border border-green-100 shadow-inner">
                <div className="space-y-2">
                  <label className="block text-xs font-black text-green-800 underline">الضابط المباشر ✅:</label>
                  <div className="flex gap-2">
                    <select className="w-1/3 p-2 border-2 rounded-xl font-bold bg-gray-50 text-xs" value={r.directOfficer?.rank || "نقيب"} onChange={(e) => {const n = [...efficiencyReports]; if(!n[i].directOfficer) n[i].directOfficer={}; n[i].directOfficer.rank = e.target.value; setEfficiencyReports(n);}}>
                      {officerRanks.map(rank => <option key={rank} value={rank}>{rank}</option>)}
                    </select>
                    <input className="w-2/3 p-2 border-2 rounded-xl font-bold text-xs" placeholder="الاسم" value={r.directOfficer?.name || ""} onChange={(e) => {const n = [...efficiencyReports]; if(!n[i].directOfficer) n[i].directOfficer={}; n[i].directOfficer.name = e.target.value; setEfficiencyReports(n);}} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-black text-green-800 underline">الضابط المصدق ✅:</label>
                  <div className="flex gap-2">
                    <select className="w-1/3 p-2 border-2 rounded-xl font-bold bg-gray-50 text-xs" value={r.approvingOfficer?.rank || "مقدم"} onChange={(e) => {const n = [...efficiencyReports]; if(!n[i].approvingOfficer) n[i].approvingOfficer={}; n[i].approvingOfficer.rank = e.target.value; setEfficiencyReports(n);}}>
                      {officerRanks.map(rank => <option key={rank} value={rank}>{rank}</option>)}
                    </select>
                    <input className="w-2/3 p-2 border-2 rounded-xl font-bold text-xs" placeholder="الاسم" value={r.approvingOfficer?.name || ""} onChange={(e) => {const n = [...efficiencyReports]; if(!n[i].approvingOfficer) n[i].approvingOfficer={}; n[i].approvingOfficer.name = e.target.value; setEfficiencyReports(n);}} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* زر الحفظ */}
        <button onClick={handleSubmit} disabled={loading} className={`w-full ${isEditMode ? 'bg-blue-900' : 'bg-[#1a2e2a]'} text-yellow-500 py-6 rounded-[2.5rem] font-black text-3xl hover:bg-black shadow-2xl transition-all border-b-8 border-yellow-700 flex items-center justify-center gap-4`}>
          {loading ? <Loader2 className="animate-spin" size={35} /> : <><Save size={35} /> {isEditMode ? "حفظ تعديلات السجل" : "اعتماد وحفظ السجل الوظيفي"}</>}
        </button>
      </div>
    </div>
  );
};

export default CareerData;