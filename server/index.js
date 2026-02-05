// server/index.js
import express from "express";
import cors from "cors";
import connectToDatabase from "./db/db.js";
import authRouter from "./routes/auth.js";
import soldierRouter from "./routes/soldier.js";

const app = express();

connectToDatabase();

app.use(cors());

// يجب وضع الـ limit هنا قبل الـ Routes لكي يعمل على كل المسارات ✅
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// تعريف المسارات بعد ضبط الـ limit
app.use("/api/auth", authRouter);
app.use("/api/soldier", soldierRouter);

app.get("/", (req, res) => {
  res.send("Server is Healthy and Running Offline 🚀");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} ✅`);
});