import mongoose from "mongoose";

const soldierSchema = new mongoose.Schema({
    // ==========================================
    // 1. البيانات العسكرية (التي تم ضبطها مؤخراً)
    // ==========================================
    name: { 
        type: String, 
        required: true 
    },
    militaryId: { 
        type: String, 
        required: true, 
        unique: true, 
        length: 12 
    },
    rankCategory: { 
        type: String, 
        required: true, 
        enum: ['جندي', 'صف', 'ضابط'],
        default: 'جندي'
    },
    serviceType: String,
    serviceDuration: String,
    specialization: String,
    unitRole: String,
    warTraining: String,
    joinDate: Date,
    dischargeDate: Date,
    tripleNumber: String,
    recruitmentArea: String,
    companyPlatoon: String,
    unitJoinDate: Date,
    missionFrom: String,
    missionTo: String,
    attachedFrom: String,
    attachedTo: String,

    // ==========================================
    // 2. البيانات الشخصية والاجتماعية
    // ==========================================
    fullName: String,
    gender: { type: String, enum: ['ذكر', 'أنثى'], default: 'ذكر' },
    religion: { type: String, enum: ['مسلم', 'مسيحي'], default: 'مسلم' },
    qualification: String, // المؤهل الدراسي
    jobBefore: String,    // المهنة قبل التجنيد
    birthDate: Date,
    birthPlace: String,
    province: String,
    nationalId: { type: String, length: 14 },
    civilRegistry: String, // مكتب السجل المدني
    
    // القياسات البدنية
    height: Number,
    weight: Number,
    chestSize: Number,
    bloodType: String,

    // الحالة الاجتماعية (الزوجة)
    spouse: {
        name: String,
        birthDate: Date,
        nationalId: String
    },
    
    // الأبناء (مصفوفة ديناميكية)
    children: [{
        name: String,
        nationalId: String
    }],

    // الأقارب للطوارئ (مصفوفة ديناميكية)
    relatives: [{
        name: String,
        relation: String,
        nationalId: String,
        phone: String
    }]

}, { 
    timestamps: true // لتعرف متى تم إنشاء أو تحديث ملف الجندي
});

const Soldier = mongoose.model("Soldier", soldierSchema);
export default Soldier;