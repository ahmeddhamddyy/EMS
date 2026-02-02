import express from "express";
import cors from "cors";
import connectToDatabase from "./db/db.js";
// ملاحظة: قمنا بإبقاء الاستيرادات ولكن سنركز على soldierRouter
import authRouter from "./routes/auth.js";
import soldierRouter from "./routes/soldier.js";

const app = express();

// الاتصال بقاعدة بيانات MongoDB المحلية
connectToDatabase();

// إعداد CORS للسماح لـ Vite بالوصول للسيرفر بدون قيود (مناسب للأوفلاين)
app.use(cors());

app.use(express.json());

// تعريف المسارات
// في النسخة الأوفلاين، سنتعامل مباشرة مع سجلات الجنود
app.use("/api/auth", authRouter);
app.use("/api/soldier", soldierRouter);

// مسار تجريبي للتأكد من أن السيرفر يعمل واستجابته سريعة
app.get("/", (req, res) => {
  res.send("Server is Healthy and Running Offline 🚀");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} ✅`);
  console.log(`Ready for Offline Management - Battalion 5`);
});
