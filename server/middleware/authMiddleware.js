import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, error: "لا يوجد توكن" });
    }

    // فك تشفير التوكن
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    if (!decoded) {
      return res.status(401).json({ success: false, error: "توكن غير صالح" });
    }

    // البحث عن المستخدم في قاعدة البيانات
    const user = await User.findById(decoded._id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: "المستخدم غير موجود" });
    }

    req.user = user; // إلحاق بيانات المستخدم بالطلب
    next();
  } catch (error) {
    console.error("Middleware Error:", error.message);
    // نرسل 401 بدلاً من 500 لكي يفهم الفرونت إند أن الجلسة انتهت
    return res
      .status(401)
      .json({ success: false, error: "انتهت صلاحية الجلسة" });
  }
};

export default authMiddleware;
