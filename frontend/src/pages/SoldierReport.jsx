import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Printer,
  ArrowRight,
  Shield,
  User,
  Heart,
  Briefcase,
  Award,
  AlertTriangle,
} from "lucide-react";
import RG_LOGO from "../assets/rg.png";

const SoldierReport = () => {
  const { id } = useParams();
  const [soldier, setSoldier] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSoldier = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/soldier/full-report/${id}`,
        );
        if (res.data.success) setSoldier(res.data.soldier);
      } catch (err) {
        console.error("خطأ في جلب البيانات");
      }
    };
    fetchSoldier();
  }, [id]);

  if (!soldier)
    return (
      <div className="text-center p-20 font-black text-2xl">
        جاري استخراج السجل العسكري الشامل...
      </div>
    );

  const career = soldier.careerHistory || {};

  return (
    <div
      className="min-h-screen bg-gray-100 p-4 font-sans text-right"
      dir="rtl"
    >
      {/* أزرار التحكم */}
      <div className="max-w-5xl mx-auto flex justify-between items-center mb-6 print:hidden">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow font-bold text-gray-700"
        >
          <ArrowRight size={20} /> رجوع
        </button>
        <button
          onClick={() => window.print()}
          className="bg-[#1a2e2a] text-yellow-500 px-8 py-3 rounded-xl font-black shadow-lg flex items-center gap-2"
        >
          <Printer size={20} /> طـبـاعـة الـمـلـف الـكـامـل
        </button>
      </div>

      {/* الورقة الرسمية */}
      <div className="max-w-[210mm] mx-auto bg-white p-10 shadow-2xl print:shadow-none print:p-4">
        {/* Header */}
        <div className="flex justify-between items-center border-b-4 border-[#1a2e2a] pb-4 mb-6">
          <div className="text-center font-black text-[#1a2e2a] text-xs">
            <p>قوات الحرس الجمهوري</p>
            <p>الكتيبة الخامسة</p>
          </div>
          <img src={RG_LOGO} className="w-20 h-20 object-contain" alt="Logo" />
          <div className="text-center font-black text-[#1a2e2a]">
            <h1 className="text-2xl underline decoration-yellow-600 underline-offset-8">
              بيان حالة شامل
            </h1>
            <p className="text-sm mt-2 font-mono">ID: {soldier.militaryId}</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* 1. البيانات العسكرية */}
          <section>
            <h2 className="bg-gray-50 p-2 font-black text-[#1a2e2a] border-r-4 border-yellow-600 mb-3 flex items-center gap-2">
              <Shield size={18} /> البيانات العسكرية الأساسية
            </h2>
            <div className="grid grid-cols-3 gap-4 text-sm px-2 font-bold">
              <p>
                الاسم:{" "}
                <span className="text-black font-black">{soldier.name}</span>
              </p>
              <p>
                الرقم العسكري:{" "}
                <span className="text-black font-black">
                  {soldier.militaryId}
                </span>
              </p>
              <p>
                الرتبة:{" "}
                <span className="text-black font-black">
                  {soldier.rankCategory} / {soldier.rank}
                </span>
              </p>
              <p>
                السلاح:{" "}
                <span className="text-black font-black">
                  {soldier.specialization}
                </span>
              </p>
              <p>
                فصيلة/سرية:{" "}
                <span className="text-black font-black">
                  {soldier.companyPlatoon}
                </span>
              </p>
              <p>
                تاريخ الانضمام:{" "}
                <span className="text-black font-black">
                  {soldier.joinDate
                    ? new Date(soldier.joinDate).toLocaleDateString("ar-EG")
                    : "---"}
                </span>
              </p>
            </div>
          </section>

          {/* 2. البيانات الشخصية والاجتماعية */}
          <section>
            <h2 className="bg-gray-50 p-2 font-black text-[#1a2e2a] border-r-4 border-yellow-600 mb-3 flex items-center gap-2">
              <User size={18} /> البيانات الشخصية والاجتماعية
            </h2>
            <div className="grid grid-cols-3 gap-4 text-sm px-2 font-bold">
              <p>
                الرقم القومي:{" "}
                <span className="text-black font-black">
                  {soldier.nationalId}
                </span>
              </p>
              <p>
                تاريخ الميلاد:{" "}
                <span className="text-black font-black">
                  {soldier.birthDate
                    ? new Date(soldier.birthDate).toLocaleDateString("ar-EG")
                    : "---"}
                </span>
              </p>
              <p>
                فصيلة الدم:{" "}
                <span className="text-red-600 font-black">
                  {soldier.bloodType}
                </span>
              </p>
              <p>
                المؤهل:{" "}
                <span className="text-black font-black">
                  {soldier.qualification}
                </span>
              </p>
              <p className="col-span-2 text-right">
                العنوان:{" "}
                <span className="text-black font-black">
                  {soldier.province} - {soldier.birthPlace}
                </span>
              </p>
            </div>
          </section>

          {/* 3. الحالة العائلية (الزوجة والأبناء) */}
          <section>
            <h2 className="bg-gray-50 p-2 font-black text-[#1a2e2a] border-r-4 border-yellow-600 mb-3 flex items-center gap-2">
              <Heart size={18} /> الحالة العائلية
            </h2>
            <div className="px-4 text-sm font-bold">
              {soldier.spouse?.name ? (
                <p className="mb-2">
                  الزوجة: {soldier.spouse.name} - الرقم القومي:{" "}
                  {soldier.spouse.nationalId}
                </p>
              ) : (
                <p className="text-gray-400">لا يوجد بيانات زواج مسجلة</p>
              )}
              <p className="mt-2 text-[#1a2e2a]">
                الأبناء: {soldier.children?.length || 0}
              </p>
              <div className="flex gap-4 mt-1 flex-wrap">
                {soldier.children?.map((child, idx) => (
                  <span key={idx} className="bg-gray-100 px-2 py-1 rounded">
                    -{child.name} ({child.gender})
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* 4. السجل الانضباطي والفرق (Career History) */}
          <section>
            <h2 className="bg-gray-50 p-2 font-black text-[#1a2e2a] border-r-4 border-yellow-600 mb-3 flex items-center gap-2">
              <Award size={18} /> السجل الوظيفي والفرق والجزاءات
            </h2>
            <div className="grid grid-cols-2 gap-6 px-4">
              {/* الفرق */}
              <div className="border p-3 rounded-lg">
                <p className="font-black text-sm border-b mb-2">
                  الفرق والدورات الحاصل عليها:
                </p>
                <ul className="text-xs list-disc pr-4 space-y-1">
                  {career.courses?.length > 0 ? (
                    career.courses.map((c, i) => (
                      <li key={i}>
                        {c.courseName} - تقدير: {c.grade}
                      </li>
                    ))
                  ) : (
                    <li>لا يوجد</li>
                  )}
                </ul>
              </div>
              {/* الجزاءات */}
              <div className="border border-red-100 p-3 rounded-lg">
                <p className="font-black text-sm border-b border-red-100 mb-2 text-red-700 flex items-center gap-1">
                  <AlertTriangle size={14} /> الجزاءات المسجلة:
                </p>
                <ul className="text-xs list-disc pr-4 space-y-1 text-red-600">
                  {career.penalties?.length > 0 ? (
                    career.penalties.map((p, i) => (
                      <li key={i}>
                        {p.penaltyType}: {p.reason}
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-400 font-normal">السجل نظيف</li>
                  )}
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* التوقيعات */}
        <div className="mt-24 flex justify-between items-center font-black text-[#1a2e2a]">
          <div className="text-center">
            <p className="underline italic">توقيع ض.ص الأفراد</p>
            <p className="mt-12">................................</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-gray-400 italic">
              طُبع إلكترونياً - منظومة الكتيبة ٥
            </p>
            <p className="text-[10px] text-gray-400 font-normal">
              {new Date().toLocaleDateString("ar-EG")}
            </p>
          </div>
          <div className="text-center">
            <p className="underline italic">توقيع قائد الكتيبة</p>
            <p className="mt-12">................................</p>
          </div>
        </div>
      </div>

      <style>
        {`
                    @media print {
                        body { background: white; }
                        .print\:hidden { display: none !important; }
                        .shadow-2xl { box-shadow: none !important; }
                        @page { margin: 10mm; }
                    }
                `}
      </style>
    </div>
  );
};

export default SoldierReport;