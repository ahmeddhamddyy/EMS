import jwt from 'jsonwebtoken';
import User from '../models/Soldier.js'
import bcrypt from 'bcrypt'

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // هنا بتكتب منطق التأكد من المستخدم (مثال سريع)
        // لو المستخدم موجود وباسورده صح:
        return res.status(200).json({
            success: true,
            token: "fake-jwt-token",
            user: { name: "الآدمن", role: "admin" }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};