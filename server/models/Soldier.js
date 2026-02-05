// server/models/Soldier.js
import mongoose from "mongoose";

const soldierSchema = new mongoose.Schema({
    name: { type: String, required: true },
    militaryId: { 
        type: String, 
        required: true, 
        unique: true, 
        minlength: 13, // تعديل لـ 13 ✅
        maxlength: 13 
    },
    rankCategory: { type: String, required: true },
    rank: { type: String, required: true },
    image: { type: String }, // إضافة حقل الصورة لاستقبال الـ Base64 ✅
    
    // باقي الحقول التي أضفناها في الفرونت إند
    serviceType: String,
    serviceDuration: String,
    specialization: String,
    unitRole: String,
    warTraining: String,
    joinDate: String,
    dischargeDate: String,
    tripleNumber: String,
    recruitmentArea: String,
    companyPlatoon: String,
    unitJoinDate: String,
    missionFrom: String,
    missionTo: String,
    attachedFrom: String,
    attachedTo: String,
    
    // بيانات السجل الوظيفي والجزاءات (التي سنقوم ببرمجتها الآن)
    careerHistory: {
        penalties: Array,
        courses: Array,
        efficiencyReports: Array
    }
}, { timestamps: true });

export default mongoose.model("Soldier", soldierSchema);