import React, { useState } from 'react';
import axios from 'axios';
import { Users, User, Heart, Home, Ruler, Activity, Plus, Trash2, UserPlus, Fingerprint } from 'lucide-react';

const PersonalData = () => {
    const egyptProvinces = ["القاهرة", "الجيزة", "الإسكندرية", "الدقهلية", "البحر الأحمر", "البحيرة", "الفيوم", "الغربية", "الإسماعيلية", "المنوفية", "المنيا", "القليوبية", "الوادي الجديد", "السويس", "الشرقية", "أسوان", "أسيوط", "بني سويف", "بورسعيد", "دمياط", "جنوب سيناء", "كفر الشيخ", "مطروح", "الأقصر", "قنا", "شمال سيناء", "سوهاج"];

    const [formData, setFormData] = useState({
        militaryId: '', fullName: '', gender: 'ذكر', religion: 'مسلم', qualification: 'عالي',
        jobBefore: '', birthDate: '', birthPlace: '', province: 'القاهرة', nationalId: '',
        civilRegistry: '', height: '', weight: '', chestSize: '', bloodType: 'A+',
        spouse: { name: '', birthDate: '', nationalId: '' },
        children: [{ name: '', nationalId: '' }],
        relatives: [{ name: '', relation: '', nationalId: '', phone: '' }]
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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
            const res = await axios.post("http://127.0.0.1:5000/api/soldier/add-personal", formData);
            if (res.data.success) alert("✅ تم تحديث السجل الشخصي والاجتماعي بنجاح");
        } catch (err) {
            alert("❌ خطأ في الاتصال بالسيرفر");
        }
    };

    return (
        <div className="min-h-screen bg-[#eaeeed] p-4 md:p-8 text-right" dir="rtl">
            <form onSubmit={handleSubmit} className="max-w-6xl mx-auto space-y-6">
                
                {/* القسم الأول: البيانات المدنية والقياسات */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* كارت البيانات المدنية */}
                    <div className="bg-white p-8 rounded-3xl shadow-xl border-r-[12px] border-[#1a2e2a]">
                        <div className="flex items-center gap-3 mb-6 text-[#1a2e2a] border-b pb-4">
                            <Fingerprint className="bg-[#f0f4f3] p-2 rounded-xl text-[#1a2e2a]" size={45} />
                            <h3 className="text-2xl font-black">البيانات المدنية الأساسية</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                            <div className="col-span-2">
                                <label className="text-xs font-black text-[#1a2e2a] mb-1 block">الرقم العسكري للربط (مهم جداً)</label>
                                <input name="militaryId" placeholder="أدخل الرقم العسكري المكون من 12 رقم" onChange={handleChange} className="w-full p-4 bg-white border-2 border-gray-300 rounded-2xl font-bold text-black outline-none focus:border-[#1a2e2a] shadow-sm" required />
                            </div>
                            <div className="col-span-2">
                                <label className="text-xs font-black text-gray-500 mb-1 block">الاسم الكامل كما بالبطاقة</label>
                                <input name="fullName" placeholder="الاسم الرباعي" onChange={handleChange} className="w-full p-4 bg-white border-2 border-gray-300 rounded-2xl font-bold text-black outline-none focus:border-[#1a2e2a] shadow-sm" required />
                            </div>
                            <div>
                                <label className="text-xs font-black text-gray-500 mb-1 block">الرقم القومي</label>
                                <input name="nationalId" placeholder="14 رقم" maxLength="14" onChange={handleChange} className="w-full p-4 bg-white border-2 border-gray-300 rounded-2xl font-bold text-black outline-none shadow-sm" />
                            </div>
                            <div>
                                <label className="text-xs font-black text-gray-500 mb-1 block">فصيلة الدم</label>
                                <select name="bloodType" onChange={handleChange} className="w-full p-4 bg-white border-2 border-red-200 rounded-2xl font-black text-red-600 outline-none shadow-sm">
                                    <option>A+</option><option>O+</option><option>B+</option><option>AB+</option>
                                    <option>A-</option><option>O-</option><option>B-</option><option>AB-</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* كارت القياسات البدنية مع الأيقونات المرجعة */}
                    <div className="bg-white p-8 rounded-3xl shadow-xl border-r-[12px] border-red-700">
                        <div className="flex items-center gap-3 mb-6 text-red-800 border-b pb-4">
                            <Activity className="bg-red-50 p-2 rounded-xl" size={45} />
                            <h3 className="text-2xl font-black">القياسات البدنية والطبية</h3>
                        </div>
                        <div className="grid grid-cols-3 gap-6">
                            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl border-2 border-gray-100">
                                <Ruler size={32} className="text-gray-400 mb-2" />
                                <label className="text-[10px] font-black mb-1">الطول (سم)</label>
                                <input name="height" placeholder="000" onChange={handleChange} className="w-full bg-white p-2 text-center border-2 border-gray-200 rounded-lg font-black text-black" />
                            </div>
                            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl border-2 border-gray-100">
                                <Activity size={32} className="text-red-500 mb-2" />
                                <label className="text-[10px] font-black mb-1">الوزن (كجم)</label>
                                <input name="weight" placeholder="00" onChange={handleChange} className="w-full bg-white p-2 text-center border-2 border-gray-200 rounded-lg font-black text-black" />
                            </div>
                            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl border-2 border-gray-100">
                                <Heart size={32} className="text-red-700 mb-2" />
                                <label className="text-[10px] font-black mb-1">محيط الصدر</label>
                                <input name="chestSize" placeholder="00" onChange={handleChange} className="w-full bg-white p-2 text-center border-2 border-gray-200 rounded-lg font-black text-black" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* الأبناء والأقارب - تحسين التباين */}
                <div className="bg-white p-8 rounded-3xl shadow-xl border-r-[12px] border-purple-800">
                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                        <h3 className="text-2xl font-black text-purple-900 flex items-center gap-2"><Users /> سجل الأبناء</h3>
                        <button type="button" onClick={() => addMore('children', {name: '', nationalId: ''})} className="flex items-center gap-2 bg-purple-900 text-white px-6 py-3 rounded-2xl font-black hover:bg-black transition-all">
                            <Plus size={20} /> إضافة ابن جديد
                        </button>
                    </div>
                    {formData.children.map((child, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4 bg-purple-50 p-5 rounded-2xl items-center border-2 border-purple-100">
                            <div className="md:col-span-5"><input placeholder="اسم الابن" value={child.name} onChange={(e) => handleNestedChange(e, 'children', index, 'name')} className="w-full p-3 rounded-xl border-2 border-gray-300 font-bold text-black" /></div>
                            <div className="md:col-span-6"><input placeholder="الرقم القومي للابن" value={child.nationalId} onChange={(e) => handleNestedChange(e, 'children', index, 'nationalId')} className="w-full p-3 rounded-xl border-2 border-gray-300 font-bold text-black" /></div>
                            <button type="button" onClick={() => removeField('children', index)} className="text-red-600 hover:bg-red-100 p-3 rounded-full mx-auto transition-colors"><Trash2 size={24} /></button>
                        </div>
                    ))}
                </div>

                {/* الأقارب - تحسين التباين */}
                <div className="bg-white p-8 rounded-3xl shadow-xl border-r-[12px] border-orange-700">
                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                        <h3 className="text-2xl font-black text-orange-900 flex items-center gap-2"><UserPlus /> أقرب الأقارب</h3>
                        <button type="button" onClick={() => addMore('relatives', {name: '', relation: '', nationalId: '', phone: ''})} className="flex items-center gap-2 bg-orange-700 text-white px-6 py-3 rounded-2xl font-black hover:bg-black transition-all">
                            <Plus size={20} /> إضافة قريب للطوارئ
                        </button>
                    </div>
                    {formData.relatives.map((rel, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 bg-orange-50 p-5 rounded-2xl border-2 border-orange-100 relative shadow-sm">
                            <input placeholder="الاسم" value={rel.name} onChange={(e) => handleNestedChange(e, 'relatives', index, 'name')} className="p-3 rounded-xl border-2 border-gray-300 font-bold text-black" />
                            <input placeholder="صلة القرابة" value={rel.relation} onChange={(e) => handleNestedChange(e, 'relatives', index, 'relation')} className="p-3 rounded-xl border-2 border-gray-300 font-bold text-black" />
                            <input placeholder="الرقم القومي" value={rel.nationalId} onChange={(e) => handleNestedChange(e, 'relatives', index, 'nationalId')} className="p-3 rounded-xl border-2 border-gray-300 font-bold text-black" />
                            <div className="flex items-center gap-2">
                                <input placeholder="رقم الهاتف" value={rel.phone} onChange={(e) => handleNestedChange(e, 'relatives', index, 'phone')} className="flex-1 p-3 rounded-xl border-2 border-gray-300 font-bold text-black" />
                                <button type="button" onClick={() => removeField('relatives', index)} className="text-red-600 hover:bg-red-100 p-2 rounded-full transition-colors"><Trash2 size={20} /></button>
                            </div>
                        </div>
                    ))}
                </div>

                <button type="submit" className="w-full bg-[#1a2e2a] text-yellow-500 py-7 rounded-3xl font-black text-3xl shadow-2xl hover:bg-black transition-all border-b-[10px] border-yellow-700 active:translate-y-2 active:border-b-0">
                    تحديث السجل الشامل للكتيبة
                </button>
            </form>
        </div>
    );
};

export default PersonalData;