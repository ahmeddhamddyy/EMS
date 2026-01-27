import express from 'express';
import cors from 'cors';
import connectToDatabase from './db/db.js';
import authRouter from './routes/auth.js';
import soldierRouter from './routes/soldier.js';

const app = express();
connectToDatabase(); // الاتصال بقاعدة بيانات MongoDB المحلية

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// تعريف المسارات
app.use('/api/auth', authRouter);
app.use('/api/soldier', soldierRouter);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT} ✅`));