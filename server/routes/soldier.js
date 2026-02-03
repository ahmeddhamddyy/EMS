import express from "express";
import {
  addSoldier,
  updateCareerData,
  updatePersonalData,
  getSoldierStats,
  searchSoldiers,
  getFullReport,
} from "../controllers/soldierController.js";

// حذفنا استيراد authMiddleware لأنه لم يعد مطلوباً في النسخة الأوفلاين ✅

const router = express.Router();

// المسارات الآن مفتوحة مباشرة للفرونت إند بدون قيود
router.get("/stats", getSoldierStats);
router.get("/search", searchSoldiers);
router.post("/add", addSoldier);
router.post("/update-career", updateCareerData);
router.post("/add-personal", updatePersonalData);
router.get("/full-report/:id", getFullReport);

export default router;
