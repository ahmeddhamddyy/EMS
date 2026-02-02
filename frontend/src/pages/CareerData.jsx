import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Award,
  Landmark,
  GraduationCap,
  Gavel,
  Plus,
  Trash2,
  Save,
  FileText,
} from "lucide-react";

const CareerData = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const passedId = location.state?.militaryId || "";

  const [formData, setFormData] = useState({
    militaryId: passedId,
    promotions: [{ rank: "", date: "", orderNumber: "" }],
    units: [
      {
        unitName: "",
        fromDate: "",
        toDate: "",
        role: "",
        joinOrder: "",
        endOrder: "",
      },
    ],
    courses: [{ courseName: "", place: "", grade: "", date: "" }],
    penalties: [{ penaltyType: "", reason: "", authority: "", date: "" }],
    efficiencyReports: [{ year: "", rating: "", notes: "" }],
  });

  const handleNestedChange = (index, section, field, value) => {
    const updatedSection = [...formData[section]];
    updatedSection[index][field] = value;
    setFormData({ ...formData, [section]: updatedSection });
  };

  const addField = (section, template) => {
    setFormData({ ...formData, [section]: [...formData[section], template] });
  };

  const removeField = (index, section) => {
    const updatedSection = formData[section].filter((_, i) => i !== index);
    setFormData({ ...formData, [section]: updatedSection });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/api/soldier/update-career",
        formData
      );
      if (res.data.success) {
        alert("🎉 اكتمل تسجيل ملف المحارب بنجاح!");
        navigate("/admin-dashboard/search-soldier");
      }
    } catch (err) {
      alert("❌ فشل في حفظ البيانات");
    }
  };

  return (
    <div
      className="min-h-screen bg-[#eaeeed] p-6 text-right font-sans"
      dir="rtl"
    >
      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto space-y-8">
        <div className="bg-[#1a2e2a] p-6 rounded-2xl shadow-lg border-b-4 border-yellow-600 flex justify-between items-center">
          <label className="text-yellow-500 font-black block underline italic">
            3. السجل الوظيفي والانضباطي للمحارب رقم: {formData.militaryId}
          </label>
          <input
            className="p-3 rounded-xl font-black text-xl outline-none bg-gray-100 border-2 border-yellow-600/50 w-64 text-center"
            value={formData.militaryId}
            readOnly
          />
        </div>

        <SectionLayout
          title="الترقي والعزل"
          icon={<Award className="text-yellow-600" size={30} />}
          color="border-yellow-600"
          onAdd={() =>
            addField("promotions", { rank: "", date: "", orderNumber: "" })
          }
        >
          {formData.promotions.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-yellow-50 p-4 rounded-xl relative mb-2"
            >
              <input
                placeholder="الرتبة"
                value={item.rank}
                onChange={(e) =>
                  handleNestedChange(
                    index,
                    "promotions",
                    "rank",
                    e.target.value
                  )
                }
                className="p-2 border rounded-lg font-bold"
              />
              <input
                type="date"
                value={item.date}
                onChange={(e) =>
                  handleNestedChange(
                    index,
                    "promotions",
                    "date",
                    e.target.value
                  )
                }
                className="p-2 border rounded-lg"
              />
              <input
                placeholder="رقم الأمر"
                value={item.orderNumber}
                onChange={(e) =>
                  handleNestedChange(
                    index,
                    "promotions",
                    "orderNumber",
                    e.target.value
                  )
                }
                className="p-2 border rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeField(index, "promotions")}
                className="text-red-600 hover:bg-red-100 p-2 rounded-lg bg-white shadow-sm border border-red-100"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </SectionLayout>

        <SectionLayout
          title="الوحدات وجهات الخدمة"
          icon={<Landmark className="text-blue-700" size={30} />}
          color="border-blue-700"
          onAdd={() =>
            addField("units", {
              unitName: "",
              fromDate: "",
              toDate: "",
              role: "",
              joinOrder: "",
              endOrder: "",
            })
          }
        >
          {formData.units.map((item, index) => (
            <div
              key={index}
              className="space-y-3 bg-blue-50 p-5 rounded-xl border border-blue-100 shadow-sm mb-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  placeholder="اسم الوحدة"
                  value={item.unitName}
                  onChange={(e) =>
                    handleNestedChange(
                      index,
                      "units",
                      "unitName",
                      e.target.value
                    )
                  }
                  className="p-2 border rounded-lg font-bold border-blue-200 outline-none"
                />
                <input
                  placeholder="الوظيفة داخل الوحدة"
                  value={item.role}
                  onChange={(e) =>
                    handleNestedChange(index, "units", "role", e.target.value)
                  }
                  className="p-2 border rounded-lg border-blue-200 outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeField(index, "units")}
                  className="hidden md:flex text-red-600 bg-white border border-red-100 rounded-lg p-2 items-center justify-center hover:bg-red-50"
                >
                  <Trash2 size={18} /> حذف
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-blue-800 mb-1">
                    تاريخ الضم
                  </label>
                  <input
                    type="date"
                    value={item.fromDate}
                    onChange={(e) =>
                      handleNestedChange(
                        index,
                        "units",
                        "fromDate",
                        e.target.value
                      )
                    }
                    className="p-2 border rounded-lg border-blue-200"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-blue-800 mb-1">
                    تاريخ الإنهاء
                  </label>
                  <input
                    type="date"
                    value={item.toDate}
                    onChange={(e) =>
                      handleNestedChange(
                        index,
                        "units",
                        "toDate",
                        e.target.value
                      )
                    }
                    className="p-2 border rounded-lg border-blue-200"
                  />
                </div>
                <input
                  placeholder="أمر الضم رقم"
                  value={item.joinOrder}
                  onChange={(e) =>
                    handleNestedChange(
                      index,
                      "units",
                      "joinOrder",
                      e.target.value
                    )
                  }
                  className="mt-5 p-2 border rounded-lg"
                />
                <input
                  placeholder="أمر الإنهاء رقم"
                  value={item.endOrder}
                  onChange={(e) =>
                    handleNestedChange(
                      index,
                      "units",
                      "endOrder",
                      e.target.value
                    )
                  }
                  className="mt-5 p-2 border rounded-lg"
                />
              </div>
            </div>
          ))}
        </SectionLayout>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SectionLayout
            title="الفرق التعليمية"
            icon={<GraduationCap size={30} />}
            color="border-purple-700"
            onAdd={() =>
              addField("courses", {
                courseName: "",
                place: "",
                grade: "",
                date: "",
              })
            }
          >
            {formData.courses.map((item, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 bg-purple-50 p-3 rounded-xl shadow-sm mb-2"
              >
                <input
                  placeholder="اسم الفرقة"
                  value={item.courseName}
                  onChange={(e) =>
                    handleNestedChange(
                      index,
                      "courses",
                      "courseName",
                      e.target.value
                    )
                  }
                  className="p-2 border rounded-lg"
                />
                <div className="flex gap-2">
                  <input
                    placeholder="التقدير"
                    value={item.grade}
                    onChange={(e) =>
                      handleNestedChange(
                        index,
                        "courses",
                        "grade",
                        e.target.value
                      )
                    }
                    className="w-1/2 p-2 border rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeField(index, "courses")}
                    className="w-1/2 text-red-600 border rounded-lg bg-white shadow-sm border-red-100"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </SectionLayout>

          <SectionLayout
            title="تقارير الكفاءة السنوية"
            icon={<FileText size={30} />}
            color="border-green-600"
            onAdd={() =>
              addField("efficiencyReports", { year: "", rating: "", notes: "" })
            }
          >
            {formData.efficiencyReports.map((item, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 bg-green-50 p-3 rounded-xl border border-green-100 shadow-sm mb-2"
              >
                <div className="flex gap-2">
                  <input
                    placeholder="السنة"
                    value={item.year}
                    onChange={(e) =>
                      handleNestedChange(
                        index,
                        "efficiencyReports",
                        "year",
                        e.target.value
                      )
                    }
                    className="w-1/3 p-2 border rounded-lg"
                  />
                  <input
                    placeholder="الدرجة"
                    value={item.rating}
                    onChange={(e) =>
                      handleNestedChange(
                        index,
                        "efficiencyReports",
                        "rating",
                        e.target.value
                      )
                    }
                    className="w-2/3 p-2 border rounded-lg"
                  />
                </div>
                <input
                  placeholder="ملاحظات"
                  value={item.notes}
                  onChange={(e) =>
                    handleNestedChange(
                      index,
                      "efficiencyReports",
                      "notes",
                      e.target.value
                    )
                  }
                  className="p-2 border rounded-lg"
                />
              </div>
            ))}
          </SectionLayout>
        </div>

        <button
          type="submit"
          className="w-full bg-[#1a2e2a] text-yellow-500 py-6 rounded-3xl font-black text-2xl shadow-2xl flex items-center justify-center gap-4 hover:bg-black transition-all border-b-8 border-yellow-700 active:scale-95 transition-transform"
        >
          <Save size={32} /> إغــلاق مـلف الـمحارب والـعودة للـبحث ✅
        </button>
      </form>
    </div>
  );
};

const SectionLayout = ({ title, icon, color, onAdd, children }) => (
  <div
    className={`bg-white p-6 rounded-3xl shadow-xl border-r-[12px] ${color}`}
  >
    <div className="flex justify-between items-center mb-6 border-b pb-4">
      <h3 className="text-xl font-black flex items-center gap-2">
        {icon} {title}
      </h3>
      <button
        type="button"
        onClick={onAdd}
        className="bg-gray-100 hover:bg-gray-200 p-2 rounded-xl transition-all shadow-sm"
      >
        <Plus size={24} />
      </button>
    </div>
    <div className="space-y-4">{children}</div>
  </div>
);

export default CareerData;
