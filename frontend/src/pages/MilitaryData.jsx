import React, { useState } from 'react';
import axios from 'axios';
import { Shield, HardHat, Save, Award, MapPin, Calendar, Briefcase, UserCheck } from 'lucide-react';

const MilitaryData = () => {
    const egyptProvinces = ["القاهرة", "الجيزة", "الإسكندرية", "الدقهلية", "البحر الأحمر", "البحيرة", "الفيوم", "الغربية", "الإسماعيلية", "المنوفية", "المنيا", "القليوبية", "الوادي الجديد", "السويس", "الشرقية", "أسوان", "أسيوط", "بني سويف", "بورسعيد", "دمياط", "جنوب سيناء", "كفر الشيخ", "مطروح", "الأقصر", "قنا", "شمال سيناء", "سوهاج"];

    const [formData, setFormData] = useState({
        name: '',
        militaryId: '',
        rankCategory: 'جندي', // الحقل الجديد المضاف
        serviceType: '',
        serviceDuration: '',
        specialization: '',
        unitRole: '',
        warTraining: '',
        joinDate: '',
        dischargeDate: '',
        tripleNumber: '',
        recruitmentArea: 'القاهرة',
        companyPlatoon: '',
        unitJoinDate: '',
        missionFrom: '',
        missionTo: '',
        attachedFrom: '',
        attachedTo: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://127.0.0.1:5000/api/soldier/add", formData);
            if (res.data.success) {
                alert("✅ تم حفظ البيانات العسكرية بنجاح");
            }
        } catch (err) {
            alert("❌ خطأ في الحفظ: الرقم العسكري مسجل مسبقاً أو السيرفر غير متصل");
        }
    };

    return (
        <div className="min-h-screen bg-[#eaeeed] p-4 md:p-8 text-right" dir="rtl">
            <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden border-[6px] border-[#1a2e2a]">
                
                {/* الرأس (Header) */}
                <div className="bg-[#1a2e2a] p-6 text-white flex justify-between items-center border-b-[6px] border-yellow-600">
                    <div className="flex items-center gap-4">
                        <img src="https://flagcdn.com/w80/eg.png" alt="Egypt" className="w-12 shadow-md border border-white/20" />
                        <h1 className="text-3xl font-black italic">سجل البيانات العسكرية - الكتيبة ٥</h1>
                    </div>
                    <Shield size={40} className="text-yellow-500" />
                </div>

                <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* المجموعة الأولى: التعريف الأساسي */}
                    <div className="space-y-4 bg-gray-50 p-6 rounded-2xl border-2 border-gray-200 shadow-inner">
                        <h3 className="text-xl font-black text-[#1a2e2a] flex items-center gap-2 border-b-2 border-yellow-500 pb-2 mb-4">
                            <UserCheck size={20} /> البيانات الأساسية
                        </h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-black text-gray-600 mb-1">الاسم الكامل</label>
                                <input name="name" onChange={handleChange} className="w-full p-3 bg-white border-2 border-gray-400 rounded-xl font-bold text-black outline-none focus:border-[#1a2e2a]" required />
                            </div>

                            {/* الحقل الجديد: فئة العسكري */}
                            <div>
                                <label className="block text-xs font-black text-[#1a2e2a] mb-1">الفئة (الرتبة)</label>
                                <select 
                                    name="rankCategory" 
                                    onChange={handleChange} 
                                    className="w-full p-3 bg-white border-2 border-gray-400 rounded-xl font-black text-black outline-none focus:border-[#1a2e2a]"
                                    required
                                >
                                    <option value="جندي">جندي</option>
                                    <option value="صف">صف</option>
                                    <option value="ضابط">ضابط</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-600 mb-1">الرقم العسكري (12 رقم)</label>
                                <input name="militaryId" maxLength="12" onChange={handleChange} className="w-full p-3 bg-white border-2 border-gray-400 rounded-xl font-black text-black outline-none focus:border-[#1a2e2a]" required />
                            </div>
                            
                            <input name="tripleNumber" placeholder="الرقم الثلاثي" onChange={handleChange} className="w-full p-3 border-2 border-gray-400 rounded-xl font-bold text-black bg-white" />
                            
                            <div className="flex items-center gap-2 bg-white p-2 border-2 border-gray-400 rounded-xl">
                                <MapPin size={20} className="text-gray-400" />
                                <select name="recruitmentArea" onChange={handleChange} className="w-full bg-transparent font-bold text-black outline-none">
                                    {egyptProvinces.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* المجموعة الثانية: بيانات الخدمة والمهام */}
                    <div className="space-y-4 bg-gray-50 p-6 rounded-2xl border-2 border-gray-200 shadow-inner">
                        <h3 className="text-xl font-black text-[#1a2e2a] flex items-center gap-2 border-b-2 border-yellow-500 pb-2 mb-4">
                            <Briefcase size={20} /> بيانات الخدمة
                        </h3>
                        <div className="space-y-3">
                            <input name="serviceType" placeholder="نوع الخدمة" onChange={handleChange} className="w-full p-3 bg-white border-2 border-gray-400 rounded-xl font-bold text-black" />
                            <input name="serviceDuration" placeholder="مدة الخدمة" onChange={handleChange} className="w-full p-3 bg-white border-2 border-gray-400 rounded-xl font-bold text-black" />
                            <input name="specialization" placeholder="التخصص" onChange={handleChange} className="w-full p-3 bg-white border-2 border-gray-400 rounded-xl font-bold text-black" />
                            <input name="unitRole" placeholder="العمل القائم بالوحدة" onChange={handleChange} className="w-full p-3 bg-white border-2 border-gray-400 rounded-xl font-bold text-black" />
                            <input name="warTraining" placeholder="العمل المدرب عليه للحرب" onChange={handleChange} className="w-full p-3 bg-white border-2 border-gray-400 rounded-xl font-bold text-black" />
                            <input name="companyPlatoon" placeholder="السرية والفصيلة" onChange={handleChange} className="w-full p-3 bg-white border-2 border-gray-400 rounded-xl font-bold text-black" />
                        </div>
                    </div>

                    {/* المجموعة الثالثة: التحركات والتواريخ */}
                    <div className="space-y-4 bg-gray-50 p-6 rounded-2xl border-2 border-gray-200 shadow-inner">
                        <h3 className="text-xl font-black text-[#1a2e2a] flex items-center gap-2 border-b-2 border-yellow-500 pb-2 mb-4">
                            <Calendar size={20} /> المواعيد والتحركات
                        </h3>
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-2 text-[10px] font-black">
                                <div>تاريخ الالتحاق<input type="date" name="joinDate" onChange={handleChange} className="w-full p-2 border-2 border-gray-400 rounded-lg text-black font-bold" /></div>
                                <div className="text-red-700">تاريخ التسريح<input type="date" name="dischargeDate" onChange={handleChange} className="w-full p-2 border-2 border-red-300 rounded-lg text-black font-bold" /></div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-500 mr-1">تاريخ الضم على الوحدة</label>
                                <input type="date" name="unitJoinDate" onChange={handleChange} className="w-full p-2 border-2 border-gray-400 rounded-lg font-bold text-black" />
                            </div>
                            <div className="bg-yellow-50 p-4 rounded-xl border-2 border-yellow-200 space-y-2">
                                <p className="text-[10px] font-black text-[#1a2e2a]">المأموريات والإلحاق:</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <input name="missionFrom" placeholder="مأمورية من" onChange={handleChange} className="p-2 border border-gray-300 rounded-lg text-xs font-bold text-black" />
                                    <input name="missionTo" placeholder="مأمورية على" onChange={handleChange} className="p-2 border border-gray-300 rounded-lg text-xs font-bold text-black" />
                                    <input name="attachedFrom" placeholder="ملحق من" onChange={handleChange} className="p-2 border border-gray-300 rounded-lg text-xs font-bold text-black" />
                                    <input name="attachedTo" placeholder="ملحق على" onChange={handleChange} className="p-2 border border-gray-300 rounded-lg text-xs font-bold text-black" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="md:col-span-3 bg-[#1a2e2a] text-yellow-500 py-6 rounded-2xl font-black text-3xl hover:bg-black shadow-2xl transition-all border-b-[10px] border-yellow-700 active:translate-y-2 active:border-b-0">
                        تـسـجـيـل بـيـانـات الـمـحـارب
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MilitaryData;