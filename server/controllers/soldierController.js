import Soldier from '../models/Soldier.js';

// 1. إضافة (Create)
export const addSoldier = async (req, res) => {
    try {
        const newSoldier = new Soldier(req.body);
        await newSoldier.save();
        res.status(200).json({ success: true, message: "تم الحفظ" });
    } catch (err) {
        res.status(500).json({ success: false, error: "الرقم العسكري مسجل مسبقاً" });
    }
};

// 2. بحث وقراءة (Read/Search)
export const getSoldier = async (req, res) => {
    try {
        const soldier = await Soldier.findOne({ militaryId: req.params.id });
        if (!soldier) return res.status(404).json({ success: false, message: "غير موجود" });
        res.status(200).json({ success: true, soldier });
    } catch (err) {
        res.status(500).json({ success: false });
    }
};

// 3. تعديل (Update)
export const updateSoldier = async (req, res) => {
    try {
        const updated = await Soldier.findOneAndUpdate(
            { militaryId: req.params.id }, 
            { $set: req.body }, 
            { new: true }
        );
        res.status(200).json({ success: true, updated });
    } catch (err) {
        res.status(500).json({ success: false });
    }
};

// 4. حذف (Delete)
export const deleteSoldier = async (req, res) => {
    try {
        await Soldier.findOneAndDelete({ militaryId: req.params.id });
        res.status(200).json({ success: true, message: "تم الحذف" });
    } catch (err) {
        res.status(500).json({ success: false });
    }
};