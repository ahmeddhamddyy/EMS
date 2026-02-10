import mongoose from "mongoose";

const soldierSchema = new mongoose.Schema({
    // البيانات الأساسية
    name: { type: String, required: true },
    militaryId: { type: String, required: true, unique: true },
    rankCategory: { type: String, required: true }, 
    rank: { type: String, required: true },
    status: { type: String, default: "بالخدمة" }, 
    assignmentCategory: { 
        type: String, 
        required: true, 
        enum: ['الكتيبة', 'الصوب', 'الكبائن'],
        default: 'الكتيبة' 
    },

    // بيانات الخدمة والبيانات المدنية
    serviceType: String, specialization: String, unitRole: String,
    joinDate: String, dischargeDate: String, recruitmentArea: String,
    companyPlatoon: String, unitJoinDate: String,
    missionTo: { type: String, default: "" }, attachedFrom: { type: String, default: "" },
    image: String, nationalId: String, qualification: String, bloodType: String,
    phone: String, address: String,

    // السجل الوظيفي الموحد ✅
    careerHistory: {
        penalties: [{
            date: String, fromDate: String, toDate: String,
            penaltyType: String, details: String, orderNumber: String,
            isCancelled: { type: Boolean, default: false }, // لزوم صفحة الجزاءات
            issuingOfficer: { rank: String, name: String, job: String }
        }],
        courses: [{
            courseName: String, place: String, fromDate: String, toDate: String, orderNumber: String
        }],
        efficiencyReports: [{
            year: String, percentage: String, rating: String,
            directOfficer: { rank: String, name: String },
            approvingOfficer: { rank: String, name: String }
        }]
    }
}, { timestamps: true });

const Soldier = mongoose.model("Soldier", soldierSchema);
export default Soldier;