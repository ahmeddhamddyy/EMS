import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // أضفنا هذا للتنقل
import {
  Search,
  User,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  FileText,
} from "lucide-react";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // محرك التنقل ✅

  useEffect(() => {
    const fetchResults = async () => {
      if (query.length > 2) {
        setLoading(true);
        try {
          // حذفنا التوكن والـ Headers ليعمل أوفلاين بسرعة ✅
          const res = await axios.get(
            `http://127.0.0.1:5000/api/soldier/search?query=${query}`,
          );
          setResults(res.data.soldiers);
        } catch (err) {
          console.error("خطأ في البحث:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    };

    const timer = setTimeout(fetchResults, 400);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div
      className="space-y-6 animate-in fade-in duration-500 text-right"
      dir="rtl"
    >
      {/* رأس صفحة البحث */}
      <div className="bg-[#1a2e2a] p-10 rounded-[2rem] shadow-2xl border-b-8 border-yellow-600 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3">
            <Search className="text-yellow-500" size={35} /> مركز الاستعلام
            الرقمي
          </h2>
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث بالاسم الرباعي أو الرقم العسكري..."
              className="w-full p-6 pr-16 bg-white rounded-2xl font-black text-xl text-[#1a2e2a] shadow-inner outline-none focus:ring-4 focus:ring-yellow-600/50 transition-all"
            />
            <div className="absolute right-5 top-1/2 -translate-y-1/2">
              {loading ? (
                <Loader2 className="animate-spin text-yellow-600" size={30} />
              ) : (
                <Search className="text-gray-400" size={30} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* نتائج البحث */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
        {results.map((s) => (
          <div
            key={s._id}
            onClick={() => navigate(`/admin-dashboard/report/${s.militaryId}`)} // التوجه للتقرير عند الضغط ✅
            className="bg-white p-6 rounded-3xl shadow-lg border-r-[10px] border-yellow-600 hover:scale-[1.02] transition-all cursor-pointer flex justify-between items-center group"
          >
            <div className="flex items-center gap-5">
              <div className="bg-[#1a2e2a] text-yellow-500 p-4 rounded-2xl shadow-md group-hover:bg-black transition-colors">
                <User size={35} />
              </div>
              <div>
                <h3 className="font-black text-[#1a2e2a] text-xl mb-1">
                  {s.name}
                </h3>
                <div className="flex gap-4">
                  <p className="text-gray-500 font-bold text-xs">
                    الرقم:{" "}
                    <span className="text-[#1a2e2a]">{s.militaryId}</span>
                  </p>
                  <p className="text-gray-500 font-bold text-xs">
                    الحالة:{" "}
                    <span className="text-red-700 font-black">
                      {s.status || "موجود"}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <FileText size={14} className="text-yellow-600" />
                  <span className="text-[10px] font-black text-[#1a2e2a] uppercase tracking-tighter">
                    اضغط لفتح بيان الحالة الكامل والطباعة
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-2 rounded-full group-hover:bg-yellow-50 transition-all">
              <ArrowLeft className="text-gray-300 group-hover:text-yellow-600 transition-colors" />
            </div>
          </div>
        ))}

        {/* حالة عدم وجود نتائج */}
        {query.length > 2 && results.length === 0 && !loading && (
          <div className="col-span-full text-center p-20 bg-white rounded-[2rem] border-4 border-dashed border-gray-100 shadow-inner">
            <ShieldCheck className="mx-auto text-gray-200 mb-4" size={80} />
            <p className="text-gray-400 font-black text-xl italic uppercase tracking-widest">
              لا توجد بيانات مطابقة للسجلات العسكرية
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
