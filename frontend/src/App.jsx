import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AdminSummary from "./components/dashboard/AdminSummary";
import MilitaryData from "./pages/MilitaryData";
import PersonalData from "./pages/PersonalData";
import CareerData from "./pages/CareerData";
import SearchPage from "./pages/SearchPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. التوجيه التلقائي عند فتح البرنامج */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        {/* 2. مسار لوحة التحكم الرئيسي والمسارات الفرعية */}
        <Route path="/admin-dashboard" element={<AdminDashboard />}>
          <Route index element={<AdminSummary />} />
          <Route path="search-soldier" element={<SearchPage />} />
          <Route path="military-data" element={<MilitaryData />} />
          <Route path="personal-data" element={<PersonalData />} />
          <Route path="career-data" element={<CareerData />} />
        </Route>

        {/* 3. حل مشكلة الـ 404 أو رابط Login القديم ✅ */}
        {/* هذا السطر يلتقط أي رابط غير معرف (مثل /login) ويوجهه فوراً للوحة التحكم */}
        <Route path="*" element={<Navigate to="/admin-dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
