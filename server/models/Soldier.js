import mongoose from "mongoose";

const soldierSchema = new mongoose.Schema(
  {
    // --- 1. البيانات العسكرية الأساسية ---
    name: { type: String, required: true },
    militaryId: { type: String, required: true, unique: true, length: 12 },
    rankCategory: {
      type: String,
      required: true,
      enum: ["جندي", "صف", "ضابط"],
      default: "جندي",
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

    // --- 2. البيانات الشخصية والاجتماعية ---
    fullName: String,
    gender: { type: String, enum: ["ذكر", "أنثى"], default: "ذكر" },
    religion: { type: String, enum: ["مسلم", "مسيحي"], default: "مسلم" },
    qualification: String,
    jobBefore: String,
    birthDate: Date,
    birthPlace: String,
    province: String,
    nationalId: { type: String, length: 14 },
    civilRegistry: String,
    height: Number,
    weight: Number,
    chestSize: Number,
    bloodType: String,

    spouse: {
      name: String,
      nationalId: String,
      birthDate: Date,
      marriageDate: Date,
    },

    children: [
      {
        name: String,
        nationalId: String,
        birthDate: Date,
        gender: { type: String, enum: ["ذكر", "أنثى"], default: "ذكر" },
      },
    ],

    relatives: [
      {
        name: String,
        relation: String,
        nationalId: String,
        phone: String,
      },
    ],

    // --- 3. السجل الوظيفي والانضباطي (الميزات الجديدة) ---
    careerHistory: {
      promotions: [
        { rank: String, date: Date, orderNumber: String, note: String },
      ],
      units: [{ unitName: String, fromDate: Date, toDate: Date, role: String }],
      courses: [
        { courseName: String, place: String, grade: String, date: Date },
      ],
      penalties: [
        { penaltyType: String, reason: String, authority: String, date: Date },
      ],
      efficiencyReports: [{ year: String, rating: String, notes: String }],
    },
  },
  { timestamps: true }
);

const Soldier = mongoose.model("Soldier", soldierSchema);
export default Soldier;
