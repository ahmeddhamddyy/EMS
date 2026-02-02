import Soldier from "../models/Soldier.js";

// 1. جلب الإحصائيات للوحة التحكم
export const getSoldierStats = async (req, res) => {
  try {
    const officers = await Soldier.countDocuments({ rankCategory: "ضابط" });
    const sergeants = await Soldier.countDocuments({ rankCategory: "صف" });
    const soldiers = await Soldier.countDocuments({ rankCategory: "جندي" });
    const total = await Soldier.countDocuments();

    res
      .status(200)
      .json({ success: true, officers, sergeants, soldiers, total });
  } catch (error) {
    res.status(500).json({ success: false, error: "فشل استخراج الإحصائيات" });
  }
};

// 2. محرك البحث الذكي (بالاسم أو الرقم العسكري)
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

// 3. إضافة جندي جديد (الخطوة الأولى)
export const addSoldier = async (req, res) => {
  try {
    // التحقق أولاً إذا كان الرقم العسكري موجوداً لتجنب الانهيار
    const existing = await Soldier.findOne({ militaryId: req.body.militaryId });
    if (existing) {
      return res
        .status(400)
        .json({
          success: false,
          error: "هذا الرقم العسكري مسجل بالفعل في المنظومة",
        });
    }

    const newSoldier = new Soldier(req.body);
    await newSoldier.save();

    res.status(200).json({ success: true, message: "تم تسجيل البيانات بنجاح" });
  } catch (error) {
    console.error("خطأ أثناء الحفظ:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

// 4. تحديث السجل الوظيفي (الخطوة الثالثة)
export const updateCareerData = async (req, res) => {
  try {
    const { militaryId, ...careerData } = req.body;

    // التعديل هنا: نحدث حقل careerHistory فقط
    const updated = await Soldier.findOneAndUpdate(
      { militaryId },
      { $set: { careerHistory: careerData } },
      { new: true, runValidators: true }
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

// 5. تحديث البيانات الشخصية (الخطوة الثانية)
export const updatePersonalData = async (req, res) => {
  try {
    const { militaryId, ...personalFields } = req.body;

    const updated = await Soldier.findOneAndUpdate(
      { militaryId },
      { $set: personalFields },
      { new: true, runValidators: true }
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
