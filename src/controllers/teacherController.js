import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Teacher from '../modules/Teacher.js';

const registerTeacher = async (req,res)=>{
    try {
        const {name , surname , email , password} = req.body ;
        const emailExist = await Teacher.seachByemail(email);
        if(emailExist){
           return res.status(400).send({"message" : "Email already exists ."}) ;
        }
        const password_hash = bcryptjs.hash(password,8);
        const newID = Teacher.create(name,surname,email,password_hash);
        const teacher = Teacher.getById(newID);
        return res.status(201).json(teacher);
    } catch (error) {
        return res.status(404).send({"message":"problem registering a teacher"});
    }
};

const loginTeacher = async (rea,res)=>{
    try {
        const {email, password} = req.body ;
        const teacher = await Teacher.seachByemail(email);
        if(teacher){
            const isMatch = await bcryptjs.compare(password,teacher.password);
            if(!isMatch){
                return res.status(400).json({"message":"wrongpassword"});
            }
            const token = jwt.sign({id : teacher.id , email : teacher.email},process.env.JWT_SECRET,{expiresIn : '24h'});
            return res.status(201).json({"message":"teacher loged in successfully !",token});
        }else{
            return res.status(400).json({"message":"Email not found"});
        }

    } catch (error) {
        console.error(error);
    }
};

export default {
    registerTeacher ,
    loginTeacher
};