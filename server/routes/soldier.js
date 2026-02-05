import express from "express";
import {
  addSoldier,           // تأكد من وجودها هنا ✅
  getSoldierStats,
  searchSoldiers,
  getFullReport,
  getPenalizedSoldiers,
  getSoldiersByCategory,
  updateCareerData
} from "../controllers/soldierController.js";

const router = express.Router();

router.get("/stats", getSoldierStats);
router.get("/search", searchSoldiers);
router.post("/add", addSoldier); // تأكد من الربط هنا ✅
router.get("/full-report/:id", getFullReport);
router.get("/penalties-list", getPenalizedSoldiers);
router.get("/category/:category", getSoldiersByCategory);
router.post("/update-career", updateCareerData); // الرابط المستخدم في CareerData.jsx ✅

export default router;