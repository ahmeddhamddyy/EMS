import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  User, 
  FileText, 
  Printer, 
  Shield, 
  Loader2,
  ChevronLeft
} from "lucide-react";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    try {
      const res = await axios.get(`http://127.0.0.1:5000/api/soldier/search?query=${query.trim()}`);
      if (res.data.success) {
        setResults(res.data.soldiers);
      }
    } catch (err) {
      console.error("خطأ في البحث:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 text-right font-sans min-h-screen bg-gray-50" dir="rtl">
      {/* رأس الصفحة - Header */}
      <div className="bg-[#1a2e2a] p-10 rounded-[3rem] shadow-2xl border-b-8 border-yellow-600 mb-10 flex justify-between items-center text-white relative overflow-hidden">
        <div className="z-10">
          <h2 className="text-4xl font-black italic mb-2">مركز الاستعلام العسكري</h2>
          <p className="text-yellow-500 font-bold tracking-widest text-sm uppercase">البحث في السجلات الرقمية - الكتيبة ٥</p>
        </div>
        <Search size={80} className="opacity-10 absolute left-10 text-white" />
      </div>

      {/* شريط البحث */}
      <div className="max-w-4xl mx-auto mb-12">
        <form onSubmit={handleSearch} className="relative group">
          <input
            type="text"
            className="w-full p-6 pr-16 rounded-[2rem] shadow-xl border-4 border-white focus:border-yellow-600 outline-none font-black text-xl transition-all"
            placeholder="ابحث بالاسم الرباعي أو الرقم العسكري (13 رقم)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-yellow-600" size={30} />
          <button type="submit" className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#1a2e2a] text-yellow-500 px-8 py-3 rounded-2xl font-black hover:bg-black transition-all">
            استعلام
          </button>
        </form>
      </div>

      {/* عرض النتائج على هيئة كروت ✅ */}
      {loading ? (
        <div className="flex justify-center p-20"><Loader2 className="animate-spin text-[#1a2e2a]" size={50} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {results.map((soldier) => (
            <div key={soldier._id} className="bg-white rounded-[2.5rem] shadow-lg border-2 border-gray-100 overflow-hidden hover:shadow-2xl transition-all group border-b-8 border-b-transparent hover:border-b-yellow-600">
              <div className="p-6">
                <div className="flex items-center gap-6 mb-6">
                  {/* صورة الفرد المرفوعة ✅ */}
                  <div className="w-24 h-24 rounded-2xl bg-gray-100 border-2 border-yellow-500/20 overflow-hidden shadow-inner">
                    {soldier.image ? (
                      <img src={soldier.image} alt={soldier.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300"><User size={40} /></div>
                    )}
                  </div>
                  <div>
                    <span className="bg-[#1a2e2a] text-yellow-500 px-3 py-1 rounded-lg text-xs font-black mb-2 inline-block">
                      {soldier.rank}
                    </span>
                    <h3 className="text-xl font-black text-[#1a2e2a] leading-tight">{soldier.name}</h3>
                  </div>
                </div>

                <div className="space-y-3 border-t border-dashed pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 font-bold">الرقم العسكري:</span>
                    <span className="font-black text-[#1a2e2a] tracking-widest">{soldier.militaryId}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 font-bold">الحالة الحالية:</span>
                    <span className="text-green-600 font-black">{soldier.status || "موجود بالوحدة"}</span>
                  </div>
                </div>

                {/* أزرار التحكم ✅ */}
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <button 
                    onClick={() => navigate(`/admin-dashboard/full-report/${soldier.militaryId}`)}
                    className="flex items-center justify-center gap-2 bg-gray-100 text-[#1a2e2a] py-3 rounded-xl font-black text-sm hover:bg-[#1a2e2a] hover:text-white transition-all"
                  >
                    <FileText size={16} /> ملف الحالة
                  </button>
                  <button 
                    onClick={() => navigate(`/admin-dashboard/print-report/${soldier.militaryId}`)}
                    className="flex items-center justify-center gap-2 bg-yellow-600 text-[#1a2e2a] py-3 rounded-xl font-black text-sm hover:bg-yellow-500 transition-all shadow-md"
                  >
                    <Printer size={16} /> طباعة التمام
                  </button>
                </div>
              </div>
              <button 
                onClick={() => navigate(`/admin-dashboard/full-report/${soldier.militaryId}`)}
                className="w-full py-2 bg-gray-50 text-gray-400 text-xs font-bold hover:text-[#1a2e2a] flex items-center justify-center gap-1"
              >
                تفاصيل إضافية <ChevronLeft size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* في حالة عدم وجود نتائج */}
      {!loading && results.length === 0 && query && (
        <div className="text-center p-20 bg-white rounded-[3rem] shadow-inner border-4 border-dashed border-gray-100">
          <Shield size={60} className="mx-auto text-gray-200 mb-4" />
          <h3 className="text-2xl font-black text-gray-400">لا توجد سجلات مطابقة لهذا البحث</h3>
        </div>
      )}
    </div>
  );
};

export default SearchPage;