import Soldier from "../models/Soldier.js";

// 1. إضافة فرد جديد
export const addSoldier = async (req, res) => {
    try {
        const { militaryId } = req.body;
        const existing = await Soldier.findOne({ militaryId });
        if (existing) return res.status(400).json({ success: false, error: "مسجل مسبقاً" });

        const newSoldier = new Soldier({ ...req.body, status: "بالخدمة" });
        await newSoldier.save();
        res.status(200).json({ success: true, message: "تم التسجيل بنجاح" });
    } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};

// 2. تحديث البيانات الشخصية ✅ (حل الخطأ الأخير)
export const updatePersonalData = async (req, res) => {
    try {
        const { militaryId, ...personalData } = req.body;
        const updated = await Soldier.findOneAndUpdate(
            { militaryId },
            { $set: personalData },
            { new: true }
        );
        if (!updated) return res.status(404).json({ success: false, error: "السجل غير موجود" });
        res.status(200).json({ success: true, soldier: updated });
    } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};

// 3. تحديث السجل الوظيفي
export const updateCareerData = async (req, res) => {
    try {
        const { militaryId, penalties, courses, efficiencyReports } = req.body;
        await Soldier.findOneAndUpdate(
            { militaryId },
            { $set: { 
                "careerHistory.penalties": penalties,
                "careerHistory.courses": courses,
                "careerHistory.efficiencyReports": efficiencyReports
            }},
            { new: true }
        );
        res.status(200).json({ success: true });
    } catch (error) { res.status(500).json({ success: false }); }
};

// 4. إلغاء الجزاء نهائياً
export const cancelPenalty = async (req, res) => {
    const { soldierId, penaltyIndex } = req.body;
    try {
        await Soldier.findByIdAndUpdate(soldierId, {
            $set: { [`careerHistory.penalties.${penaltyIndex}.isCancelled`]: true }
        });
        res.status(200).json({ success: true });
    } catch (err) { res.status(500).json({ success: false }); }
};

// 5. جلب الإحصائيات (التمام) ✅
export const getSoldierStats = async (req, res) => {
    try {
        const active = { status: { $regex: "بالخدمة", $options: "i" } };
        const [total, officers, sergeants, soldiers, reserve] = await Promise.all([
            Soldier.countDocuments(active),
            Soldier.countDocuments({ ...active, rankCategory: { $regex: "^ضابط$", $options: "i" } }),
            Soldier.countDocuments({ ...active, rankCategory: { $regex: "^صف$", $options: "i" } }),
            Soldier.countDocuments({ ...active, rankCategory: { $regex: "^جندي$", $options: "i" } }),
            Soldier.countDocuments({ status: { $regex: "رديف", $options: "i" } })
        ]);
        const greenhouses = await Soldier.countDocuments({ ...active, assignmentCategory: "الصوب" });
        const cabins = await Soldier.countDocuments({ ...active, assignmentCategory: "الكبائن" });
        const onMission = await Soldier.countDocuments({ ...active, missionTo: { $ne: "" } });
        const attachedFrom = await Soldier.countDocuments({ ...active, attachedFrom: { $ne: "" } });

        res.status(200).json({ success: true, total, officers, sergeants, soldiers, totalReserve: reserve, greenhouses, cabins, onMission, attachedFrom });
    } catch (error) { res.status(500).json({ success: false }); }
};

// 6. البحث الذكي ✅ (حل خطأ searchSoldiers)
export const searchSoldiers = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) return res.status(200).json({ success: true, soldiers: [] });
        const results = await Soldier.find({
            $or: [
                { name: { $regex: query, $options: "i" } },
                { militaryId: { $regex: query, $options: "i" } }
            ]
        }).limit(10);
        res.status(200).json({ success: true, soldiers: results });
    } catch (error) { res.status(500).json({ success: false }); }
};

// 7. التقرير الكامل
export const getFullReport = async (req, res) => {
    try {
        const soldier = await Soldier.findOne({ militaryId: req.params.id });
        if (!soldier) return res.status(404).json({ success: false });
        res.status(200).json({ success: true, soldier });
    } catch (error) { res.status(500).json({ success: false }); }
};

// 8. قائمة المجازين الساريين
export const getPenalizedSoldiers = async (req, res) => {
    try {
        const list = await Soldier.find({
            "careerHistory.penalties": { $elemMatch: { isCancelled: { $ne: true } } },
            status: "بالخدمة"
        });
        res.status(200).json({ success: true, list });
    } catch (error) { res.status(500).json({ success: false }); }
};

// 9. حذف سجل نهائياً ✅ (حل خطأ deleteSoldier)
export const deleteSoldier = async (req, res) => {
    try {
        await Soldier.findOneAndDelete({ militaryId: req.params.id });
        res.status(200).json({ success: true });
    } catch (error) { res.status(500).json({ success: false }); }
};

// 10. الجلب حسب الفئة (الأرشيف / الخدمة)
export const getSoldiersByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        let query = { status: "بالخدمة" };
        if (category === "رديف" || category === "reserve-archive") query = { status: "رديف" };
        else if (["الصوب", "الكبائن"].includes(category)) query.assignmentCategory = category;
        else if (category === "onMission") query.missionTo = { $ne: "" };
        else if (category === "attachedFrom") query.attachedFrom = { $ne: "" };
        else query.rankCategory = category;

        const list = await Soldier.find(query).select("name militaryId rank image specialization status");
        res.status(200).json({ success: true, list });
    } catch (error) { res.status(500).json({ success: false }); }
};