import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import PrivateRoutes from './utils/PrivateRoutes';
import RoleBaseRoutes from './utils/RoleBaseRoutes';
import AdminSummary from './components/dashboard/AdminSummary';
import MilitaryData from './pages/MilitaryData'; 
import PersonalData from './pages/PersonalData'; // استيراد الصفحة الجديدة ✅

// تعريف سريع للوحة تحكم المستخدم العادي
const EmployeeDashboard = () => <div className="p-10 text-right font-bold text-2xl">لوحة تحكم المستخدم</div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* التوجيه التلقائي */}
        <Route path="/" element={<Navigate to="/admin-dashboard" />} />
        <Route path="/login" element={<Login />} />
        
        {/* لوحة تحكم الأدمن (قائد المكتب / مدير المنظومة) */}
        <Route path="/admin-dashboard" element={
          <PrivateRoutes>
            <RoleBaseRoutes requiredRole={["admin"]}>
              <AdminDashboard />
            </RoleBaseRoutes>
          </PrivateRoutes>
        }>
          {/* الصفحة الرئيسية للوحة التحكم (الإحصائيات) */}
          <Route index element={<AdminSummary />} />
          
          {/* سجل البيانات العسكرية */}
          <Route path="/admin-dashboard/military-data" element={<MilitaryData />} />
          
          {/* سجل البيانات الشخصية والاجتماعية الجديد ✅ */}
          <Route path="/admin-dashboard/personal-data" element={<PersonalData />} />
        </Route>

        {/* مسار المستخدم العادي (الجندي/الموظف) */}
        <Route path="/employee-dashboard" element={
          <PrivateRoutes>
             <EmployeeDashboard />
          </PrivateRoutes>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;