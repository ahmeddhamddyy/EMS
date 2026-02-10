import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { User, ChevronRight, Loader2, Printer } from "lucide-react";

const CategoryList = () => {
  const { category } = useParams(); // استقبال النوع من الرابط
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // داخل ملف CategoryList.jsx ✅
useEffect(() => {
  const fetchCategoryData = async () => {
    try {
      setLoading(true);
      // ترجمة الرابط لو جاي reserve-archive يحوله لـ "رديف" قبل الطلب
      const targetCategory = category === "reserve-archive" ? "رديف" : category;
      
      const res = await axios.get(`http://127.0.0.1:5000/api/soldier/category/${targetCategory}`);
      
      if (res.data.success) {
        setList(res.data.list);
      }
    } catch (err) {
      console.error("❌ خطأ في جلب بيانات الفئة:", err);
    } finally {
      setLoading(false);
    }
  };
  fetchCategoryData();
}, [category]);

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="p-8 text-right font-sans" dir="rtl">
      <div className="bg-[#1a2e2a] p-8 rounded-[2.5rem] shadow-xl border-b-8 border-yellow-600 mb-8 flex justify-between items-center text-white">
        <div>
          <h2 className="text-3xl font-black italic">كشف تفصيلي: فئة الـ {category}</h2>
          <p className="text-yellow-500 font-bold mt-2 font-mono">إجمالي القوة الحالية: {list.length} فرد</p>
        </div>
        <Printer className="cursor-pointer hover:text-yellow-500 transition-all" size={35} onClick={() => window.print()} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map((soldier) => (
          <div key={soldier._id} 
               onClick={() => navigate(`/admin-dashboard/full-report/${soldier.militaryId}`)}
               className="bg-white p-6 rounded-3xl shadow-lg border-2 border-gray-100 hover:border-yellow-600 transition-all cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden border-2 border-gray-200">
                {soldier.image ? <img src={soldier.image} className="w-full h-full object-cover" /> : <User className="w-full h-full p-2 text-gray-300" />}
              </div>
              <div className="flex-1">
                <h4 className="font-black text-[#1a2e2a] group-hover:text-yellow-600 transition-colors">{soldier.name}</h4>
                <p className="text-xs font-bold text-gray-400">الرقم العسكري: {soldier.militaryId}</p>
                <p className="text-[10px] text-teal-600 font-black mt-1">{soldier.rank} / {soldier.specialization}</p>
              </div>
              <ChevronRight className="text-gray-300 group-hover:text-yellow-600" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;