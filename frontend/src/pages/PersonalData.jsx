import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Users,
  Heart,
  Ruler,
  Activity,
  Plus,
  Trash2,
  UserPlus,
  Fingerprint,
  Save,
} from "lucide-react";

const PersonalData = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const passedData = location.state || {};

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
    spouse: { name: "", nationalId: "", birthDate: "", marriageDate: "" },
    children: [{ name: "", nationalId: "", birthDate: "", gender: "ذكر" }],
    relatives: [{ name: "", relation: "", nationalId: "", phone: "" }],
  });

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
    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/api/soldier/add-personal",
        formData
      );
      if (res.data.success) {
        alert("✅ تم حفظ البيانات الشخصية.. جاري الانتقال للسجل الوظيفي");
        navigate("/admin-dashboard/career-data", {
          state: { militaryId: formData.militaryId },
        });
      }
    } catch (err) {
      alert("❌ خطأ في الاتصال بالسيرفر");
    }
  };

  return (
    <div
      className="min-h-screen bg-[#eaeeed] p-4 md:p-8 text-right font-sans"
      dir="rtl"
    >
      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto space-y-8">
        {/* شريط الحالة العلوي */}
        <div className="bg-yellow-600 p-4 rounded-2xl text-white font-black flex items-center justify-between shadow-lg">
          <span>
            2. تكملة البيانات الشخصية للمحارب: {formData.fullName || "---"}
          </span>
          <span className="bg-black/20 px-4 py-1 rounded-full text-sm">
            رقم الربط: {formData.militaryId || "غير محدد"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* كارت البيانات المدنية - تم إصلاح خاصية الكتابة هنا */}
          <div className="bg-white p-8 rounded-3xl shadow-xl border-r-[12px] border-[#1a2e2a]">
            <div className="flex items-center gap-3 mb-6 text-[#1a2e2a] border-b pb-4">
              <Fingerprint size={40} className="text-yellow-600" />
              <h3 className="text-2xl font-black">البيانات المدنية الأساسية</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-[10px] font-black text-gray-500 mb-1 block italic">
                  الرقم العسكري للربط (يجب أن يطابق السجل العسكري)
                </label>
                <input
                  name="militaryId"
                  value={formData.militaryId}
                  onChange={handleChange} // تم تفعيل التغيير لكي تستطيع الكتابة
                  className="w-full p-3 bg-white border-2 border-gray-300 rounded-xl font-black text-[#1a2e2a] focus:border-yellow-600 outline-none transition-all"
                  required
                  placeholder="أدخل الـ 12 رقم هنا"
                />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-black text-gray-500 mb-1 block">
                  الاسم الكامل
                </label>
                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 border-2 border-gray-200 rounded-xl font-bold outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-500 mb-1 block">
                  الرقم القومي
                </label>
                <input
                  name="nationalId"
                  maxLength="14"
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 border-2 border-gray-200 rounded-xl font-bold outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-500 mb-1 block">
                  فصيلة الدم
                </label>
                <select
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleChange}
                  className="w-full p-3 bg-red-50 border-2 border-red-100 rounded-xl font-black text-red-600 outline-none"
                >
                  <option>A+</option>
                  <option>O+</option>
                  <option>B+</option>
                  <option>AB+</option>
                  <option>A-</option>
                  <option>O-</option>
                  <option>B-</option>
                  <option>AB-</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-500 mb-1 block">
                  المؤهل الدراسي
                </label>
                <input
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 border-2 border-gray-200 rounded-xl font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-500 mb-1 block">
                  السجل المدني
                </label>
                <input
                  name="civilRegistry"
                  value={formData.civilRegistry}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 border-2 border-gray-200 rounded-xl font-bold"
                />
              </div>
            </div>
          </div>

          {/* كارت القياسات البدنية */}
          <div className="bg-white p-8 rounded-3xl shadow-xl border-r-[12px] border-red-700">
            <div className="flex items-center gap-3 mb-6 text-red-800 border-b pb-4">
              <Activity size={40} />
              <h3 className="text-2xl font-black">القياسات البدنية</h3>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-gray-50 rounded-2xl border-2 border-gray-100">
                <Ruler size={24} className="mx-auto mb-1 text-gray-400" />
                <span className="text-[9px] font-bold block">الطول (سم)</span>
                <input
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className="w-full bg-transparent text-center font-black text-lg outline-none"
                  placeholder="000"
                />
              </div>
              <div className="p-3 bg-gray-50 rounded-2xl border-2 border-gray-100">
                <Activity size={24} className="mx-auto mb-1 text-red-500" />
                <span className="text-[9px] font-bold block">الوزن (كجم)</span>
                <input
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full bg-transparent text-center font-black text-lg outline-none"
                  placeholder="00"
                />
              </div>
              <div className="p-3 bg-gray-50 rounded-2xl border-2 border-gray-100">
                <Heart size={24} className="mx-auto mb-1 text-red-700" />
                <span className="text-[9px] font-bold block">الصدر</span>
                <input
                  name="chestSize"
                  value={formData.chestSize}
                  onChange={handleChange}
                  className="w-full bg-transparent text-center font-black text-lg outline-none"
                  placeholder="00"
                />
              </div>
            </div>
          </div>
        </div>

        {/* سجل الزوجة */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border-r-[12px] border-pink-700">
          <div className="flex items-center gap-3 mb-6 text-pink-900 border-b pb-4">
            <Heart size={35} fill="currentColor" />
            <h3 className="text-2xl font-black">بيانات الزوجة</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              value={formData.spouse.name}
              onChange={(e) => handleSpouseChange("name", e.target.value)}
              className="p-3 bg-pink-50 rounded-xl border-2 border-pink-100 font-bold"
              placeholder="الاسم"
            />
            <input
              maxLength="14"
              value={formData.spouse.nationalId}
              onChange={(e) => handleSpouseChange("nationalId", e.target.value)}
              className="p-3 bg-pink-50 rounded-xl border-2 border-pink-100 font-bold"
              placeholder="الرقم القومي"
            />
            <input
              type="date"
              value={formData.spouse.birthDate}
              onChange={(e) => handleSpouseChange("birthDate", e.target.value)}
              className="p-3 bg-pink-50 rounded-xl border-2 border-pink-100 font-bold"
            />
            <input
              type="date"
              value={formData.spouse.marriageDate}
              onChange={(e) =>
                handleSpouseChange("marriageDate", e.target.value)
              }
              className="p-3 bg-pink-50 rounded-xl border-2 border-pink-100 font-bold"
            />
          </div>
        </div>

        {/* سجل الأبناء */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border-r-[12px] border-purple-800">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h3 className="text-2xl font-black text-purple-900 flex items-center gap-2">
              <Users size={35} /> سجل الأبناء
            </h3>
            <button
              type="button"
              onClick={() =>
                addMore("children", {
                  name: "",
                  nationalId: "",
                  birthDate: "",
                  gender: "ذكر",
                })
              }
              className="bg-purple-900 text-white px-6 py-2 rounded-xl font-black hover:bg-black transition-all shadow-md"
            >
              <Plus size={20} /> إضافة ابن
            </button>
          </div>
          {formData.children.map((child, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-purple-50 p-4 rounded-2xl border-2 border-purple-100 items-end mb-4 shadow-sm transition-all"
            >
              <div className="md:col-span-3">
                <input
                  placeholder="الاسم"
                  value={child.name}
                  onChange={(e) =>
                    handleNestedChange(e, "children", index, "name")
                  }
                  className="w-full p-2.5 rounded-lg border-2 border-gray-200 font-bold"
                />
              </div>
              <div className="md:col-span-3">
                <input
                  maxLength="14"
                  placeholder="القومي"
                  value={child.nationalId}
                  onChange={(e) =>
                    handleNestedChange(e, "children", index, "nationalId")
                  }
                  className="w-full p-2.5 rounded-lg border-2 border-gray-200 font-bold"
                />
              </div>
              <div className="md:col-span-3">
                <input
                  type="date"
                  value={child.birthDate}
                  onChange={(e) =>
                    handleNestedChange(e, "children", index, "birthDate")
                  }
                  className="w-full p-2.5 rounded-lg border-2 border-gray-200 font-bold"
                />
              </div>
              <div className="md:col-span-2">
                <select
                  value={child.gender}
                  onChange={(e) =>
                    handleNestedChange(e, "children", index, "gender")
                  }
                  className="w-full p-2.5 rounded-lg border-2 border-gray-200 font-black"
                >
                  <option value="ذكر">ذكر</option>
                  <option value="أنثى">أنثى</option>
                </select>
              </div>
              <div className="md:col-span-1 flex justify-center">
                <button
                  type="button"
                  onClick={() => removeField("children", index)}
                  className="text-red-600 hover:bg-red-100 p-2.5 rounded-xl transition-all shadow-sm bg-white border border-red-100"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* إعادة قسم الأقارب المحذوف ✅ */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border-r-[12px] border-orange-700">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h3 className="text-2xl font-black text-orange-900 flex items-center gap-2">
              <UserPlus size={35} /> أقارب للطوارئ
            </h3>
            <button
              type="button"
              onClick={() =>
                addMore("relatives", {
                  name: "",
                  relation: "",
                  nationalId: "",
                  phone: "",
                })
              }
              className="bg-orange-700 text-white px-6 py-2 rounded-xl font-black hover:bg-black transition-all shadow-md"
            >
              <Plus size={20} /> إضافة قريب
            </button>
          </div>
          {formData.relatives.map((rel, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-orange-50 p-4 rounded-2xl border-2 border-orange-100 items-end mb-4 shadow-sm"
            >
              <input
                placeholder="الاسم"
                value={rel.name}
                onChange={(e) =>
                  handleNestedChange(e, "relatives", index, "name")
                }
                className="p-2.5 rounded-lg border-2 border-gray-200 font-bold"
              />
              <input
                placeholder="صلة القرابة"
                value={rel.relation}
                onChange={(e) =>
                  handleNestedChange(e, "relatives", index, "relation")
                }
                className="p-2.5 rounded-lg border-2 border-gray-200 font-bold"
              />
              <input
                maxLength="14"
                placeholder="القومي"
                value={rel.nationalId}
                onChange={(e) =>
                  handleNestedChange(e, "relatives", index, "nationalId")
                }
                className="p-2.5 rounded-lg border-2 border-gray-200 font-bold"
              />
              <div className="flex items-center gap-2">
                <input
                  placeholder="رقم الهاتف"
                  value={rel.phone}
                  onChange={(e) =>
                    handleNestedChange(e, "relatives", index, "phone")
                  }
                  className="flex-1 p-2.5 rounded-lg border-2 border-gray-200 font-bold"
                />
                <button
                  type="button"
                  onClick={() => removeField("relatives", index)}
                  className="text-red-600 hover:bg-red-100 p-2.5 rounded-xl bg-white border border-red-100 transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-[#1a2e2a] text-yellow-500 py-6 rounded-[2rem] font-black text-3xl shadow-2xl hover:bg-black transition-all border-b-[10px] border-yellow-700 active:translate-y-2 active:border-b-0"
        >
          حفظ والانتـقال للسجل الوظيفي ⬅️
        </button>
      </form>
    </div>
  );
};

export default PersonalData;
