import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Shield,
  Save,
  MapPin,
  Calendar,
  Briefcase,
  UserCheck,
  Camera,
  Loader2
} from "lucide-react";

const MilitaryData = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // تعريف قوائم الرتب لكل فئة ✅
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
    rank: "جندي", // رتبة افتراضية
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

  // تحديث الرتبة الافتراضية عند تغيير الفئة ✅
  useEffect(() => {
    setFormData(prev => ({ ...prev, rank: rankOptions[prev.rankCategory][0] }));
  }, [formData.rankCategory]);

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
      const res = await axios.post("http://127.0.0.1:5000/api/soldier/add", formData);
      if (res.data.success) {
        navigate("/admin-dashboard/personal-data", {
          state: { militaryId: formData.militaryId, fullName: formData.name },
        });
      }
    } catch (err) {
      alert("❌ خطأ في السيرفر أو الرقم العسكري مكرر");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (name) => `
    w-full p-3 bg-white border-2 rounded-xl font-bold text-black outline-none transition-all
    ${errors[name] ? "border-red-500 animate-pulse bg-red-50" : "border-gray-400 focus:border-[#1a2e2a]"}
  `;

  return (
    <div className="min-h-screen bg-[#eaeeed] p-4 md:p-8 text-right font-sans" dir="rtl">
      <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden border-[6px] border-[#1a2e2a]">
        
        {/* Header */}
        <div className="bg-[#1a2e2a] p-6 text-white flex justify-between items-center border-b-[6px] border-yellow-600">
          <div className="flex items-center gap-4">
            <img src="https://flagcdn.com/w80/eg.png" alt="Egypt" className="w-12 shadow-md border border-white/20" />
            <h1 className="text-3xl font-black italic text-yellow-500 underline decoration-white underline-offset-8">
              1. سجل البيانات العسكرية - الكتيبة ٥
            </h1>
          </div>
          <Shield size={40} className="text-yellow-500" />
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          
          {/* Photo Section */}
          <div className="flex flex-col items-center mb-10">
            <div className={`w-40 h-40 rounded-3xl border-4 ${formData.image ? 'border-yellow-500' : 'border-dashed border-gray-400'} overflow-hidden bg-gray-50 flex items-center justify-center relative group shadow-inner transition-all hover:border-yellow-600`}>
              {formData.image ? (
                <img src={formData.image} alt="Soldier" className="w-full h-full object-cover" />
              ) : (
                <Camera className="text-gray-400" size={50} />
              )}
              <input type="file" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
            <p className="text-[#1a2e2a] mt-2 font-black text-[10px] uppercase">انقر لرفع صورة الفرد</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* البيانات الأساسية */}
            <div className="space-y-4 bg-gray-50 p-6 rounded-2xl border-2 border-gray-200 shadow-inner">
              <h3 className="text-xl font-black text-[#1a2e2a] border-b-2 border-yellow-500 pb-2 mb-4 flex items-center gap-2 italic">
                <UserCheck size={20} /> التعريف بالمقاتل
              </h3>
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
                    {rankOptions[formData.rankCategory].map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-gray-500 mb-1">الرقم العسكري (13 رقم) *</label>
                <input name="militaryId" maxLength="13" value={formData.militaryId} onChange={handleChange} className={inputClass("militaryId")} placeholder="0000000000000" />
              </div>
              <input name="tripleNumber" placeholder="الرقم الثلاثي" value={formData.tripleNumber} onChange={handleChange} className={inputClass("tripleNumber")} />
              <div className="flex items-center gap-2 bg-white p-2 border-2 border-gray-400 rounded-xl shadow-sm focus-within:border-[#1a2e2a]">
                <MapPin size={20} className="text-yellow-600" />
                <select name="recruitmentArea" value={formData.recruitmentArea} onChange={handleChange} className="w-full bg-transparent font-bold text-black outline-none">
                  {egyptProvinces.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            {/* بيانات الخدمة */}
            <div className="space-y-4 bg-gray-50 p-6 rounded-2xl border-2 border-gray-200 shadow-inner">
              <h3 className="text-xl font-black text-[#1a2e2a] border-b-2 border-yellow-500 pb-2 mb-4 flex items-center gap-2 italic">
                <Briefcase size={20} /> تفاصيل الخدمة
              </h3>
              <input name="serviceType" placeholder="نوع الخدمة (مجند/متطوع)" value={formData.serviceType} onChange={handleChange} className={inputClass("serviceType")} />
              <input name="serviceDuration" placeholder="مدة الخدمة" value={formData.serviceDuration} onChange={handleChange} className={inputClass("serviceDuration")} />
              <input name="specialization" placeholder="التخصص" value={formData.specialization} onChange={handleChange} className={inputClass("specialization")} />
              <input name="unitRole" placeholder="العمل القائم بالوحدة" value={formData.unitRole} onChange={handleChange} className={inputClass("unitRole")} />
              <input name="warTraining" placeholder="المدرب عليه للحرب" value={formData.warTraining} onChange={handleChange} className={inputClass("warTraining")} />
              <input name="companyPlatoon" placeholder="السرية والفصيلة" value={formData.companyPlatoon} onChange={handleChange} className={inputClass("companyPlatoon")} />
            </div>

            {/* المواعيد والتحركات */}
            <div className="space-y-4 bg-gray-50 p-6 rounded-2xl border-2 border-gray-200 shadow-inner">
              <h3 className="text-xl font-black text-[#1a2e2a] border-b-2 border-yellow-500 pb-2 mb-4 flex items-center gap-2 italic">
                <Calendar size={20} /> المواعيد والتحركات
              </h3>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-black italic">
                <div className="text-green-700">تاريخ الالتحاق <input type="date" name="joinDate" value={formData.joinDate} onChange={handleChange} className="w-full p-2 border-2 border-gray-400 rounded-lg text-black font-bold outline-none" /></div>
                <div className="text-red-700">تاريخ التسريح <input type="date" name="dischargeDate" value={formData.dischargeDate} onChange={handleChange} className="w-full p-2 border-2 border-red-300 rounded-lg text-black font-bold outline-none" /></div>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-500 mr-1">تاريخ الضم على الوحدة</label>
                <input type="date" name="unitJoinDate" value={formData.unitJoinDate} onChange={handleChange} className="w-full p-2 border-2 border-gray-400 rounded-lg font-bold text-black outline-none" />
              </div>
              <div className="bg-yellow-50 p-4 rounded-xl border-2 border-yellow-200 space-y-2">
                <p className="text-[10px] font-black text-[#1a2e2a] underline">المأموريات والإلحاق:</p>
                <div className="grid grid-cols-2 gap-2">
                  <input name="missionFrom" placeholder="مأمورية من" value={formData.missionFrom} onChange={handleChange} className="p-2 border border-gray-300 rounded-lg text-[10px] font-bold text-black outline-none focus:border-yellow-600 bg-white" />
                  <input name="missionTo" placeholder="مأمورية على" value={formData.missionTo} onChange={handleChange} className="p-2 border border-gray-300 rounded-lg text-[10px] font-bold text-black outline-none focus:border-yellow-600 bg-white" />
                  <input name="attachedFrom" placeholder="ملحق من" value={formData.attachedFrom} onChange={handleChange} className="p-2 border border-gray-300 rounded-lg text-[10px] font-bold text-black outline-none focus:border-yellow-600 bg-white" />
                  <input name="attachedTo" placeholder="ملحق على" value={formData.attachedTo} onChange={handleChange} className="p-2 border border-gray-300 rounded-lg text-[10px] font-bold text-black outline-none focus:border-yellow-600 bg-white" />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1a2e2a] text-yellow-500 py-6 rounded-2xl font-black text-3xl hover:bg-black shadow-2xl transition-all border-b-[10px] border-yellow-700 active:translate-y-2 active:border-b-0 flex items-center justify-center gap-4 mt-8 group"
          >
            {loading ? <Loader2 className="animate-spin" size={35} /> : (
              <>
                <span>حفظ والانتـقال للبيانات الشخصية</span>
                <span className="group-hover:translate-x-[-10px] transition-transform">⬅️</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MilitaryData;