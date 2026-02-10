import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// استيراد الصفحات
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AdminSummary from "./components/dashboard/AdminSummary";
import SearchSoldier from "./pages/SearchSoldier"; // الصفحة اللي عملناها بالتصميم الجديد ✅
import MilitaryData from "./pages/MilitaryData";
import PersonalData from "./pages/PersonalData"; 
import CareerData from "./pages/CareerData";
import PenaltiesPage from "./pages/PenaltiesPage";
import FullReport from "./pages/FullReport"; // ورقة الطباعة الرسمية
import CategoryList from "./pages/CategoryList";
import ReserveNotebook from "./pages/ReserveNotebook";
import SoldierProfile from "./pages/SoldierProfile"; // البروفايل الرقمي الشامل (الزيتي) ✅

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        
        {/* لوحة التحكم الرئيسية */}
        <Route path="/admin-dashboard" element={<AdminDashboard />}>
          <Route index element={<AdminSummary />} />
          
          {/* مركز الاستعلام: تأكد أن المسار مطابق لما في الـ Sidebar ✅ */}
          <Route path="search-soldier" element={<SearchSoldier />} />
          
          {/* إدخال البيانات */}
          <Route path="military-data" element={<MilitaryData />} />
          <Route path="personal-data" element={<PersonalData />} />
          <Route path="career-data" element={<CareerData />} />
          
          {/* السجلات والقوائم */}
          <Route path="penalties-list" element={<PenaltiesPage />} />
          <Route path="reserve-archive" element={<ReserveNotebook />} />
          <Route path="category/:category" element={<CategoryList />} />

          {/* الملف الرقمي الشامل (الزيتي الذهبي - المشتملات) ✅ */}
          <Route path="soldier-profile/:id" element={<SoldierProfile />} />

          {/* التقرير الرسمي (الطباعة البيضاء) ✅ */}
          <Route path="full-report/:id" element={<FullReport />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;