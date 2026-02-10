import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaUserAlt, FaIdCard, FaChevronLeft } from "react-icons/fa";

const SearchSoldier = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    const val = e.target.value;
    setQuery(val);
    if (val.length > 2) {
      try {
        const res = await axios.get(`http://localhost:5000/api/soldier/search?query=${val}`);
        if (res.data.success) setResults(res.data.soldiers);
      } catch (err) { console.error(err); }
    } else {
      setResults([]);
    }
  };

  return (
    <div className="p-8 bg-[#eaeeed] min-h-screen" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-black text-teal-900 mb-8 flex items-center gap-3 italic">
          <FaSearch className="text-yellow-600" /> مركز الاستعلام العسكري الموحد
        </h2>

        {/* مربع البحث */}
        <div className="relative mb-10 group">
          <input
            type="text"
            placeholder="ابحث بالاسم الرباعي أو الرقم العسكري (13 رقم)..."
            value={query}
            onChange={handleSearch}
            className="w-full p-6 pr-14 rounded-3xl border-4 border-white shadow-2xl outline-none focus:border-yellow-600 transition-all text-xl font-bold text-teal-900"
          />
          <FaSearch className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-yellow-600 transition-colors" size={25} />
        </div>

        {/* نتائج البحث */}
        <div className="grid grid-cols-1 gap-4">
          {results.map((soldier) => (
            <div
              key={soldier.militaryId}
              onClick={() => navigate(`/admin-dashboard/soldier-profile/${soldier.militaryId}`)}
              className="bg-white p-5 rounded-2xl shadow-md border-r-8 border-teal-800 hover:scale-[1.02] cursor-pointer transition-all flex justify-between items-center group"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-teal-100 shadow-inner bg-gray-50">
                   <img src={soldier.image || "/avatar.png"} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-black text-xl text-teal-900 group-hover:text-yellow-600 transition-colors">{soldier.name}</h3>
                  <div className="flex gap-4 text-sm text-gray-500 font-bold mt-1">
                    <span className="flex items-center gap-1"><FaIdCard /> {soldier.militaryId}</span>
                    <span className="flex items-center gap-1"><FaUserAlt /> {soldier.rank}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-teal-800 font-black italic">
                <span>فتح الملف الرقمي</span>
                <FaChevronLeft className="group-hover:-translate-x-2 transition-transform" />
              </div>
            </div>
          ))}

          {query.length > 2 && results.length === 0 && (
            <div className="text-center p-10 bg-white rounded-3xl shadow-inner border-2 border-dashed border-gray-300">
              <p className="text-gray-400 font-black text-lg">⚠️ لا يوجد سجل مطابق لهذا البحث في قاعدة البيانات</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchSoldier;