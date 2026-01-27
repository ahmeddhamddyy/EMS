import mongoose from 'mongoose';

const soldierSchema = new mongoose.Schema({
    militaryId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    rank: { type: String, required: true }, // ضابط، ضابط صف، جندي
    company: String, // السرية
    specialization: String, // التخصص
    tripleNumber: String,
    joinDate: Date,
    dischargeDate: Date,
    missionFrom: String,
    missionTo: String,
    // أي بيانات إضافية أخرى...
}, { timestamps: true });

export default mongoose.model('Soldier', soldierSchema);