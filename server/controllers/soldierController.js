import Soldier from "../models/Soldier.js";

// --- 1. إضافة جندي جديد (الدالة التي تسبب الخطأ حالياً) ---
export const addSoldier = async (req, res) => {
    try {
        const { militaryId } = req.body;

        // التحقق من طول الرقم العسكري (13 رقم)
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

// --- 2. جلب الإحصائيات (التمام المطور) ---
// --- تحديث دالة الإحصائيات لتطابق بيانات الفرونت إند ---
export const getSoldierStats = async (req, res) => {
    try {
        const stats = {
            total: await Soldier.countDocuments(),
            officers: await Soldier.countDocuments({ rankCategory: "ضابط" }),
            sergeants: await Soldier.countDocuments({ rankCategory: "صف" }),
            soldiers: await Soldier.countDocuments({ rankCategory: "جندي" }),
            
            // البحث في الحقول النصية إذا كانت تحتوي على بيانات ✅
            missionFrom: await Soldier.countDocuments({ missionFrom: { $ne: "", $exists: true } }),
            missionTo: await Soldier.countDocuments({ missionTo: { $ne: "", $exists: true } }),
            attachedFrom: await Soldier.countDocuments({ attachedFrom: { $ne: "", $exists: true } }),
            attachedTo: await Soldier.countDocuments({ attachedTo: { $ne: "", $exists: true } }),
        };
        res.status(200).json({ success: true, ...stats });
    } catch (error) {
        res.status(500).json({ success: false, error: "خطأ في الإحصائيات" });
    }
};

// --- 3. البحث الذكي (للكروت) ---
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

// --- 4. جلب التقرير الشامل ---
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

// --- 5. جلب الأفراد المجازين فقط ---
export const getPenalizedSoldiers = async (req, res) => {
    try {
        const list = await Soldier.find({ "penalties.0": { $exists: true } });
        res.status(200).json({ success: true, list });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};

// --- 6. جلب قائمة فئة معينة ---
export const getSoldiersByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const list = await Soldier.find({ rankCategory: category });
        res.status(200).json({ success: true, list });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};

// server/controllers/soldierController.js

export const updateCareerData = async (req, res) => {
    try {
        const { militaryId, penalties, courses, efficiencyReports } = req.body;

        const updatedSoldier = await Soldier.findOneAndUpdate(
            { militaryId },
            {
                $set: {
                    "careerHistory.penalties": penalties,
                    "careerHistory.courses": courses,
                    "careerHistory.efficiencyReports": efficiencyReports
                }
            },
            { new: true } // لإرجاع البيانات بعد التحديث
        );

        if (!updatedSoldier) {
            return res.status(404).json({ success: false, error: "المحارب غير موجود" });
        }

        res.status(200).json({ 
            success: true, 
            message: "تم تحديث السجل الوظيفي بنجاح",
            data: updatedSoldier 
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};