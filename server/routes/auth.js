import express from "express";
import User from "../models/User.js"; // تأكد من وجود .js في النهاية
import { login, verifyUser } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// مسار تسجيل الدخول
router.post("/login", login);

// المسار المفقود الذي يسبب خطأ 404 ✅
router.post("/verify", authMiddleware, verifyUser);

export default router;
