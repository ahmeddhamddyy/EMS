import express from 'express';
import Soldier from '../models/Soldier.js';
const router = express.Router();

// 1. إضافة جندي جديد أو تحديث بياناته العسكرية
router.post('/add', async (req, res) => {
    try {
        const { militaryId } = req.body;
        
        // البحث عن الجندي بالرقم العسكري (12 رقم)
        let soldier = await Soldier.findOne({ militaryId });

        if (soldier) {
            // إذا وجدناه، نقوم بتحديث البيانات العسكرية فقط
            soldier = await Soldier.findOneAndUpdate({ militaryId }, req.body, { new: true });
            return res.status(200).json({ success: true, message: "تم تحديث البيانات العسكرية بنجاح" });
        }

        // إذا لم يوجد، ننشئ سجلاً جديداً تماماً
        const newSoldier = new Soldier(req.body);
        await newSoldier.save();
        res.status(200).json({ success: true, message: "تم تسجيل المحارب بنجاح" });
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "خطأ في التسجيل: تأكد من صحة البيانات" });
    }
});

// 2. إضافة أو تحديث البيانات الشخصية والاجتماعية (ربط بالرقم العسكري)
router.post('/add-personal', async (req, res) => {
    try {
        const { militaryId } = req.body;

        // البحث عن السجل العسكري الموجود مسبقاً لإضافة البيانات الشخصية له
        const soldier = await Soldier.findOneAndUpdate(
            { militaryId },
            { $set: req.body }, // دمج البيانات الشخصية والاجتماعية
            { new: true, runValidators: true }
        );

        if (!soldier) {
            return res.status(404).json({ 
                success: false, 
                error: "لم يتم العثور على سجل عسكري. يجب إدخال البيانات العسكرية أولاً." 
            });
        }

        res.status(200).json({ success: true, message: "تم تحديث السجل الشخصي والاجتماعي بنجاح" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "فشل تحديث البيانات الشخصية" });
    }
});

// 3. إحصائيات الداشبورد (تمام الكتيبة المحدث)
router.get('/stats', async (req, res) => {
    try {
        // نستخدم rankCategory المضافة حديثاً في الموديل
        const officers = await Soldier.countDocuments({ rankCategory: 'ضابط' });
        const sergeants = await Soldier.countDocuments({ rankCategory: 'صف' });
        const soldiers = await Soldier.countDocuments({ rankCategory: 'جندي' });
        
        res.status(200).json({ 
            success: true,
            officers, 
            sergeants, 
            soldiers,
            total: officers + sergeants + soldiers 
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

export default router;