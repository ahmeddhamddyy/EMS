import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { User, ChevronRight, Loader2, Printer, ArrowRight, Search } from "lucide-react";

const CategoryList = () => {
  const { category } = useParams(); 
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]); // مصفوفة البحث ✅
  const [searchTerm, setSearchTerm] = useState("");     // نص البحث ✅
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      try {
        const decodedCategory = decodeURIComponent(category);
        const res = await axios.get(`http://localhost:5000/api/soldier/category/${decodedCategory}`);
        if (res.data.success) {
          setList(res.data.list);
          setFilteredList(res.data.list); // تعيين القائمة الأصلية للبحث
        }
      } catch (err) {
        console.error("خطأ في جلب البيانات");
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryData();
  }, [category]);

  // منطق البحث اللحظي ✅
  useEffect(() => {
    const results = list.filter(soldier =>
      soldier.name.includes(searchTerm) || 
      soldier.militaryId.includes(searchTerm)
    );
    setFilteredList(results);
  }, [searchTerm, list]);

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#1a2e2a]" size={50} /></div>;

  return (
    <div className="p-8 text-right font-sans min-h-screen bg-gray-50" dir="rtl">
      
      {/* Header */}
      <div className="bg-[#1a2e2a] p-8 rounded-[2.5rem] shadow-xl border-b-8 border-yellow-600 mb-6 flex flex-col md:flex-row justify-between items-center text-white relative">
        <div className="z-10">
          <button onClick={() => navigate(-1)} className="text-yellow-500 flex items-center gap-1 mb-2 text-sm font-bold">
            <ArrowRight size={16}/> العودة للوحة التحكم
          </button>
          <h2 className="text-3xl font-black italic">كشف: {decodeURIComponent(category)}</h2>
          <p className="text-yellow-500 font-bold mt-1">القوة: {filteredList.length} فرد</p>
        </div>
        
        {/* خانة البحث الجديدة ✅ */}
        <div className="relative mt-4 md:mt-0 w-full md:w-96 z-10">
          <input
            type="text"
            placeholder="ابحث بالاسم أو الرقم العسكري مباشرة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-4 pr-12 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:bg-white focus:text-black transition-all outline-none font-bold"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-yellow-500" size={24} />
        </div>
      </div>

      {/* عرض القائمة المفلترة */}
      {filteredList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {filteredList.map((soldier) => (
            <div key={soldier._id} 
                 onClick={() => navigate(`/admin-dashboard/full-report/${soldier.militaryId}`)}
                 className="bg-white p-6 rounded-3xl shadow-lg border-2 border-transparent hover:border-yellow-600 transition-all cursor-pointer group">
              
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden border-2 border-gray-100 group-hover:border-yellow-500">
                  {soldier.image ? <img src={soldier.image} className="w-full h-full object-cover" alt="" /> : <User className="w-full h-full p-2 text-gray-300" />}
                </div>
                
                <div className="flex-1">
                  <h4 className="font-black text-[#1a2e2a] group-hover:text-yellow-600 transition-colors">{soldier.name}</h4>
                  <p className="text-[10px] font-bold text-gray-400">م: {soldier.militaryId}</p>
                  <p className="text-[11px] text-teal-600 font-black mt-1">{soldier.rank}</p>
                </div>
                <ChevronRight className="text-gray-300 group-hover:text-yellow-600 transition-transform group-hover:translate-x-[-5px]" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-[2.5rem] shadow-sm border-2 border-dashed">
          <p className="text-2xl font-black text-gray-300">لا توجد نتائج مطابقة لبحثك</p>
        </div>
      )}
    </div>
  );
};

export default CategoryList;