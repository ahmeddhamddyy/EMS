// App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AdminSummary from "./components/dashboard/AdminSummary";
import SearchPage from "./pages/SearchPage";
import MilitaryData from "./pages/MilitaryData";
// استيراد الصفحة الجديدة هنا لحل الخطأ ✅
import SoldierReport from "./pages/SoldierReport";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />

        <Route path="/admin-dashboard" element={<AdminDashboard />}>
          <Route index element={<AdminSummary />} />
          <Route path="search-soldier" element={<SearchPage />} />
          <Route path="military-data" element={<MilitaryData />} />
          {/* مسار التقرير داخل لوحة التحكم ✅ */}
          <Route path="report/:id" element={<SoldierReport />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
