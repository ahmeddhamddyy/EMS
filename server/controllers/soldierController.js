// server/controllers/soldierController.js
import Soldier from "../models/Soldier.js";

// 1. إضافة جندي جديد
export const addSoldier = async (req, res) => {
    try {
        const { militaryId } = req.body;
        if (militaryId.length !== 13) {
            return res.status(400).json({ success: false, error: "الرقم العسكري يجب أن يكون 13 رقماً" });
        }
        const existing = await Soldier.findOne({ militaryId });
        if (existing) {
            return res.status(400).json({ success: false, error: "هذا الرقم العسكري مسجل بالفعل" });
        }
        const newSoldier = new Soldier(req.body);
        await newSoldier.save();
        res.status(200).json({ success: true, message: "تم تسجيل البيانات بنجاح" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 2. تحديث البيانات الشخصية والعائلية
// server/controllers/soldierController.js

export const updatePersonalData = async (req, res) => {
    try {
        const { militaryId, ...personalData } = req.body;

        // التعديل هنا: استخدام findOneAndUpdate مع $set لتحديث البيانات الموجودة فقط
        const updatedSoldier = await Soldier.findOneAndUpdate(
            { militaryId }, // البحث بالرقم العسكري (الذي قفلناه في الفرونت إند)
            { $set: personalData }, 
            { 
                new: true,           // إرجاع المستند بعد التعديل
                runValidators: true, // التأكد من أن البيانات تطابق الموديل
                upsert: false        // لا تنشئ سجلاً جديداً إذا لم تجده (للأمان)
            }
        );

        if (!updatedSoldier) {
            return res.status(404).json({ 
                success: false, 
                error: "لم يتم العثور على السجل العسكري المطلوب تعديله" 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: "تم تحديث البيانات بنجاح",
            soldier: updatedSoldier 
        });
    } catch (error) {
        res.status(500).json({ success: false, error: "خطأ أثناء التحديث: " + error.message });
    }
};

// 3. تحديث السجل الوظيفي والجزاءات
export const updateCareerData = async (req, res) => {
    try {
        const { militaryId, penalties, courses, efficiencyReports } = req.body;

        const updatedSoldier = await Soldier.findOneAndUpdate(
            { militaryId },
            {
                $set: {
                    "careerHistory.penalties": penalties, // سيتم وضع المصفوفة المعدلة بالكامل
                    "careerHistory.courses": courses,
                    "careerHistory.efficiencyReports": efficiencyReports
                }
            },
            { new: true }
        );

        if (!updatedSoldier) return res.status(404).json({ success: false });
        res.status(200).json({ success: true, message: "تم تحديث السجل الوظيفي بنجاح" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 4. جلب الإحصائيات (التمام)
export const getSoldierStats = async (req, res) => {
    try {
        const stats = {
            total: await Soldier.countDocuments(),
            officers: await Soldier.countDocuments({ rankCategory: "ضابط" }),
            sergeants: await Soldier.countDocuments({ rankCategory: "صف" }),
            soldiers: await Soldier.countDocuments({ rankCategory: "جندي" }),
            onMission: await Soldier.countDocuments({ missionTo: { $ne: "", $exists: true } }),
            attachedFrom: await Soldier.countDocuments({ attachedFrom: { $ne: "", $exists: true } }),
        };
        res.status(200).json({ success: true, ...stats });
    } catch (error) {
        res.status(500).json({ success: false, error: "خطأ في الإحصائيات" });
    }
};

// 5. البحث الذكي
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
        res.status(500).json({ success: false, error: "خطأ في البحث" });
    }
};

// 6. جلب القائمة حسب الفئة (تم دمج منطق الملحقين والمأموريات هنا ✅)
export const getSoldiersByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        let query = {};

        if (category === "onMission") {
            query = { missionTo: { $ne: "", $exists: true } };
        } else if (category === "attachedFrom" || category === "ملحق") {
            query = { attachedFrom: { $ne: "", $exists: true } };
        } else {
            query = { rankCategory: category };
        }

        const list = await Soldier.find(query).select("name militaryId rank image specialization");
        res.status(200).json({ success: true, list });
    } catch (error) {
        res.status(500).json({ success: false, error: "خطأ في جلب القائمة" });
    }
};

// 7. جلب التقرير الشامل (بيان الحالة)
export const getFullReport = async (req, res) => {
    try {
        const { id } = req.params;
        const soldier = await Soldier.findOne({ militaryId: id });
        if (!soldier) return res.status(404).json({ success: false, message: "السجل غير موجود" });
        res.status(200).json({ success: true, soldier });
    } catch (error) {
        res.status(500).json({ success: false, error: "خطأ في السيرفر" });
    }
};

// 8. جلب المجازين فقط
export const getPenalizedSoldiers = async (req, res) => {
    try {
        const list = await Soldier.find({ "careerHistory.penalties.0": { $exists: true } });
        res.status(200).json({ success: true, list });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};
// الكنترولر
export const deleteSoldier = async (req, res) => {
    try {
        await Soldier.findOneAndDelete({ militaryId: req.params.id });
        res.status(200).json({ success: true, message: "تم حذف السجل نهائياً" });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};

// الراوت
