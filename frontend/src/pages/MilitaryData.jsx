import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Shield,
  Save,
  MapPin,
  Calendar,
  Briefcase,
  UserCheck,
  Camera,
  Loader2,
  Info
} from "lucide-react";
import RG_LOGO from "../assets/rg.png";

const MilitaryData = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);

  const rankOptions = {
    "جندي": ["جندي", "جندي مقاتل"],
    "صف": ["عريف", "رقيب", "رقيب أول", "مساعد", "مساعد أول"],
    "ضابط": ["ملازم", "ملازم أول", "نقيب", "رائد", "مقدم", "عقيد", "عميد", "لواء"]
  };

  const egyptProvinces = [
    "القاهرة", "الجيزة", "الإسكندرية", "الدقهلية", "البحر الأحمر", "البحيرة", "الفيوم", "الغربية", "الإسماعيلية",
    "المنوفية", "المنيا", "القليوبية", "الوادي الجديد", "السويس", "الشرقية", "أسوان", "أسيوط", "بني سويف", "بورسعيد",
    "دمياط", "جنوب سيناء", "كفر الشيخ", "مطروح", "الأقصر", "قنا", "شمال سيناء", "سوهاج",
  ];

  const [formData, setFormData] = useState({
    name: "",
    militaryId: "",
    rankCategory: "جندي",
    rank: "جندي",
    assignmentCategory: "الكتيبة",
    status: "بالخدمة", 
    statusNote: "موجود بالخدمة", 
    serviceType: "",
    serviceDuration: "", 
    specialization: "",
    unitRole: "",
    warTraining: "",
    joinDate: "",
    dischargeDate: "",
    tripleNumber: "",
    recruitmentArea: "القاهرة",
    companyPlatoon: "",
    unitJoinDate: "",
    missionFrom: "",
    missionTo: "",
    attachedFrom: "",
    attachedTo: "",
    image: ""
  });

  // منطق الحساب التلقائي لتاريخ التسريح ✅
  useEffect(() => {
    if (formData.joinDate && formData.serviceDuration && !isEditMode) {
      const date = new Date(formData.joinDate);
      if (formData.serviceDuration === "سنة واحدة") date.setFullYear(date.getFullYear() + 1);
      else if (formData.serviceDuration === "سنة ونصف") date.setMonth(date.getMonth() + 18);
      else if (formData.serviceDuration === "سنتان") date.setFullYear(date.getFullYear() + 2);
      else if (formData.serviceDuration === "ثلاث سنوات") date.setFullYear(date.getFullYear() + 3);
      
      date.setDate(1); 
      setFormData(prev => ({ ...prev, dischargeDate: date.toISOString().split('T')[0] }));
    }
  }, [formData.joinDate, formData.serviceDuration, isEditMode]);

  useEffect(() => {
    if (location.state?.editMode && location.state?.soldierData) {
      setIsEditMode(true);
      setFormData(location.state.soldierData);
    } else if (location.state?.qualification) {
      const qual = location.state.qualification;
      let duration = "سنة واحدة";
      if (qual === "فوق متوسط") duration = "سنة ونصف";
      if (qual === "متوسط") duration = "سنتان";
      if (qual === "عادي") duration = "ثلاث سنوات";
      setFormData(prev => ({ ...prev, serviceDuration: duration }));
    }
  }, [location.state]);

  useEffect(() => {
    if (!isEditMode) {
      setFormData(prev => ({ ...prev, rank: rankOptions[prev.rankCategory][0] }));
    }
  }, [formData.rankCategory, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: false });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result });
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    // الرابط الصح لازم ينتهي بالـ ID بتاع العسكري ✅
    const url = isEditMode 
      ? `http://127.0.0.1:5000/api/soldier/update-personal/${formData.militaryId}` 
      : "http://127.0.0.1:5000/api/soldier/add";

    const res = isEditMode 
      ? await axios.put(url, formData)  // التعديل بـ PUT
      : await axios.post(url, formData); // الإضافة بـ POST

    if (res.data.success) {
      navigate("/admin-dashboard/personal-data", {
        state: { 
          editMode: isEditMode, 
          soldierData: res.data.soldier || formData, 
          currentStep: 2,
          militaryId: formData.militaryId 
        },
      });
    }
  } catch (err) {
    // لو لسه بيجيب الخطأ ده، يبقى السيرفر مش شايف الـ ID
    console.error(err);
    alert("❌ فشل الاتصال: تأكد من الرابط أو أن السيرفر يعمل");
  } finally { setLoading(false); }
};

  const inputClass = (name) => `
    w-full p-3 bg-white border-2 rounded-xl font-bold text-black outline-none transition-all
    ${errors[name] ? "border-red-500 animate-pulse bg-red-50" : "border-gray-400 focus:border-[#1a2e2a]"}
    ${isEditMode && name === "militaryId" ? "bg-gray-100 cursor-not-allowed" : ""}
  `;

  return (
    <div className="min-h-screen bg-[#eaeeed] p-4 md:p-8 text-right font-sans" dir="rtl">
      <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden border-[6px] border-[#1a2e2a]">
        
        <div className={`${isEditMode ? 'bg-blue-900' : 'bg-[#1a2e2a]'} p-6 text-white flex justify-between items-center border-b-[6px] border-yellow-600 transition-colors`}>
          <div className="flex items-center gap-4">
            <img src={RG_LOGO} alt="RG" className="w-14 h-14 rounded-full shadow-lg border-2 border-white/30 object-cover bg-white" />
            <h1 className="text-3xl font-black italic text-yellow-500">
              {isEditMode ? `تعديل حالة: ${formData.name}` : "1. سجل البيانات العسكرية - قوة الكتيبة ٥"}
            </h1>
          </div>
          <Shield size={40} className="text-yellow-500" />
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="flex flex-col items-center mb-10">
            <div className={`w-40 h-40 rounded-3xl border-4 ${formData.image ? 'border-yellow-500' : 'border-dashed border-gray-400'} overflow-hidden bg-gray-50 flex items-center justify-center relative group shadow-inner`}>
              {formData.image ? <img src={formData.image} alt="Soldier" className="w-full h-full object-cover" /> : <Camera className="text-gray-400" size={50} />}
              <input type="file" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="space-y-4 bg-gray-50 p-6 rounded-2xl border-2 border-gray-200 shadow-inner">
              <h3 className="text-xl font-black text-[#1a2e2a] border-b-2 border-yellow-500 pb-2 mb-4 flex items-center gap-2 italic">
                <UserCheck size={20} /> التعريف والحالة
              </h3>
              
              <div className="bg-white p-3 border-2 border-red-200 rounded-xl shadow-sm">
                <label className="block text-[11px] font-black text-red-700 mb-1">الموقف من الخدمة:</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-transparent font-black text-black outline-none text-md">
                  <option value="بالخدمة">بالخدمة (قوة أساسية)</option>
                  <option value="رديف">رديف (أرشيف الاحتياط)</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-black text-gray-500 mb-1 flex items-center gap-1"><Info size={12}/> ملاحظات الحالة / الدُفعة</label>
                <input name="statusNote" value={formData.statusNote} onChange={handleChange} className={inputClass("statusNote")} placeholder="مثال: دُفعة شهر 4 / مؤجل طبياً" />
              </div>

              <div>
                <label className="block text-[11px] font-black text-gray-500 mb-1">الاسم الكامل *</label>
                <input name="name" value={formData.name} onChange={handleChange} className={inputClass("name")} placeholder="الاسم الرباعي" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-black text-gray-500 mb-1">الفئة</label>
                  <select name="rankCategory" value={formData.rankCategory} onChange={handleChange} className={inputClass("rankCategory")}>
                    <option value="جندي">جندي</option>
                    <option value="صف">صف ضابط</option>
                    <option value="ضابط">ضابط</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-black text-gray-500 mb-1">الرتبة</label>
                  <select name="rank" value={formData.rank} onChange={handleChange} className={inputClass("rank")}>
                    {rankOptions[formData.rankCategory].map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-black text-gray-500 mb-1">الرقم العسكري (13 رقم) *</label>
                <input name="militaryId" maxLength="13" value={formData.militaryId} onChange={handleChange} className={inputClass("militaryId")} placeholder="0000000000000" readOnly={isEditMode} />
              </div>
              <input name="tripleNumber" placeholder="الرقم الثلاثي" value={formData.tripleNumber} onChange={handleChange} className={inputClass("tripleNumber")} />
              <div className="flex items-center gap-2 bg-white p-2 border-2 border-gray-400 rounded-xl shadow-sm">
                <MapPin size={20} className="text-yellow-600" />
                <select name="recruitmentArea" value={formData.recruitmentArea} onChange={handleChange} className="w-full bg-transparent font-bold outline-none">
                  {egyptProvinces.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-4 bg-gray-50 p-6 rounded-2xl border-2 border-gray-200 shadow-inner">
              <h3 className="text-xl font-black text-[#1a2e2a] border-b-2 border-yellow-500 pb-2 mb-4 flex items-center gap-2 italic">
                <Briefcase size={20} /> تفاصيل الخدمة والتوزيع
              </h3>
              <div className="bg-white p-3 border-2 border-yellow-600 rounded-xl shadow-sm">
                <label className="block text-[11px] font-black text-yellow-700 mb-1 italic">قطاع التوزيع اللحظي:</label>
                <select name="assignmentCategory" value={formData.assignmentCategory} onChange={handleChange} className="w-full bg-transparent font-black text-black outline-none text-md">
                  <option value="الكتيبة">قوة الكتيبة (الأساسية)</option>
                  <option value="الصوب">قطاع الصوب الزراعية</option>
                  <option value="الكبائن">قطاع الكبائن</option>
                </select>
              </div>
              <input name="serviceType" placeholder="نوع الخدمة (مجند/متطوع)" value={formData.serviceType} onChange={handleChange} className={inputClass("serviceType")} />
              
              {/* تم حذف خاصية readOnly لتمكين التعديل اليدوي ✅ */}
              <input name="serviceDuration" placeholder="مدة الخدمة" value={formData.serviceDuration} onChange={handleChange} className={inputClass("serviceDuration")} />
              
              <input name="specialization" placeholder="السلاح / التخصص" value={formData.specialization} onChange={handleChange} className={inputClass("specialization")} />
              <input name="unitRole" placeholder="العمل القائم به" value={formData.unitRole} onChange={handleChange} className={inputClass("unitRole")} />
              <input name="warTraining" placeholder="المدرب عليه للحرب" value={formData.warTraining} onChange={handleChange} className={inputClass("warTraining")} />
              <input name="companyPlatoon" placeholder="السرية والفصيلة" value={formData.companyPlatoon} onChange={handleChange} className={inputClass("companyPlatoon")} />
            </div>

            <div className="space-y-4 bg-gray-50 p-6 rounded-2xl border-2 border-gray-200 shadow-inner">
              <h3 className="text-xl font-black text-[#1a2e2a] border-b-2 border-yellow-500 pb-2 mb-4 flex items-center gap-2 italic">
                <Calendar size={20} /> التواريخ (تحديد الدُفعة)
              </h3>
              <div className="p-3 bg-red-50 border-2 border-red-300 rounded-xl">
                <label className="block text-[11px] font-black text-red-700 mb-1 italic">تاريخ التسريح (الرديف) *</label>
                <input 
    type="date" 
    name="dischargeDate" 
    value={formData.dischargeDate} 
    onChange={handleChange} 
    className="w-full p-2 bg-white border-2 border-red-400 rounded-lg text-black font-black outline-none shadow-md text-lg text-center rtl-date-input" 
    style={{ direction: 'rtl' }} // يجبر المتصفح يظهر اليوم الأول
  />
  <p className="text-[9px] text-red-500 mt-2 font-bold text-center italic">
     * التنسيق الظاهر: يوم / شهر / سنة
  </p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-black">
                <div className="text-green-700">تاريخ الالتحاق <input type="date" name="joinDate" value={formData.joinDate} onChange={handleChange} className="w-full p-2 border-2 border-gray-400 rounded-lg text-black font-bold outline-none mt-1" /></div>
                <div className="text-blue-700">تاريخ الضم <input type="date" name="unitJoinDate" value={formData.unitJoinDate} onChange={handleChange} className="w-full p-2 border-2 border-gray-400 rounded-lg text-black font-bold outline-none mt-1" /></div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-xl border-2 border-yellow-200 space-y-2">
                <p className="text-[10px] font-black text-[#1a2e2a] underline mb-1">المأموريات والإلحاق الحالية:</p>
                <div className="grid grid-cols-2 gap-2">
                  <input name="missionFrom" placeholder="مأمورية من" value={formData.missionFrom} onChange={handleChange} className="p-2 border border-gray-300 rounded-lg text-[10px] font-bold outline-none bg-white shadow-sm" />
                  <input name="missionTo" placeholder="مأمورية على" value={formData.missionTo} onChange={handleChange} className="p-2 border border-gray-300 rounded-lg text-[10px] font-bold outline-none bg-white shadow-sm" />
                  <input name="attachedFrom" placeholder="ملحق من" value={formData.attachedFrom} onChange={handleChange} className="p-2 border border-gray-300 rounded-lg text-[10px] font-bold outline-none bg-white shadow-sm" />
                  <input name="attachedTo" placeholder="ملحق على" value={formData.attachedTo} onChange={handleChange} className="p-2 border border-gray-300 rounded-lg text-[10px] font-bold outline-none bg-white shadow-sm" />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${isEditMode ? 'bg-blue-800 border-blue-950' : 'bg-[#1a2e2a] border-yellow-700'} text-yellow-500 py-6 rounded-2xl font-black text-3xl hover:bg-black shadow-2xl transition-all border-b-[10px] active:translate-y-2 active:border-b-0 flex items-center justify-center gap-4 mt-8 group`}
          >
            {loading ? <Loader2 className="animate-spin" size={35} /> : (
              <>
                <span>{isEditMode ? "تأكيد وتحديث الحالة العسكرية" : "حفظ والانتـقال للبيانات الشخصية"}</span>
                <span className="group-hover:translate-x-[-10px] transition-transform font-sans">⬅️</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MilitaryData;