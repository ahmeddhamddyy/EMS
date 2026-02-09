import mongoose from "mongoose";

const soldierSchema = new mongoose.Schema({
    name: { type: String, required: true },
    militaryId: { type: String, required: true, unique: true },
    rankCategory: { type: String, required: true },
    rank: { type: String, required: true },
    
    // التعديل الجديد: تحديد قطاع التوزيع ✅
    assignmentCategory: { 
        type: String, 
        required: true, 
        enum: ['الكتيبة', 'الصوب', 'الكبائن'],
        default: 'الكتيبة' 
    },

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
    
    // البيانات المدنية والبدنية
    nationalId: String,
    qualification: String,
    bloodType: String,
    jobBefore: String,
    height: String,
    weight: String,
    chestSize: String,
    address: String,
    phone: String,
    
    // الموقف العائلي
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

    // السجل الوظيفي والجزاءات
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