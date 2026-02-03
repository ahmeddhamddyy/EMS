import Soldier from "../models/Soldier.js";

// 1. جلب التمام اليومي المطور (ضباط، صف، جنود، ملحقين، مأموريات) ✅
export const getSoldierStats = async (req, res) => {
  try {
    const officers = await Soldier.countDocuments({ rankCategory: "ضابط" });
    const sergeants = await Soldier.countDocuments({ rankCategory: "صف" });
    const soldiers = await Soldier.countDocuments({ rankCategory: "جندي" });

    // إحصائيات الحالة (التمام)
    const onMission = await Soldier.countDocuments({ status: "مأمورية" });
    const attachedFrom = await Soldier.countDocuments({ status: "إلحاق من" });
    const attachedTo = await Soldier.countDocuments({ status: "إلحاق على" });

    const total = await Soldier.countDocuments();

    res.status(200).json({
      success: true,
      officers,
      sergeants,
      soldiers,
      onMission,
      attachedFrom,
      attachedTo,
      total,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "فشل استخراج الإحصائيات" });
  }
};

// 2. الدالة الجديدة: جلب التقرير الشامل للطباعة (هذه هي الحل!) ✅
// تأكد من وجود كلمة export هنا ✅
export const getFullReport = async (req, res) => {
  try {
    const { id } = req.params;
    const soldier = await Soldier.findOne({ militaryId: id });

    if (!soldier) {
      return res
        .status(404)
        .json({ success: false, message: "السجل غير موجود" });
    }

    res.status(200).json({ success: true, soldier });
  } catch (error) {
    res.status(500).json({ success: false, error: "خطأ في السيرفر" });
  }
};

// 3. محرك البحث الذكي
export const searchSoldiers = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(200).json({ success: true, soldiers: [] });

    const soldiers = await Soldier.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { militaryId: { $regex: query, $options: "i" } },
      ],
    }).limit(10);

    res.status(200).json({ success: true, soldiers });
  } catch (error) {
    res.status(500).json({ success: false, error: "خطأ في عملية البحث" });
  }
};

// 4. إضافة جندي جديد
export const addSoldier = async (req, res) => {
  try {
    const existing = await Soldier.findOne({ militaryId: req.body.militaryId });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, error: "هذا الرقم العسكري مسجل بالفعل" });
    }
    const newSoldier = new Soldier(req.body);
    await newSoldier.save();
    res.status(200).json({ success: true, message: "تم تسجيل البيانات بنجاح" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 5. تحديث السجل الوظيفي
export const updateCareerData = async (req, res) => {
  try {
    const { militaryId, ...careerData } = req.body;
    const updated = await Soldier.findOneAndUpdate(
      { militaryId },
      {
        $set: {
          careerHistory: careerData,
          status: careerData.status || "موجود",
        },
      },
      { new: true },
    );
    if (!updated)
      return res
        .status(404)
        .json({ success: false, error: "المحارب غير موجود" });
    res
      .status(200)
      .json({ success: true, message: "تم تحديث السجل الوظيفي بنجاح" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 6. تحديث البيانات الشخصية
export const updatePersonalData = async (req, res) => {
  try {
    const { militaryId, ...personalFields } = req.body;
    const updated = await Soldier.findOneAndUpdate(
      { militaryId },
      { $set: personalFields },
      { new: true },
    );
    if (!updated)
      return res
        .status(404)
        .json({ success: false, error: "المحارب غير موجود" });
    res
      .status(200)
      .json({ success: true, message: "تم تحديث البيانات الشخصية بنجاح" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
