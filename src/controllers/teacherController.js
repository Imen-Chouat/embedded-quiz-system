import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import envConfig from '../config/envConfig.js';
import Teacher from '../modules/Teacher.js';

const registerTeacher = async (req,res)=>{
    try {
        const {name , surname , email , password} = req.body ;
        const emailExist = await Teacher.searchByemail(email);
        if(emailExist){
           return res.status(400).send({"message" : "Email already exists ."}) ;
        }
        const password_hash = await bcryptjs.hash(password,8);
        const newID = await Teacher.create(name,surname,email,password_hash);
        const teacher = await Teacher.getById(newID);
        return res.status(201).json(teacher);
    } catch (error) {
        return res.status(404).send({"message":"problem registering a teacher"});
    }
};

const loginTeacher = async (req,res)=>{
    try {
        const {email, password} = req.body ;
        const teacher = await Teacher.searchByemail(email);
        if(teacher){
            const isMatch = await bcryptjs.compare(password,teacher.password_hash);
            if(!isMatch){
                return res.status(400).json({"message":"wrongpassword"});
            }
            const token = jwt.sign({id : teacher.id , email : teacher.email},envConfig.JWT_SECRET,{expiresIn : '24h'});
            return res.status(201).json({"message":"teacher loged in successfully !",token});
        }else{
            return res.status(400).json({"message":"Email not found"});
        }

    } catch (error) {
        console.error(error);
    }
};

const modifyName = async (req,res) =>{
    try {
        const {id , newName } = req.body ;
        let teacher = await Teacher.getById(id);
        if(!teacher){
            return res.status(404).json({"message":"Wrong id"});
        }
        const modified = await Teacher.updateName(id,newName);
        if(modified > 0) {
            teacher = await Teacher.getById(id);
            return res.status(200).json({"message" : "The name modified successfully",teacher});
        }
        return res.status(400).json({"message":"Failling in modifying the name !"});
    }catch(error){
        console.error("Error modifying teacher name:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }

}

export default {
    registerTeacher ,
    loginTeacher,
    modifyName
};