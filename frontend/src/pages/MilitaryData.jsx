import React, { useState } from 'react';
import axios from 'axios';

const MilitaryData = () => {
    // قائمة محافظات مصر
    const egyptProvinces = [
        "القاهرة", "الجيزة", "الإسكندرية", "الدقهلية", "البحر الأحمر", "البحيرة", "الفيوم", "الغربية", 
        "الإسماعيلية", "المنوفية", "المنيا", "القليوبية", "الوادي الجديد", "السويس", "الشرقية", 
        "أسوان", "أسيوط", "بني سويف", "بورسعيد", "دمياط", "جنوب سيناء", "كفر الشيخ", "مطروح", 
        "الأقصر", "قنا", "شمال سيناء", "سوهاج"
    ];

    const [formData, setFormData] = useState({
        militaryId: '',
        name: '',
        rank: 'جندي',
        tripleNumber: '',
        recruitmentArea: 'القاهرة', // القيمة الافتراضية
        serviceType: '',
        specialization: '',
        unitRole: '',
        warTraining: '',
        companyPlatoon: '',
        joinDate: '',
        dischargeDate: '',
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
        <div className="min-h-screen bg-slate-200 p-4 md:p-8" dir="rtl">
            <div className="max-w-6xl mx-auto bg-white shadow-2xl border-t-8 border-teal-900 rounded-lg">
                <div className="p-6 bg-teal-900 text-white text-center">
                    <h1 className="text-3xl font-black">منظومة سجل البيانات العسكرية - الكتيبة الخامسة</h1>
                </div>

                <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* المجموعة الأولى: التعريف */}
                    <div className="space-y-4 border-l-2 border-gray-100 pl-4">
                        <h3 className="text-xl font-bold text-teal-800 border-b-2 border-teal-100 pb-2">الهوية والتعريف</h3>
                        
                        <input type="text" name="name" placeholder="الاسم الكامل" onChange={handleChange} className="w-full p-2 border-2 border-gray-300 rounded focus:border-teal-600 outline-none" required />
                        
                        <input type="text" name="militaryId" placeholder="الرقم العسكري (12 رقم)" onChange={handleChange} maxLength="12" className="w-full p-2 border-2 border-gray-300 rounded focus:border-teal-600 outline-none" required />

                        <select name="rank" onChange={handleChange} className="w-full p-2 border-2 border-gray-300 rounded bg-white">
                            <option value="جندي">جندي</option>
                            <option value="ضابط صف">ضابط صف</option>
                            <option value="ضابط">ضابط</option>
                        </select>

                        <input type="text" name="tripleNumber" placeholder="الرقم الثلاثي" onChange={handleChange} className="w-full p-2 border-2 border-gray-300 rounded" />
                        
                        {/* قائمة المحافظات المنسدلة */}
                        <div>
                            <label className="block font-bold mb-1 text-teal-900 text-sm">منطقة التجنيد (المحافظة):</label>
                            <select 
                                name="recruitmentArea" 
                                onChange={handleChange} 
                                className="w-full p-2 border-2 border-teal-600 rounded bg-teal-50 font-bold"
                            >
                                {egyptProvinces.sort().map((province, index) => (
                                    <option key={index} value={province}>{province}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* المجموعة الثانية: الخدمة */}
                    <div className="space-y-4 border-l-2 border-gray-100 pl-4">
                        <h3 className="text-xl font-bold text-teal-800 border-b-2 border-teal-100 pb-2">بيانات الخدمة</h3>
                        <input type="text" name="companyPlatoon" placeholder="السرية / الفصيلة" onChange={handleChange} className="w-full p-2 border-2 border-gray-300 rounded" />
                        <input type="text" name="serviceType" placeholder="نوع الخدمة" onChange={handleChange} className="w-full p-2 border-2 border-gray-300 rounded" />
                        <input type="text" name="specialization" placeholder="التخصص" onChange={handleChange} className="w-full p-2 border-2 border-gray-300 rounded" />
                        <input type="text" name="unitRole" placeholder="العمل القائم بالوحدة" onChange={handleChange} className="w-full p-2 border-2 border-gray-300 rounded" />
                        <input type="text" name="warTraining" placeholder="العمل المدرب عليه للحرب" onChange={handleChange} className="w-full p-2 border-2 border-gray-300 rounded" />
                    </div>

                    {/* المجموعة الثالثة: التواريخ */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-teal-800 border-b-2 border-teal-100 pb-2">التواريخ والتحركات</h3>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                                <label>تاريخ الالتحاق</label>
                                <input type="date" name="joinDate" onChange={handleChange} className="w-full border-2 p-2 rounded" />
                            </div>
                            <div>
                                <label className="text-red-600">تاريخ التسريح</label>
                                <input type="date" name="dischargeDate" onChange={handleChange} className="w-full border-2 p-2 rounded border-red-200" />
                            </div>
                        </div>

                        <div className="bg-teal-50 p-4 rounded-md border border-teal-100 space-y-2">
                            <p className="font-bold text-xs text-teal-900">المأموريات والالحاق:</p>
                            <div className="grid grid-cols-2 gap-2">
                                <input type="text" name="missionFrom" placeholder="مأمورية من" onChange={handleChange} className="p-1 border text-sm" />
                                <input type="text" name="missionTo" placeholder="مأمورية على" onChange={handleChange} className="p-1 border text-sm" />
                                <input type="text" name="attachedFrom" placeholder="ملحق من" onChange={handleChange} className="p-1 border text-sm" />
                                <input type="text" name="attachedTo" placeholder="ملحق على" onChange={handleChange} className="p-1 border text-sm" />
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-3">
                        <button type="submit" className="w-full bg-teal-900 text-white py-4 rounded font-black text-2xl hover:bg-black transition-all shadow-xl">
                            حـفـظ الـبـيـانـات عـسـكـريـاً
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MilitaryData;