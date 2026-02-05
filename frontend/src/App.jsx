// App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// استيراد الصفحات (تأكد من صحة المسارات والأسماء عندك)
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AdminSummary from "./components/dashboard/AdminSummary";
import SearchPage from "./pages/SearchPage";
import MilitaryData from "./pages/MilitaryData";
import PersonalData from "./pages/PersonalData"; // تأكد من وجود الملف
import CareerData from "./pages/CareerData";     // تأكد من وجود الملف
import SoldierReport from "./pages/SoldierReport";
import PenaltiesPage from "./pages/PenaltiesPage";
import FullReport from "./pages/FullReport";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        
        {/* لوحة التحكم الرئيسية */}
        <Route path="/admin-dashboard" element={<AdminDashboard />}>
          <Route index element={<AdminSummary />} />
          <Route path="search-soldier" element={<SearchPage />} />
          
          {/* الروابط التي تسبب الخطأ حالياً - قمنا بإضافتها هنا ✅ */}
          <Route path="military-data" element={<MilitaryData />} />
          <Route path="personal-data" element={<PersonalData />} />
          <Route path="career-data" element={<CareerData />} />
          <Route path="penalties-list" element={<PenaltiesPage />} /> {/* إضافة مسار الجزاءات ✅ */}
          
          {/* رابط التقرير والطباعة */}
          <Route path="report/:id" element={<SoldierReport />} />
          <Route path="full-report/:id" element={<FullReport />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;