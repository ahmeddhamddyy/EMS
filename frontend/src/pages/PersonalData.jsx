import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Users, Heart, Ruler, Activity, Plus, Trash2, 
  UserPlus, Fingerprint, Save, Loader2, Edit3
} from "lucide-react";

const PersonalData = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const passedData = location.state || {};
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [formData, setFormData] = useState({
    militaryId: passedData.militaryId || "",
    fullName: passedData.fullName || "",
    gender: "ذكر",
    religion: "مسلم",
    qualification: "عالي",
    jobBefore: "",
    birthDate: "",
    birthPlace: "",
    province: "القاهرة",
    nationalId: "",
    civilRegistry: "",
    height: "",
    weight: "",
    chestSize: "",
    bloodType: "A+",
    address: "",
    phone: "",
    spouse: { name: "", nationalId: "", birthDate: "", marriageDate: "" },
    children: [],
    relatives: [],
  });

  useEffect(() => {
    if (passedData.editMode && passedData.soldierData) {
      setIsEditMode(true);
      const s = passedData.soldierData;
      setFormData({
        ...formData,
        ...s,
        fullName: s.name,
        spouse: s.spouse || { name: "", nationalId: "", birthDate: "", marriageDate: "" },
        children: s.children || [],
        relatives: s.relatives || []
      });
    }
  }, [passedData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSpouseChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      spouse: { ...prev.spouse, [field]: value },
    }));
  };

  const handleNestedChange = (e, section, index, field) => {
    const newSection = [...formData[section]];
    newSection[index][field] = e.target.value;
    setFormData({ ...formData, [section]: newSection });
  };

  const addMore = (section, template) => {
    setFormData({ ...formData, [section]: [...formData[section], template] });
  };

  const removeField = (section, index) => {
    const newSection = formData[section].filter((_, i) => i !== index);
    setFormData({ ...formData, [section]: newSection });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:5000/api/soldier/update-personal", formData);
      if (res.data.success) {
        navigate("/admin-dashboard/career-data", {
          state: { 
            militaryId: formData.militaryId,
            editMode: isEditMode,
            soldierData: isEditMode ? passedData.soldierData : null
          },
        });
      }
    } catch (err) {
      alert("❌ خطأ في الحفظ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eaeeed] p-4 md:p-8 text-right font-sans" dir="rtl">
      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto space-y-8">
        
        <div className={`${isEditMode ? 'bg-blue-800' : 'bg-yellow-600'} p-6 rounded-3xl text-white font-black flex items-center justify-between shadow-2xl border-b-8 ${isEditMode ? 'border-blue-900' : 'border-yellow-700'}`}>
          <div className="flex items-center gap-4">
             {isEditMode ? <Edit3 size={30} /> : <UserPlus size={30} />}
             <span className="text-2xl italic">{isEditMode ? `تعديل بيانات: ${formData.fullName}` : "2. البيانات الشخصية والاجتماعية للمحارب"}</span>
          </div>
          <span className="bg-black/20 px-6 py-2 rounded-2xl text-lg tracking-widest border border-white/20">
            ربط عسكري: {formData.militaryId}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border-r-[12px] border-[#1a2e2a]">
            <div className="flex items-center gap-3 mb-6 text-[#1a2e2a] border-b pb-4">
              <Fingerprint size={40} className="text-yellow-600" />
              <h3 className="text-2xl font-black">البيانات المدنية والاتصال</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-[10px] font-black text-gray-500 mb-1 block">الاسم الكامل</label>
                <input name="fullName" value={formData.fullName} onChange={handleChange} className="w-full p-3 bg-gray-50 border-2 border-gray-200 rounded-xl font-bold outline-none" required />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-500 mb-1 block">الرقم القومي</label>
                <input name="nationalId" value={formData.nationalId} maxLength="14" onChange={handleChange} className="w-full p-3 bg-gray-50 border-2 border-gray-200 rounded-xl font-bold outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-500 mb-1 block">رقم الهاتف</label>
                <input name="phone" value={formData.phone} placeholder="01xxxxxxxxx" onChange={handleChange} className="w-full p-3 bg-gray-50 border-2 border-gray-200 rounded-xl font-bold outline-none" />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-black text-gray-500 mb-1 block">العنوان بالتفصيل</label>
                <input name="address" value={formData.address} placeholder="المحافظة - المركز - القرية" onChange={handleChange} className="w-full p-3 bg-gray-50 border-2 border-gray-200 rounded-xl font-bold outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-500 mb-1 block">فصيلة الدم</label>
                <select name="bloodType" value={formData.bloodType} onChange={handleChange} className="w-full p-3 bg-red-50 border-2 border-red-100 rounded-xl font-black text-red-600 outline-none">
                  {["A+", "O+", "B+", "AB+", "A-", "O-", "B-", "AB-"].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-500 mb-1 block">المؤهل الدراسي</label>
                <select name="qualification" value={formData.qualification} onChange={handleChange} className="w-full p-3 bg-gray-50 border-2 border-gray-200 rounded-xl font-black text-[#1a2e2a] outline-none">
                  <option value="عالي">عالي</option>
                  <option value="فوق متوسط">فوق متوسط</option>
                  <option value="متوسط">متوسط</option>
                  <option value="عادي">عادي</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border-r-[12px] border-red-700">
            <div className="flex items-center gap-3 mb-6 text-red-800 border-b pb-4">
              <Activity size={40} />
              <h3 className="text-2xl font-black">الحالة الصحية والبدنية</h3>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-gray-50 rounded-2xl border-2 border-gray-100">
                <Ruler size={24} className="mx-auto mb-1 text-gray-400" />
                <span className="text-[10px] font-bold block">الطول (سم)</span>
                <input name="height" value={formData.height} onChange={handleChange} className="w-full bg-transparent text-center font-black text-xl outline-none" placeholder="000" />
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border-2 border-gray-100">
                <Activity size={24} className="mx-auto mb-1 text-red-500" />
                <span className="text-[10px] font-bold block">الوزن (كجم)</span>
                <input name="weight" value={formData.weight} onChange={handleChange} className="w-full bg-transparent text-center font-black text-xl outline-none" placeholder="00" />
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border-2 border-gray-100">
                <Heart size={24} className="mx-auto mb-1 text-red-700" />
                <span className="text-[10px] font-bold block">عرض الصدر</span>
                <input name="chestSize" value={formData.chestSize} onChange={handleChange} className="w-full bg-transparent text-center font-black text-xl outline-none" placeholder="00" />
              </div>
            </div>
            <div className="mt-6">
                <label className="text-[10px] font-black text-gray-500 mb-1 block italic">المهنة قبل التجنيد</label>
                <input name="jobBefore" value={formData.jobBefore} onChange={handleChange} className="w-full p-3 bg-gray-50 border-2 border-gray-200 rounded-xl font-bold outline-none" placeholder="مثال: عامل بناء" />
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border-r-[12px] border-pink-700">
          <div className="flex items-center gap-3 mb-6 text-pink-900 border-b pb-4">
            <Heart size={35} fill="currentColor" />
            <h3 className="text-2xl font-black">بيانات الزوجة</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input value={formData.spouse.name} onChange={(e) => handleSpouseChange("name", e.target.value)} className="p-3 bg-pink-50 rounded-xl border-2 border-pink-100 font-bold" placeholder="اسم الزوجة" />
            <input maxLength="14" value={formData.spouse.nationalId} onChange={(e) => handleSpouseChange("nationalId", e.target.value)} className="p-3 bg-pink-50 rounded-xl border-2 border-pink-100 font-bold" placeholder="الرقم القومي للزوجة" />
            <div className="flex flex-col"><span className="text-[9px] font-bold pr-2">تاريخ الميلاد</span><input type="date" value={formData.spouse.birthDate} onChange={(e) => handleSpouseChange("birthDate", e.target.value)} className="p-3 bg-pink-50 rounded-xl border-2 border-pink-100 font-bold" /></div>
            <div className="flex flex-col"><span className="text-[9px] font-bold pr-2">تاريخ الزواج</span><input type="date" value={formData.spouse.marriageDate} onChange={(e) => handleSpouseChange("marriageDate", e.target.value)} className="p-3 bg-pink-50 rounded-xl border-2 border-pink-100 font-bold" /></div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border-r-[12px] border-purple-800">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h3 className="text-2xl font-black text-purple-900 flex items-center gap-2"><Users size={35} /> سجل الأبناء</h3>
            <button type="button" onClick={() => addMore("children", { name: "", nationalId: "", birthDate: "", gender: "ذكر" })} className="bg-purple-900 text-white px-8 py-3 rounded-2xl font-black hover:bg-black shadow-lg">إضافة ابن</button>
          </div>
          <div className="space-y-4">
            {formData.children.map((child, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-purple-50 p-6 rounded-[2rem] border-2 border-purple-100 items-end shadow-inner">
                <div className="md:col-span-4"><input placeholder="الاسم الكامل للابن" value={child.name} onChange={(e) => handleNestedChange(e, "children", index, "name")} className="w-full p-3 rounded-xl border-2 border-gray-200 font-bold outline-none" /></div>
                <div className="md:col-span-3"><input maxLength="14" placeholder="الرقم القومي" value={child.nationalId} onChange={(e) => handleNestedChange(e, "children", index, "nationalId")} className="w-full p-3 rounded-xl border-2 border-gray-200 font-bold outline-none" /></div>
                <div className="md:col-span-2"><input type="date" value={child.birthDate} onChange={(e) => handleNestedChange(e, "children", index, "birthDate")} className="w-full p-3 rounded-xl border-2 border-gray-200 font-bold outline-none" /></div>
                <div className="md:col-span-2">
                  <select value={child.gender} onChange={(e) => handleNestedChange(e, "children", index, "gender")} className="w-full p-3 rounded-xl border-2 border-gray-200 font-black outline-none">
                    <option value="ذكر">ذكر</option>
                    <option value="أنثى">أنثى</option>
                  </select>
                </div>
                <div className="md:col-span-1 flex justify-center">
                  <button type="button" onClick={() => removeField("children", index)} className="text-red-600 hover:bg-red-100 p-3 rounded-xl bg-white border border-red-100"><Trash2 size={24} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border-r-[12px] border-orange-700">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h3 className="text-2xl font-black text-orange-900 flex items-center gap-2"><UserPlus size={35} /> أقارب للطوارئ</h3>
            <button type="button" onClick={() => addMore("relatives", { name: "", relation: "", nationalId: "", phone: "" })} className="bg-orange-700 text-white px-8 py-3 rounded-2xl font-black hover:bg-black shadow-lg">إضافة قريب</button>
          </div>
          <div className="space-y-4">
            {formData.relatives.map((rel, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-orange-50 p-6 rounded-[2rem] border-2 border-orange-100 items-end">
                <input placeholder="اسم القريب" value={rel.name} onChange={(e) => handleNestedChange(e, "relatives", index, "name")} className="p-3 rounded-xl border-2 border-gray-200 font-bold outline-none" />
                <input placeholder="صلة القرابة" value={rel.relation} onChange={(e) => handleNestedChange(e, "relatives", index, "relation")} className="p-3 rounded-xl border-2 border-gray-200 font-bold outline-none" />
                <input placeholder="رقم الهاتف" value={rel.phone} onChange={(e) => handleNestedChange(e, "relatives", index, "phone")} className="p-3 rounded-xl border-2 border-gray-200 font-bold outline-none" />
                <div className="flex items-center gap-2">
                  <input maxLength="14" placeholder="القومي" value={rel.nationalId} onChange={(e) => handleNestedChange(e, "relatives", index, "nationalId")} className="flex-1 p-3 rounded-xl border-2 border-gray-200 font-bold outline-none" />
                  <button type="button" onClick={() => removeField("relatives", index)} className="text-red-600 hover:bg-red-100 p-3 rounded-xl bg-white border border-red-100"><Trash2 size={24} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full ${isEditMode ? 'bg-blue-900' : 'bg-[#1a2e2a]'} text-yellow-500 py-8 rounded-[3rem] font-black text-4xl shadow-2xl hover:bg-black transition-all border-b-[12px] ${isEditMode ? 'border-blue-950' : 'border-yellow-700'} active:translate-y-2 active:border-b-0 flex items-center justify-center gap-4`}
        >
          {loading ? <Loader2 className="animate-spin" size={40} /> : <><Save size={40} /> {isEditMode ? "تحديث البيانات الشخصية" : "اعتماد البيانات والتحرك للسجل الوظيفي"} ⬅️</>}
        </button>
      </form>
    </div>
  );
};

export default PersonalData;