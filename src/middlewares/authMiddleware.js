import jwt from 'jsonwebtoken';
import envConfig from '../config/envConfig.js';

const authenticateStudent = (req, res, next) => {
    const authHeader = req.header("Authorization");
    console.log("Authorization Header:", authHeader);
    if (!authHeader) {
        return res.status(401).json({ message: "Access Denied. No token provided." });
    }
    const token = authHeader.split(" ")[1];
    console.log("Extracted Token:", token);
    if (!token) {
        return res.status(401).json({ message: "Access Denied. Invalid token format." });
    }
    try {
        console.log("Token received:", token);
        const decoded = jwt.verify(token, envConfig.JWT_SECRET);
        console.log("Decoded Token Data:", decoded);
        req.student = decoded;
        next(); 
    } catch (error) {
        console.error("Token Verification Error:", error.message);
        return res.status(400).json({ message: "Invalid Token" });
    }
};

const authTeacherMiddleware = async (req ,res , next )=>{
    try{
        const authHeaders = req.headers['authorization'];
        if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
            return res.status(401).json({ "message": "No token provided or format incorrect" });
        }
        const token = authHeaders.split(" ")[1];
        if(!token){
            return res.status(401).json({"message":"no token were attached"});
        }
        const decoded = jwt.verify(token,envConfig.JWT_SECRET);
        req.teacher = decoded ;
        console.log("the teacher json :",req.teacher);
        next();
    } catch (error) {
        return res.status(403).json({"message":"token not autherized"}); 
    }
} 

export default { 
    authenticateStudent ,
    authTeacherMiddleware
};
