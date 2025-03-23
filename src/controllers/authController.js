import jwt from 'jsonwebtoken';
import envConfig from '../config/envConfig.js';
import Teacher from '../modules/Teacher.js';

const generateTokensTeacher= (teacher)=>{
    const accessToken = jwt.sign({id:teacher.id , email:teacher.email},envConfig.JWT_SECRET,{expiresIn : '15m'});
    const refreshToken = jwt.sign({id:teacher.id,email:teacher.email},envConfig.REFRESH_TOKEN_SECRET,{expiresIn:'90d'});
    return {accessToken , refreshToken} ;
}
const refreshAccessToken = (req,res)=>{
    try {
        const {refreshToken} = req.cookies;
        if(!refreshToken){
            return res.status(401).json({ message: "Invalid refresh token" });
        }
        jwt.verify(refreshToken,envConfig.REFRESH_TOKEN_SECRET,(err,decoded)=>{
            if(err){
                return res.status(403).json({ message: "Invalid refresh token" });
            }
            const {id,email} = decoded;
            const token = jwt.sign({id,email},envConfig.JWT_SECRET,{expiresIn:'15m'});
            return res.status(200).json({"message":"access token refreshed successfully!",token});
        })
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
}
const logoutTeacher = async (req, res) => {
    try {
        const {refreshToken} = req.cookies ;
        if(!refreshToken){
            return res.status(401).json({ message: "Unauthorized" });
        }
        const {id} = req.body;
        await Teacher.updateRefreshToken(id,null);
        res.clearCookie("refreshToken",{httpOnly: true, secure: true, sameSite: "Strict"});
        return res.status(200).json({ message: "Logged out successfully!" });
    } catch (error) {
        return res.status(500).json({ message: "Error Logging out!" });
    }
};
export default {
    logoutTeacher,
    refreshAccessToken,
    generateTokensTeacher
}
