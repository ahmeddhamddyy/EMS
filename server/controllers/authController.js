import User from "../models/User.js"; // تأكد من المسار الصحيح لموديل المستخدم
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// 1. دالة تسجيل الدخول
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: "المستخدم غير موجود" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, error: "كلمة المرور غير صحيحة" });
    }

    const token = jwt.sign(
      { _id: user._id, role: user.role, name: user.name },
      process.env.JWT_KEY,
      { expiresIn: "10d" }
    );

    res.status(200).json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 2. الدالة المسببة للخطأ - تأكد من وجود كلمة export هنا ✅
export const verifyUser = async (req, res) => {
  try {
    // إذا وصل الكود هنا فهذا يعني أن الميدل وير نجح في جلب المستخدم
    return res.status(200).json({
      success: true,
      user: {
        _id: req.user._id,
        name: req.user.name,
        role: req.user.role,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "خطأ داخلي في السيرفر" });
  }
};