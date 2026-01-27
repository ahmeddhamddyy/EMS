import express from 'express';
import Soldier from '../models/Soldier.js';
const router = express.Router();

// إضافة جندي جديد
router.post('/add', async (req, res) => {
    try {
        const newSoldier = new Soldier(req.body);
        await newSoldier.save();
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: "الرقم العسكري مسجل مسبقاً" });
    }
});

// إحصائيات الداشبورد
router.get('/stats', async (req, res) => {
    try {
        const officers = await Soldier.countDocuments({ rank: 'ضابط' });
        const sergeants = await Soldier.countDocuments({ rank: 'ضابط صف' });
        const soldiers = await Soldier.countDocuments({ rank: 'جندي' });
        res.status(200).json({ officers, sergeants, soldiers });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;