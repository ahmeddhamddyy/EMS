import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import PrivateRoutes from './utils/PrivateRoutes';
import RoleBaseRoutes from './utils/RoleBaseRoutes';
import AdminSummary from './components/dashboard/AdminSummary';
import MilitaryData from './pages/MilitaryData'; 

// تعريف سريع عشان لو الملف مش موجود ميعملش Error
const EmployeeDashboard = () => <div className="p-10 text-right">لوحة تحكم المستخدم</div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin-dashboard" />} />
        <Route path="/login" element={<Login />} />
        
        {/* لوحة تحكم الأدمن */}
        <Route path="/admin-dashboard" element={
          <PrivateRoutes>
            <RoleBaseRoutes requiredRole={["admin"]}>
              <AdminDashboard />
            </RoleBaseRoutes>
          </PrivateRoutes>
        }>
          <Route index element={<AdminSummary />} />
          <Route path="/admin-dashboard/military-data" element={<MilitaryData />} />
        </Route>

        {/* مسار المستخدم العادي */}
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