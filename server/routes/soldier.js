import express from "express";
import {
  addSoldier,
  getSoldierStats,
  searchSoldiers,
  getFullReport,
  getPenalizedSoldiers,
  getSoldiersByCategory,
  updateCareerData,
  updatePersonalData,
  deleteSoldier
} from "../controllers/soldierController.js";

const router = express.Router();

// --- مسارات الاستعلام (GET) ---
router.get("/stats", getSoldierStats);
router.get("/search", searchSoldiers);
router.get("/full-report/:id", getFullReport);
router.get("/penalties-list", getPenalizedSoldiers);
router.get("/category/:category", getSoldiersByCategory);

// --- مسارات الإضافة والتحديث (POST) ---
router.post("/add", addSoldier); 
router.post("/update-personal", updatePersonalData); 
router.post("/update-career", updateCareerData); 
router.delete("/delete/:id", deleteSoldier); // هنا مكانها الصحيح ✅

export default router;