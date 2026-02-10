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
  LayoutGrid
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
    status: "بالخدمة", // مطابق للـ Schema ✅
    assignmentCategory: "الكتيبة", // مطابق للـ Schema ✅
    serviceType: "",
    specialization: "",
    unitRole: "",
    warTraining: "",
    joinDate: "",
    dischargeDate: "",
    tripleNumber: "",
    recruitmentArea: "القاهرة",
    companyPlatoon: "",
    unitJoinDate: "",
    missionTo: "", // مطابق للـ Schema ✅
    attachedFrom: "", // مطابق للـ Schema ✅
    image: ""
  });

  useEffect(() => {
    if (location.state?.editMode && location.state?.soldierData) {
      setIsEditMode(true);
      setFormData(location.state.soldierData);
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
    let tempErrors = {};
    if (!formData.name) tempErrors.name = true;
    if (formData.militaryId.length !== 13) tempErrors.militaryId = true;

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      window.scrollTo(0, 0);
      return;
    }

    setLoading(true);
    try {
      // استخدام 127.0.0.1 لضمان الاتصال المستقر ✅
      const url = isEditMode 
        ? "http://127.0.0.1:5000/api/soldier/update-personal" 
        : "http://127.0.0.1:5000/api/soldier/add";

      const res = await axios.post(url, formData);
      if (res.data.success) {
        navigate("/admin-dashboard/personal-data", {
          state: { 
            militaryId: formData.militaryId, 
            fullName: formData.name,
            editMode: isEditMode,
            soldierData: isEditMode ? formData : null
          },
        });
      }
    } catch (err) {
      alert("❌ خطأ: الرقم العسكري مكرر أو السيرفر متوقف");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (name) => `
    w-full p-3 bg-white border-2 rounded-xl font-bold text-black outline-none transition-all
    ${errors[name] ? "border-red-500 animate-pulse bg-red-50" : "border-gray-400 focus:border-[#1a2e2a]"}
    ${isEditMode && name === "militaryId" ? "bg-gray-100 cursor-not-allowed" : ""}
  `;

  return (
    <div className="min-h-screen bg-[#eaeeed] p-4 md:p-8 text-right font-sans" dir="rtl">
      <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden border-[6px] border-[#1a2e2a]">
        
        <div className={`${isEditMode ? 'bg-blue-900' : 'bg-[#1a2e2a]'} p-6 text-white flex justify-between items-center border-b-[6px] border-yellow-600`}>
          <div className="flex items-center gap-4">
            <img src={RG_LOGO} alt="RG" className="w-12" />
            <h1 className="text-3xl font-black italic text-yellow-500">
              {isEditMode ? `تعديل عسكري: ${formData.name}` : "سجل البيانات العسكرية الأساسية"}
            </h1>
          </div>
          <Shield size={40} className="text-yellow-500" />
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          {/* الصورة */}
          <div className="flex flex-col items-center mb-10">
            <div className={`w-40 h-40 rounded-3xl border-4 ${formData.image ? 'border-yellow-500' : 'border-dashed border-gray-400'} overflow-hidden bg-gray-50 flex items-center justify-center relative shadow-inner`}>
              {formData.image ? (
                <img src={formData.image} alt="Soldier" className="w-full h-full object-cover" />
              ) : (
                <Camera className="text-gray-400" size={50} />
              )}
              <input type="file" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
            <p className="text-[#1a2e2a] mt-2 font-black text-[10px] uppercase">انقر لرفع صورة المحارب</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* القسم الأول: التعريف */}
            <div className="space-y-4 bg-gray-50 p-6 rounded-2xl border-2 border-gray-200">
              <h3 className="text-xl font-black text-[#1a2e2a] border-b-2 border-yellow-500 pb-2 mb-4 flex items-center gap-2">
                <UserCheck size={20} /> الهوية العسكرية
              </h3>
              <div>
                <label className="block text-[11px] font-black text-gray-500">الاسم الكامل *</label>
                <input name="name" value={formData.name} onChange={handleChange} className={inputClass("name")} placeholder="الاسم كما في الرقم القومي" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-black text-gray-500">الفئة</label>
                  <select name="rankCategory" value={formData.rankCategory} onChange={handleChange} className={inputClass("rankCategory")}>
                    <option value="جندي">جندي</option>
                    <option value="صف">صف ضابط</option>
                    <option value="ضابط">ضابط</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-black text-gray-500">الرتبة</label>
                  <select name="rank" value={formData.rank} onChange={handleChange} className={inputClass("rank")}>
                    {rankOptions[formData.rankCategory].map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-black text-gray-500">الرقم العسكري *</label>
                <input name="militaryId" maxLength="13" value={formData.militaryId} onChange={handleChange} className={inputClass("militaryId")} placeholder="13 رقم" readOnly={isEditMode} />
              </div>
              <div>
                <label className="block text-[11px] font-black text-gray-500">توزيع القوة (القطاع) ✅</label>
                <select name="assignmentCategory" value={formData.assignmentCategory} onChange={handleChange} className={inputClass("assignmentCategory")}>
                  <option value="الكتيبة">الكتيبة (الأساسي)</option>
                  <option value="الصوب">قطاع الصوب</option>
                  <option value="الكبائن">قطاع الكبائن</option>
                </select>
              </div>
            </div>

            {/* القسم الثاني: الخدمة */}
            <div className="space-y-4 bg-gray-50 p-6 rounded-2xl border-2 border-gray-200">
              <h3 className="text-xl font-black text-[#1a2e2a] border-b-2 border-yellow-500 pb-2 mb-4 flex items-center gap-2">
                <Briefcase size={20} /> بيانات الخدمة
              </h3>
              <input name="specialization" placeholder="السلاح / التخصص" value={formData.specialization} onChange={handleChange} className={inputClass("specialization")} />
              <input name="unitRole" placeholder="الوظيفة بالوحدة" value={formData.unitRole} onChange={handleChange} className={inputClass("unitRole")} />
              <input name="warTraining" placeholder="المدرب عليه للحرب" value={formData.warTraining} onChange={handleChange} className={inputClass("warTraining")} />
              <input name="companyPlatoon" placeholder="السرية / الفصيلة" value={formData.companyPlatoon} onChange={handleChange} className={inputClass("companyPlatoon")} />
              <input name="serviceType" placeholder="نوع الخدمة (مجند/متطوع)" value={formData.serviceType} onChange={handleChange} className={inputClass("serviceType")} />
              
              <div className="flex items-center gap-2 bg-white p-2 border-2 border-gray-400 rounded-xl">
                <MapPin size={20} className="text-yellow-600" />
                <select name="recruitmentArea" value={formData.recruitmentArea} onChange={handleChange} className="w-full bg-transparent font-bold outline-none">
                  {egyptProvinces.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            {/* القسم الثالث: التحركات */}
            <div className="space-y-4 bg-gray-50 p-6 rounded-2xl border-2 border-gray-200">
              <h3 className="text-xl font-black text-[#1a2e2a] border-b-2 border-yellow-500 pb-2 mb-4 flex items-center gap-2">
                <Calendar size={20} /> التوقيتات والإلحاق
              </h3>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-black italic">
                <div className="text-green-700">تاريخ الالتحاق <input type="date" name="joinDate" value={formData.joinDate} onChange={handleChange} className="w-full p-2 border-2 border-gray-400 rounded-lg text-black font-bold" /></div>
                <div className="text-red-700">تاريخ التسريح <input type="date" name="dischargeDate" value={formData.dischargeDate} onChange={handleChange} className="w-full p-2 border-2 border-red-300 rounded-lg text-black font-bold" /></div>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-500 mr-1">تاريخ الضم على الكتيبة</label>
                <input type="date" name="unitJoinDate" value={formData.unitJoinDate} onChange={handleChange} className="w-full p-2 border-2 border-gray-400 rounded-lg font-bold text-black outline-none" />
              </div>

              <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-200 space-y-2">
                <p className="text-[10px] font-black text-blue-900 underline">المأموريات والإلحاق الخارجي:</p>
                <input name="missionTo" placeholder="مأمورية على جهة..." value={formData.missionTo} onChange={handleChange} className="w-full p-2 border border-blue-300 rounded-lg text-[11px] font-bold bg-white" />
                <input name="attachedFrom" placeholder="ملحق من جهة..." value={formData.attachedFrom} onChange={handleChange} className="w-full p-2 border border-blue-300 rounded-lg text-[11px] font-bold bg-white" />
              </div>

              <div className="bg-gray-100 p-3 rounded-xl border">
                 <label className="block text-[10px] font-black text-gray-500 mb-1">حالة الفرد الحالية:</label>
                 <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-transparent font-black text-red-900 text-sm outline-none">
                    <option value="بالخدمة">بالخدمة (فعلي)</option>
                    <option value="رديف">رديف (أرشيف)</option>
                 </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${isEditMode ? 'bg-blue-800' : 'bg-[#1a2e2a]'} text-yellow-500 py-6 rounded-2xl font-black text-3xl hover:bg-black shadow-2xl transition-all border-b-[10px] ${isEditMode ? 'border-blue-950' : 'border-yellow-700'} mt-8 flex items-center justify-center gap-4 group`}
          >
            {loading ? <Loader2 className="animate-spin" size={35} /> : (
              <>
                <span>{isEditMode ? "حفظ وتثبيت التعديلات" : "حفظ والانتـقال للبيانات الشخصية"}</span>
                <span className="group-hover:translate-x-[-10px] transition-transform text-4xl">⬅</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MilitaryData;