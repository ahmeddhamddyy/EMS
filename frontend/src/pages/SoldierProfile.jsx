import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom"; // أضفنا useLocation
import axios from "axios";
import { 
  User, Shield, Activity, Target, Heart, Calendar, 
  Printer, ArrowRight, Award, Edit3, Save, X, Zap, AlertTriangle, BookOpen, Settings, Trash2
} from "lucide-react";

const SoldierProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // لالتقاط أمر التعديل من الرابط
  const [soldier, setSoldier] = useState(null);
  const [activeTab, setActiveTab] = useState("performance");
  const [isModalOpen, setIsModalOpen] = useState(false); // نافذة الكفاءة
  const [isEditMainModalOpen, setIsEditMainModalOpen] = useState(false); // نافذة البيانات الشاملة ✅
  
  const [performanceData, setPerformanceData] = useState({
    pullUps: 0, pushUps: 0, sitUps: 0, sprint100m: "", shuttleRun: "",
    prone: 0, kneeling: 0, standing: 0, lastShootingDate: "", bloodType: ""
  });

  // State للبيانات الشاملة أثناء التعديل
  const [mainData, setMainData] = useState({});

  const fetchSoldier = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/soldier/full-report/${id}`);
      if (res.data.success) {
        setSoldier(res.data.soldier);
        const s = res.data.soldier;
        setMainData(s); // تعبئة بيانات التعديل الشامل
        
        if (s.assignmentCategory !== "الكتيبة") {
          setActiveTab("full_data");
        }

        setPerformanceData({
          pullUps: s.physicalFitness?.pullUps || 0,
          pushUps: s.physicalFitness?.pushUps || 0,
          sitUps: s.physicalFitness?.sitUps || 0,
          sprint100m: s.physicalFitness?.sprint100m || "",
          shuttleRun: s.physicalFitness?.shuttleRun || "",
          prone: s.shooting?.prone || 0,
          kneeling: s.shooting?.kneeling || 0,
          standing: s.shooting?.standing || 0,
          lastShootingDate: s.shooting?.lastShootingDate || "",
          bloodType: s.medicalStatus?.bloodType || ""
        });
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => { 
    fetchSoldier(); 
    // إذا كان الرابط يحتوي على ?edit=true افتح التعديل فوراً ✅
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get("edit") === "true") {
      setIsEditMainModalOpen(true);
      setActiveTab("full_data");
    }
  }, [id, location]);

  // حفظ الكفاءة (البدني والرماية)
  const handleUpdatePerformance = async () => {
    try {
      await axios.put(`http://localhost:5000/api/soldier/update-personal/${id}`, {
        physicalFitness: {
          pullUps: performanceData.pullUps, pushUps: performanceData.pushUps,
          sitUps: performanceData.sitUps, sprint100m: performanceData.sprint100m,
          shuttleRun: performanceData.shuttleRun
        },
        shooting: {
          prone: performanceData.prone, kneeling: performanceData.kneeling,
          standing: performanceData.standing, lastShootingDate: performanceData.lastShootingDate
        },
        medicalStatus: { bloodType: performanceData.bloodType }
      });
      alert("✅ تم تحديث بيانات الكفاءة");
      setIsModalOpen(false);
      fetchSoldier();
    } catch (err) { alert("❌ خطأ في التحديث"); }
  };

  // حفظ البيانات الشاملة (الاسم، العنوان، السلاح، الجزاءات..) ✅
 const handleSaveMainData = async () => {
    try {
      await axios.put(`http://localhost:5000/api/soldier/update-personal/${id}`, mainData);
      alert("✅ تم الحفظ بنجاح");
      setIsEditMainModalOpen(false);
      
      // إذا كان المستخدم أصلاً جاي من صفحة التقرير، رجعه ليها ✅
      const params = new URLSearchParams(location.search);
      if (params.get("edit") === "true") {
          navigate(`/admin-dashboard/full-report/${id}`);
      } else {
          fetchSoldier();
      }
    } catch (err) { alert("❌ فشل التحديث"); }
};

  if (!soldier) return <div className="h-screen flex items-center justify-center bg-[#0d1312] text-white font-black italic">جاري استدعاء ملف المقاتل...</div>;

  return (
    <div className="min-h-screen bg-[#0d1312] text-gray-100 p-4 md:p-8 font-sans" dir="rtl">
      
      {/* 1. الشريط العلوي */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-8 bg-[#1a2523] p-4 rounded-2xl border border-white/10 shadow-2xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 font-bold hover:text-white transition-all">
          <ArrowRight size={20} /> العودة للبحث
        </button>
        <div className="flex gap-4">
          <button onClick={() => setIsEditMainModalOpen(true)} className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-xl font-black flex items-center gap-2 transition-all">
            <Settings size={18} /> تعديل البيانات الشاملة
          </button>
          {soldier.assignmentCategory === "الكتيبة" && (
            <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-black flex items-center gap-2 transition-all">
              <Edit3 size={18} /> تحديث الكفاءة
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#1a2523] rounded-3xl p-6 border border-white/10 shadow-xl relative overflow-hidden text-center">
            <div className="absolute top-0 left-0 w-2 h-full bg-yellow-600"></div>
            <div className="w-40 h-40 rounded-2xl border-4 border-[#2d3d3a] overflow-hidden mb-4 mx-auto shadow-2xl">
              <img src={soldier.image || "/default.png"} className="w-full h-full object-cover" alt="soldier" />
            </div>
            <h1 className="text-2xl font-black text-white">{soldier.name}</h1>
            <p className="text-yellow-600 font-bold tracking-widest">{soldier.militaryId}</p>
            <div className="mt-4 bg-black/30 p-2 rounded-lg text-sm text-green-500 font-bold italic">{soldier.rank} - {soldier.assignmentCategory}</div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="flex gap-4 border-b border-white/10 pb-4 overflow-x-auto">
            {soldier.assignmentCategory === "الكتيبة" && (
              <TabBtn active={activeTab === "performance"} onClick={() => setActiveTab("performance")} icon={<Zap size={18}/>} label="الأداء العسكري" />
            )}
            <TabBtn active={activeTab === "full_data"} onClick={() => setActiveTab("full_data")} icon={<Shield size={18}/>} label="البيانات الكاملة" />
          </div>

          {activeTab === "performance" && soldier.assignmentCategory === "الكتيبة" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
               <div className="bg-[#1a2523] rounded-3xl p-6 border border-white/10 shadow-xl">
                <h3 className="font-black text-xl mb-6 text-yellow-600 flex items-center gap-2"><Award size={20}/> اللياقة البدنية</h3>
                <div className="space-y-4">
                  <FitnessBar label="عقلة" value={soldier.physicalFitness?.pullUps || 0} max={22} />
                  <FitnessBar label="ضغط" value={soldier.physicalFitness?.pushUps || 0} max={55} />
                  <FitnessBar label="بطن" value={soldier.physicalFitness?.sitUps || 0} max={85} />
                  <InfoRow label="جري معدل" value={soldier.physicalFitness?.sprint100m || "---"} color="text-blue-400" />
                  <InfoRow label="جري ترددي" value={soldier.physicalFitness?.shuttleRun || "---"} color="text-green-400" />
                </div>
              </div>
              <div className="bg-[#1a2523] rounded-3xl p-6 border border-white/10 shadow-xl">
                <h3 className="font-black text-xl mb-6 text-red-600 flex items-center gap-2"><Target size={20}/> الرماية (مجموع 6)</h3>
                <div className="space-y-4">
                  <FitnessBar label="راقداً" value={soldier.shooting?.prone || 0} max={2} />
                  <FitnessBar label="مرتكزاً" value={soldier.shooting?.kneeling || 0} max={2} />
                  <FitnessBar label="واقفاً" value={soldier.shooting?.standing || 0} max={2} />
                  <div className="mt-4 pt-4 border-t border-white/5 text-center italic">
                    <p className="text-gray-500 text-[10px] font-bold">إجمالي النتيجة</p>
                    <p className="text-4xl font-black text-white">{(soldier.shooting?.prone || 0) + (soldier.shooting?.kneeling || 0) + (soldier.shooting?.standing || 0)} / 6</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "full_data" && (
            <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DataSection title="البيانات الشخصية والمدنية">
                  <InfoRow label="الرقم القومي" value={soldier.nationalId} />
                  <InfoRow label="المؤهل الدراسي" value={soldier.qualification} />
                  <InfoRow label="العنوان" value={soldier.address} />
                  <InfoRow label="رقم الهاتف" value={soldier.phone} />
                </DataSection>

                <DataSection title="الحالة العسكرية الإدارية">
                  <InfoRow label="الرقم الثلاثي" value={soldier.tripleNumber} />
                  <InfoRow label="السلاح / التخصص" value={soldier.specialization} />
                  <InfoRow label="السرية / الفصيلة" value={soldier.companyPlatoon} />
                  <InfoRow label="تاريخ الالتحاق" value={soldier.joinDate} />
                  <InfoRow label="تاريخ التسريح" value={soldier.dischargeDate} />
                  <InfoRow label="مكان الخدمة" value={soldier.assignmentCategory} color="text-yellow-500" />
                </DataSection>
              </div>

              <div className="bg-white/5 p-6 rounded-2xl border border-white/10 italic">
                <h3 className="text-red-500 font-black mb-4 flex items-center gap-2"><AlertTriangle size={18}/> سجل الجزاءات والملاحظات</h3>
                {soldier.careerHistory?.penalties?.length > 0 ? (
                  <div className="space-y-3">
                    {soldier.careerHistory.penalties.map((p, i) => (
                      <div key={i} className="bg-black/40 p-3 rounded-xl border-r-4 border-red-600">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-black text-sm text-white">{p.penaltyType}</span>
                          <span className="text-[10px] text-gray-500 font-bold">{p.date}</span>
                        </div>
                        <p className="text-xs text-gray-300 italic">"{p.details}"</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm font-bold text-center py-2 underline">السجل نظيف</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* نافذة التعديل الشامل (التي تفتح من البحث) ✅ */}
      {isEditMainModalOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4 italic">
          <div className="bg-[#1a2523] w-full max-w-4xl rounded-3xl border border-yellow-600/30 p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4 text-yellow-600">
              <h2 className="text-2xl font-black flex items-center gap-2 underline"><Settings /> تعديل بيانات السجل والجزاءات</h2>
              <button onClick={() => setIsEditMainModalOpen(false)}><X /></button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="الاسم" value={mainData.name} onChange={(v) => setMainData({...mainData, name: v})} />
              <InputField label="الرقم العسكري" value={mainData.militaryId} onChange={(v) => setMainData({...mainData, militaryId: v})} />
              <InputField label="السلاح" value={mainData.specialization} onChange={(v) => setMainData({...mainData, specialization: v})} />
              <InputField label="السرية" value={mainData.companyPlatoon} onChange={(v) => setMainData({...mainData, companyPlatoon: v})} />
              <InputField label="العنوان" value={mainData.address} onChange={(v) => setMainData({...mainData, address: v})} />
              <InputField label="الهاتف" value={mainData.phone} onChange={(v) => setMainData({...mainData, phone: v})} />
              <InputField label="المؤهل" value={mainData.qualification} onChange={(v) => setMainData({...mainData, qualification: v})} />
              <InputField label="التسريح" value={mainData.dischargeDate} onChange={(v) => setMainData({...mainData, dischargeDate: v})} />
            </div>

            <div className="mt-8 border-t border-white/5 pt-4">
               <h3 className="text-red-500 font-black mb-4 flex items-center gap-2">تعديل سجل الجزاءات</h3>
               {mainData.careerHistory?.penalties?.map((p, idx) => (
                 <div key={idx} className="flex gap-2 mb-2 bg-black/20 p-2 rounded-lg">
                    <input className="flex-1 bg-transparent border-none text-white text-xs outline-none" value={p.penaltyType} onChange={(e) => {
                       const newPens = [...mainData.careerHistory.penalties];
                       newPens[idx].penaltyType = e.target.value;
                       setMainData({...mainData, "careerHistory.penalties": newPens});
                    }} />
                    <button onClick={() => {
                       const newPens = mainData.careerHistory.penalties.filter((_, i) => i !== idx);
                       setMainData({...mainData, "careerHistory.penalties": newPens});
                    }} className="text-red-500"><Trash2 size={16}/></button>
                 </div>
               ))}
            </div>

            <div className="mt-8 flex gap-4">
              <button onClick={handleSaveMainData} className="flex-1 bg-yellow-600 text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg"><Save /> حفظ التعديلات</button>
              <button onClick={() => setIsEditMainModalOpen(false)} className="px-8 bg-white/5 text-white font-bold py-4 rounded-2xl">إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {/* نافذة تعديل الكفاءة (البدني والرماية) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4 italic">
          <div className="bg-[#1a2523] w-full max-w-3xl rounded-3xl border border-yellow-600/30 p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4 text-yellow-600">
              <h2 className="text-2xl font-black flex items-center gap-2 underline"><Edit3 /> تحديث الكفاءة</h2>
              <button onClick={() => setIsModalOpen(false)}><X /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="text-blue-400 font-bold text-xs border-b border-white/5 pb-1">اللياقة</h4>
                <InputField label="العقلة" type="number" value={performanceData.pullUps} onChange={(v) => setPerformanceData({...performanceData, pullUps: v})} />
                <InputField label="الضغط" type="number" value={performanceData.pushUps} onChange={(v) => setPerformanceData({...performanceData, pushUps: v})} />
                <InputField label="البطن" type="number" value={performanceData.sitUps} onChange={(v) => setPerformanceData({...performanceData, sitUps: v})} />
              </div>
              <div className="space-y-3">
                <h4 className="text-red-400 font-bold text-xs border-b border-white/5 pb-1">الرماية</h4>
                <InputField label="راقداً" type="number" value={performanceData.prone} onChange={(v) => setPerformanceData({...performanceData, prone: v})} />
                <InputField label="مرتكزاً" type="number" value={performanceData.kneeling} onChange={(v) => setPerformanceData({...performanceData, kneeling: v})} />
                <InputField label="واقفاً" type="number" value={performanceData.standing} onChange={(v) => setPerformanceData({...performanceData, standing: v})} />
              </div>
              <div className="space-y-3">
                <h4 className="text-green-400 font-bold text-xs border-b border-white/5 pb-1">أخرى</h4>
                <InputField label="جري 100م" type="text" value={performanceData.sprint100m} onChange={(v) => setPerformanceData({...performanceData, sprint100m: v})} />
                <InputField label="ترددي" type="text" value={performanceData.shuttleRun} onChange={(v) => setPerformanceData({...performanceData, shuttleRun: v})} />
                <InputField label="فصيلة الدم" type="text" value={performanceData.bloodType} onChange={(v) => setPerformanceData({...performanceData, bloodType: v})} />
              </div>
            </div>
            <div className="mt-8 flex gap-4">
              <button onClick={handleUpdatePerformance} className="flex-1 bg-yellow-600 text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2"><Save /> حفظ البيانات</button>
              <button onClick={() => setIsModalOpen(false)} className="px-8 bg-white/5 text-white font-bold py-4 rounded-2xl hover:bg-white/10">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TabBtn = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-8 py-3 rounded-xl font-black transition-all ${active ? 'bg-yellow-600 text-black shadow-lg shadow-yellow-600/20' : 'text-gray-500 hover:bg-white/5'}`}>{icon} {label}</button>
);

const FitnessBar = ({ label, value, max }) => (
  <div className="space-y-1 italic">
    <div className="flex justify-between text-[10px] font-bold"><span>{label}</span><span className="text-yellow-500">{value}/{max}</span></div>
    <div className="h-1.5 bg-black rounded-full overflow-hidden border border-white/5">
      <div className="h-full bg-yellow-600 transition-all duration-700" style={{ width: `${(value/max)*100}%` }}></div>
    </div>
  </div>
);

const DataSection = ({ title, children }) => (
  <div className="bg-white/5 p-5 rounded-2xl border border-white/10 italic">
    <h3 className="text-yellow-600 font-black mb-3 border-b border-white/5 pb-2 text-xs uppercase tracking-widest">{title}</h3>
    <div className="space-y-2">{children}</div>
  </div>
);

const InfoRow = ({ label, value, color = "text-white" }) => (
  <div className="flex justify-between items-center text-xs border-b border-white/5 pb-1 italic transition-all hover:bg-white/5 p-1 rounded">
    <span className="text-gray-500 font-bold">{label}:</span>
    <span className={`font-black ${color}`}>{value || "غير مسجل"}</span>
  </div>
);

const InputField = ({ label, type, value, onChange }) => (
  <div>
    <label className="block text-[10px] text-gray-500 mb-1 font-bold">{label}</label>
    <input type={type} value={value || ""} onChange={(e) => onChange(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-2 text-white text-sm outline-none focus:border-yellow-600 transition-all" />
  </div>
);

export default SoldierProfile;