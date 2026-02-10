import mongoose from "mongoose";

const soldierSchema = new mongoose.Schema({
    // 1. البيانات الأساسية
    name: { type: String, required: true },
    militaryId: { type: String, required: true, unique: true },
    rankCategory: { type: String, required: true },
    rank: { type: String, required: true },

    // 2. الحالة والقطاع ✅
    status: { 
        type: String, 
        enum: ['بالخدمة', 'رديف'], 
        default: 'بالخدمة' 
    }, 
    statusNote: { 
        type: String, 
        default: 'موجود بالخدمة' 
    },
    assignmentCategory: { 
        type: String, 
        required: true, 
        enum: ['الكتيبة', 'الصوب', 'الكبائن'],
        default: 'الكتيبة' 
    },

    // 3. كفاءة اللياقة البدنية (اللي أنت هتدخل أرقامها بنفسك) ✅
    physicalFitness: {
        pullUps: { type: Number, default: 0 },   // عقلة
        pushUps: { type: Number, default: 0 },   // ضغط
        sitUps: { type: Number, default: 0 },    // بطن
        sprint100m: { type: String, default: "" }, // جري 100م
        shuttleRun: { type: String, default: "" }, // جري ترددي
    },

    // 4. سجل الرماية ✅
    shooting: {
        score: { type: Number, default: 0 },      // درجة الرماية من 50
        weaponType: { type: String, default: "آلي" },
        lastShootingDate: { type: String, default: "" }
    },

    // 5. الموقف الطبي والرصيد ✅
    medicalStatus: {
        generalStatus: { type: String, default: "لائق" },
        bloodType: { type: String, default: "" },
        notes: { type: String, default: "لا يوجد" }
    },
    vacationBalance: {
        total: { type: Number, default: 45 },
        used: { type: Number, default: 0 }
    },

    // ابحث عن قسم shooting وحدثه بهذا الكود ✅
// داخل ملف Soldier.js ✅
shooting: {
    prone: { type: Number, default: 0, max: 2 },    // راقداً (من 2)
    kneeling: { type: Number, default: 0, max: 2 }, // مرتكزا (من 2)
    standing: { type: Number, default: 0, max: 2 },  // واقفاً (من 2)
    weaponType: { type: String, default: "آلي" },
    lastShootingDate: { type: String, default: "" }
},
    // 6. البيانات العسكرية التفصيلية
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
    image: String,
    
    // 7. البيانات المدنية والبدنية
    nationalId: String,
    qualification: String,
    bloodType: String, // مكررة في الطبي والمدني للضمان
    jobBefore: String,
    height: String,
    weight: String,
    chestSize: String,
    address: String,
    phone: String,
    
    // 8. الموقف العائلي
    spouse: {
        name: String,
        nationalId: String,
        birthDate: String,
        marriageDate: String
    },
    children: [{
        name: String,
        nationalId: String,
        birthDate: String,
        gender: String
    }],
    relatives: [{
        name: String,
        relation: String,
        nationalId: String,
        phone: String
    }],

    // 9. السجل الوظيفي والجزاءات والفرق
    careerHistory: {
        penalties: [{
            date: String,
            fromDate: String,
            toDate: String,
            penaltyType: String,
            details: String,
            orderNumber: String,
            issuingOfficer: {
                rank: String,
                name: String,
                job: String
            }
        }],
        courses: [{
            courseName: String,
            place: String,
            fromDate: String,
            toDate: String,
            orderNumber: String
        }],
        efficiencyReports: [{
            year: String,
            percentage: String,
            rating: String,
            directOfficer: {
                rank: String,
                name: String
            },
            approvingOfficer: {
                rank: String,
                name: String
            }
        }]
    }
}, { timestamps: true });

const Soldier = mongoose.model("Soldier", soldierSchema);
export default Soldier;