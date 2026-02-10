// client/src/pages/ReserveNotebook.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FolderOpen, Search, AlertCircle, Printer, Loader2 } from "lucide-react";

const ReserveNotebook = () => {
  const [month, setMonth] = useState("04");
  const [year, setYear] = useState("2026");
  const [list, setList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const dischargeDate = `01-${month}-${year}`;

  const fetchReserve = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/soldier/category/رديف`);
      if (res.data.success) {
        // فلترة القائمة حسب التاريخ المختار
        const filtered = res.data.list.filter(s => s.dischargeDate === dischargeDate);
        setList(filtered);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchReserve(); }, [month, year]);

  const handleDischarge = async () => {
    if (window.confirm(`هل أنت متأكد من تسريح جميع أفراد دفعة ${dischargeDate}؟`)) {
      try {
        const res = await axios.post("http://localhost:5000/api/soldier/discharge-batch", { dischargeDate });
        alert(res.data.message);
        fetchReserve();
      } catch (err) { alert("خطأ في العملية"); }
    }
  };

  return (
    <div className="p-8 text-right bg-gray-50 min-h-screen" dir="rtl">
      {/* Header */}
      <div className="bg-[#2c3e50] p-10 rounded-[3rem] shadow-xl text-white mb-8 border-b-8 border-gray-600">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-4xl font-black italic flex items-center gap-3">
              <FolderOpen size={40} className="text-yellow-500" /> دفتر الرديف والأرشيف
            </h2>
            <p className="mt-2 text-gray-300">إدارة دفعات إنهاء الخدمة لعام {year}</p>
          </div>
          <button onClick={handleDischarge} className="bg-red-600 px-8 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-red-700 transition-all shadow-lg">
            <AlertCircle size={20} /> تسريح دفعة {dischargeDate}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
           <select value={month} onChange={(e)=>setMonth(e.target.value)} className="p-4 rounded-xl bg-white/10 border border-white/20 outline-none font-bold">
              {["01", "04", "07", "10"].map(m => <option key={m} value={m} className="text-black">دفعة شهر {m}</option>)}
           </select>
           <input type="number" value={year} onChange={(e)=>setYear(e.target.value)} className="p-4 rounded-xl bg-white/10 border border-white/20 outline-none font-bold text-white" />
           <div className="relative">
             <input type="text" placeholder="بحث في الأرشيف..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} className="w-full p-4 pr-12 rounded-xl bg-white text-black outline-none font-bold" />
             <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
           </div>
        </div>
      </div>

      {/* List */}
      {loading ? <Loader2 className="animate-spin mx-auto mt-20" size={50} /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.filter(s => s.name.includes(searchTerm)).map(soldier => (
            <div key={soldier._id} className="bg-white p-6 rounded-3xl border-r-8 border-gray-400 shadow-sm">
              <h4 className="font-black text-gray-800">{soldier.name}</h4>
              <p className="text-xs font-bold text-gray-400">الرقم العسكري: {soldier.militaryId}</p>
              <div className="mt-3 py-1 px-3 bg-gray-100 rounded-lg inline-block text-[10px] font-bold text-gray-600">
                الحالة: رديف (دُفعة {soldier.dischargeDate})
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReserveNotebook;