import axios from "axios";
import React, { createContext, useState, useContext, useEffect } from "react";

const userContext = createContext();

// authContext.jsx (النسخة الأوفلاين)
const authContext = ({ children }) => {
  // نضع بيانات الأدمن ثابتة هنا لكي لا تنهار أي صفحة تعتمد على اسم المستخدم
  const [user] = useState({ name: "مدير المنظومة", role: "admin" });

  return (
    <userContext.Provider
      value={{ user, login: () => {}, logout: () => {}, loading: false }}
    >
      {children}
    </userContext.Provider>
  );
};
export const useAuth = () => useContext(userContext);
export default authContext;
