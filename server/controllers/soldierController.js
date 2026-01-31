import Soldier from "../models/Soldier.js";

// 1. إضافة أو تحديث البيانات العسكرية الأساسية
export const addMilitaryData = async (req, res) => {
    try {
        const { militaryId } = req.body;

        // البحث إذا كان الجندي موجود مسبقاً
        let soldier = await Soldier.findOne({ militaryId });

        if (soldier) {
            // تحديث البيانات إذا كان موجوداً
            soldier = await Soldier.findOneAndUpdate({ militaryId }, req.body, { new: true });
            return res.status(200).json({ success: true, message: "تم تحديث البيانات العسكرية", soldier });
        }

        // إنشاء سجل جديد إذا لم يكن موجوداً
        const newSoldier = new Soldier(req.body);
        await newSoldier.save();
        res.status(201).json({ success: true, message: "تم حفظ بيانات المحارب بنجاح", soldier: newSoldier });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "خطأ في حفظ البيانات العسكرية" });
    }
};

// 2. إضافة أو تحديث البيانات الشخصية (ربط بالرقم العسكري)
export const updatePersonalData = async (req, res) => {
    try {
        const { militaryId } = req.body;

        // البحث عن الجندي بالرقم العسكري لتحديث بياناته الشخصية
        const soldier = await Soldier.findOneAndUpdate(
            { militaryId },
            { $set: req.body }, // تحديث الحقول المرسلة فقط (الشخصية، العائلية، إلخ)
            { new: true, runValidators: true }
        );

        if (!soldier) {
            return res.status(404).json({ 
                success: false, 
                message: "لم يتم العثور على سجل عسكري بهذا الرقم. برجاء إدخال البيانات العسكرية أولاً." 
            });
        }

        res.status(200).json({ success: true, message: "تم تحديث السجل الشخصي والاجتماعي بنجاح", soldier });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "خطأ في تحديث البيانات الشخصية" });
    }
};