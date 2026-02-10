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
import CategoryList from "./pages/CategoryList";

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
          
          {/* مسارات إدخال البيانات - الترتيب مهم ✅ */}
          <Route path="military-data" element={<MilitaryData />} />
          <Route path="personal-data" element={<PersonalData />} />
          <Route path="career-data" element={<CareerData />} />
          
          {/* مسارات التقارير والجزاءات */}
          <Route path="penalties-list" element={<PenaltiesPage />} /> 
          <Route path="full-report/:id" element={<FullReport />} />
          <Route path="category/:category" element={<CategoryList />} />
          
          {/* إضافة مسار الأرشيف لو محتاجه مستقبلاً */}
          <Route path="reserve-archive" element={<CategoryList category="رديف" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;