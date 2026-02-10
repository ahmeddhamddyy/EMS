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
        const { militaryId } = req.params; 
        const updatedSoldier = await Soldier.findOneAndUpdate(
            { militaryId: militaryId },
            { $set: req.body }, 
            { new: true, runValidators: true }
        );

        if (!updatedSoldier) return res.status(404).json({ success: false, error: "المقاتل غير موجود" });

        res.status(200).json({ success: true, message: "تم تحديث سجل الأداء بنجاح", soldier: updatedSoldier });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
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
                    "careerHistory.penalties": penalties,
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

// 4. جلب الإحصائيات (تعديل لضمان دقة الأرقام مع البيانات القديمة ✅)
export const getSoldierStats = async (req, res) => {
    try {
        // نستخدم $ne: "رديف" لضمان حساب البيانات القديمة التي ليس لها حقل status ✅
        const activeQuery = { status: { $ne: "رديف" } };

        const stats = {
            total: await Soldier.countDocuments(activeQuery),
            officers: await Soldier.countDocuments({ ...activeQuery, rankCategory: "ضابط" }),
            sergeants: await Soldier.countDocuments({ ...activeQuery, rankCategory: "صف" }),
            soldiers: await Soldier.countDocuments({ ...activeQuery, rankCategory: "جندي" }),
            greenhouses: await Soldier.countDocuments({ ...activeQuery, assignmentCategory: "الصوب" }),
            cabins: await Soldier.countDocuments({ ...activeQuery, assignmentCategory: "الكبائن" }),
            onMission: await Soldier.countDocuments({ ...activeQuery, missionTo: { $ne: "", $exists: true } }),
            attachedFrom: await Soldier.countDocuments({ ...activeQuery, attachedFrom: { $ne: "", $exists: true } }),
            totalReserve: await Soldier.countDocuments({ status: "رديف" })
        };
        res.status(200).json({ success: true, ...stats });
    } catch (error) {
        res.status(500).json({ success: false, error: "خطأ في جلب الإحصائيات" });
    }
};

// وظيفة التسريح الجماعي
export const dischargeBatch = async (req, res) => {
    try {
        const { dischargeDate } = req.body;
        const result = await Soldier.updateMany(
            { status: { $ne: "رديف" }, dischargeDate: dischargeDate },
            { $set: { status: "رديف" } }
        );
        res.status(200).json({ 
            success: true, 
            message: `تم تسريح عدد ${result.modifiedCount} مقاتل بنجاح.` 
        });
    } catch (error) {
        res.status(500).json({ success: false, error: "خطأ أثناء عملية التسريح" });
    }
};

// 5. البحث الذكي (تعديل ليظهر الجميع ✅)
export const searchSoldiers = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) return res.status(200).json({ success: true, soldiers: [] });
        const soldiers = await Soldier.find({
            $or: [
                { name: { $regex: query, $options: "i" } },
                { militaryId: { $regex: query, $options: "i" } },
            ],
        }).limit(20); // زيادة الحد للبحث الشامل
        res.status(200).json({ success: true, soldiers });
    } catch (error) {
        res.status(500).json({ success: false, error: "خطأ في البحث" });
    }
};

// 6. جلب القائمة حسب الفئة (التعديل الجوهري لظهور البيانات القديمة ✅)
export const getSoldiersByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        // نغير الشرط ليكون "أي شخص ليس رديف" لضمان ظهور البيانات القديمة ✅
        let query = { status: { $ne: "رديف" } };

        if (category === "onMission") {
            query.missionTo = { $ne: "", $exists: true };
        } else if (category === "attachedFrom") {
            query.attachedFrom = { $ne: "", $exists: true };
        } else if (category === "الصوب") {
            query.assignmentCategory = "الصوب";
        } else if (category === "الكبائن") {
            query.assignmentCategory = "الكبائن";
        } else if (category === "رديف") {
            query = { status: "رديف" }; // للأرشيف نلتزم بكلمة رديف فقط
        } else {
            query.rankCategory = category;
        }

        const list = await Soldier.find(query).select("name militaryId rank image specialization dischargeDate status");
        res.status(200).json({ success: true, list });
    } catch (error) {
        res.status(500).json({ success: false, error: "خطأ في جلب القائمة" });
    }
};

// 7. جلب التقرير الشامل
export const getFullReport = async (req, res) => {
    try {
        const { id } = req.params;
        const soldier = await Soldier.findOne({ militaryId: id });
        if (!soldier) return res.status(404).json({ success: false, message: "السجل غير موجود" });
        res.status(200).json({ success: true, soldier });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
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

// 9. الحذف
// دالة الحذف النهائي من قاعدة البيانات
export const deleteSoldier = async (req, res) => {
    try {
        const { id } = req.params; // سنستخدم الرقم العسكري كمعرف
        const result = await Soldier.findOneAndDelete({ militaryId: id });
        
        if (!result) {
          return res.status(404).json({ success: false, message: "السجل غير موجود" });
        }

        res.status(200).json({ success: true, message: "تم حذف سجل المقاتل نهائياً من المنظومة" });
    } catch (error) {
        res.status(500).json({ success: false, error: "خطأ أثناء محاولة الحذف" });
    }
};