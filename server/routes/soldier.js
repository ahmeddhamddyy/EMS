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
  deleteSoldier, 
  cancelPenalty 
} from "../controllers/soldierController.js";
const router = express.Router();

router.get("/stats", getSoldierStats);
router.get("/search", searchSoldiers);
router.get("/full-report/:id", getFullReport);
router.get("/penalties-list", getPenalizedSoldiers);
router.get("/category/:category", getSoldiersByCategory);

router.post("/add", addSoldier); 
router.post("/update-personal", updatePersonalData); 
router.post("/update-career", updateCareerData); 
router.put("/cancel-penalty", cancelPenalty); // المسار الصحيح ✅
router.delete("/delete/:id", deleteSoldier);


export default router;