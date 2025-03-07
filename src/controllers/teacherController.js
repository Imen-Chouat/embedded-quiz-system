import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import envConfig from '../config/envConfig.js';
import Teacher from '../modules/Teacher.js';

const registerTeacher = async (req,res)=>{
    try {
        const {name , surname , email , password} = req.body ;
        if(!name || !surname || !email || !password ){
            return res.status(404).json({"message":"all fields are required!"});
        }
        const emailExist = await Teacher.searchByemail(email);
        if(emailExist){
           return res.status(404).send({"message" : "Email already exists ."}) ;
        }
        const password_hash = await bcryptjs.hash(password,10);
        const newID = await Teacher.create(name,surname,email,password_hash);
        const teacher = await Teacher.getById(newID);
        return res.status(201).json({"message":"Teacher registered successfully",teacher});
    } catch (error) {
        return res.status(500).send({"message":"problem registering a teacher"});
    }
};

const loginTeacher = async (req,res)=>{
    try {
        const {email, password} = req.body ;
        if(!email || !password){
            return res.status(404).json({"message":"all fields are required!"});
        }

        const teacher = await Teacher.searchByemail(email);
        if(teacher){
            const isMatch = await bcryptjs.compare(password,teacher.password_hash);
            if(!isMatch){
                return res.status(404).json({"message":"wrongpassword"});
            }
            const token = jwt.sign({id : teacher.id , email : teacher.email},envConfig.JWT_SECRET,{expiresIn : '24h'});
            return res.status(201).json({"message":"teacher loged in successfully !",token});
        }else{
            return res.status(404).json({"message":"Email not found"});
        }

    } catch (error) {
        res.status(500).json({"message":"error in the system !"});
    }
};

const modifyName = async (req,res) =>{
    try {
        console.log(req.teacher);
        const name= req.body.name ;
        const id = req.teacher.id ;
        let teacher = await Teacher.getById(id);
        if(!teacher){
            return res.status(404).json({"message":"Wrong id"});
        }
        const modified = await Teacher.updateName(id,name);
        let emailExtract = teacher.email ;
        teacher = {
            id : id ,
            email : emailExtract
        }
        if(modified > 0) {
            return res.status(200).json({"message" : "The name modified successfully",teacher});
        }
        return res.status(404).json({"message":"Failling in modifying the name !"});
    }catch(error){
        return res.status(500).json({ message: "Server error", error: error.message });
    }

}

const modifySurName = async (req,res)=>{
    try {
        const id = req.teacher.id ;
        const surname = req.body.surname ;
        if(!surname){
            return res.status(404).json({"message":"A new surname is required"});
        }
        let teacher = await Teacher.getById(id);
        if(!teacher){
            return res.status(404).json({"message":"no teacher with this id!"});
        }   
        const modified = await Teacher.updateSurname(id,surname);
        const extractEmail = teacher.email ;
        teacher = {
            id ,
            email : extractEmail
        }
        if(modified > 0) {
            return res.status(200).json({"message" : "The name modified successfully",teacher});
        }
        return res.status(404).json({"message":"Failling in modifying the surname !"});
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });        
    }
}

const modifyPassword = async (req,res) => {
    try {
        const id = req.teacher.id ;
        let teacher = await Teacher.getById(id);
        if(!teacher){
            return res.status(404).json({"message":"no tacher with this id"});
        }
        const { password ,newPassword } = req.body ;
        if(!password || !newPassword){
            return res.status(404).json({"message":"both old and new passwords are required!"});
        }
        const isEqual = await bcryptjs.compare(password,teacher.password_hash);
        if(!isEqual){
            return res.status(404).json({"message":"wrong password"});
        }
        const hashedPassword = await bcryptjs.hash(newPassword,10);
        const modified = await Teacher.updatePassword(id,hashedPassword);
        const extractEmail = teacher.email ;
        teacher = {
            id ,
            email : extractEmail
        }
        if(modified > 0){
            return res.status(200).json({"message":"updated the password successfully!",teacher});
        }
        return res.status(404).json({"message":"Failled updating the password!"});
    } catch (error) {
        
    }
}

export default {
    registerTeacher ,
    loginTeacher,
    modifyName,
    modifySurName,
    modifyPassword
};
