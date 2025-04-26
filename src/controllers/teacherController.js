import bcryptjs from 'bcryptjs';
//import jwt from 'jsonwebtoken';
//import envConfig from '../config/envConfig.js';
import Teacher from '../modules/Teacher.js';
import Organization from '../modules/Organization.js';
import authController from './authController.js';
import fs from 'fs';
import csv from 'csv-parser';
//Imen : this is to register a teacher for the first time
const registerTeacher = async (req,res)=>{
    try {
        const {name , surname , email , password} = req.body ;
        if(!name || !surname || !email || !password ){
            return res.status(433).json({"message":"all fields are required!"});
        }
        const emailExist = await Teacher.searchByemail(email);
        if(emailExist){
           return res.status(444).send({"message" : "Email already exists ."}) ;
        }
        const password_hash = await bcryptjs.hash(password,10);
        const newID = await Teacher.create(name,surname,email,password_hash);
        const teacherFull = await Teacher.getById(newID);
        const teacher = {
            id:teacherFull.id,
            name: teacherFull.name,
            "surname": teacherFull.surname,
            "email": teacherFull.email,
        }
        return res.status(201).json({"message":"Teacher registered successfully",teacher});
    } catch (error) {
        return res.status(500).send({"message":"problem registering a teacher"});
    }
};
//Imen :Login a teacher , it returns its token
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
            const {accessToken , refreshToken } = authController.generateTokensTeacher(teacher);
            await Teacher.updateRefreshToken(teacher.id,refreshToken);
            res.cookie("refreshToken",refreshToken,{
                httpOnly: true,
                secure: true,
                sameSite: "Strict",
            });
            return res.status(201).json({"message":"teacher loged in successfully !",token: accessToken,refreshToken});
        }else{
            return res.status(404).json({"message":"Email not found"});
        }

    } catch (error) {
        res.status(500).json({"message":"error in the system !"});
    }
};
const getFirstName = async (req,res) =>{
    try {
        const id = req.teacher.id ;
        const teacherName = await Teacher.getName(id);
        if(teacherName){
            return res.status(200).json({"message":"the name fetching has successed!","firstName":teacherName});
        }

    } catch (error) {
        return res.status(500).json({"message":"error in the system "}); 
    }
}

const getLastName = async (req,res) =>{
    try {
        const id = req.teacher.id ;
        const teacherSurName = await Teacher.getSurName(id);
        if(teacherSurName){
            return res.status(200).json({"message":"the name fetching has successed!","lastName":teacherSurName});
        }

    } catch (error) {
        return res.status(500).json({"message":"error in the system !"}); 
    }
}
const getEmail = async (req,res) =>{
    try {
        const id = req.teacher.id ;
        const teacherEmail = await Teacher.getEmail(id);
        if(teacherEmail){
            return res.status(200).json({"message":"the email fetching has successed!","email":teacherEmail});
        }

    } catch (error) {
        return res.status(500).json({"message":"error in the system !"}); 
    }
}
//Imen :update the name in the settings
const modifyName = async (req,res) =>{
    try {
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
        const tokenH = req.headers["authorization"];
        const token = tokenH.split(" ") [1];
        if(modified > 0) {
            return res.status(200).json({"message" : "The name modified successfully",teacher,token});
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
            return res.status(404).json({"message":"A new surname is required"})
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
        const tokenH = req.headers["authorization"];
        const token = tokenH.split(" ") [1];
        if(modified > 0) {
            return res.status(200).json({"message" : "The name modified successfully",teacher,token});
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
//Imen:
const addLevel = async (req,res) => {
    try {
        
    } catch (error) {
        return res.status(500).json({message:"error adding a new Level to the teacher "});
    }
};
//Imen :
const addTeacherModule = async (req,res)=> {
    //try { 
        const id = req.teacher.id;
        const {moduleName,levelName} = req.body ;
        console.log(moduleName,levelName);
        let module_id = await Organization.getModuleID(moduleName);
        if(module_id == -1){
            await Organization.createModule(moduleName);
        }
        module_id = await Organization.getModuleID(moduleName)
        const level_id = await Organization.getLevelID(levelName);
        if (level_id == -1){
            console.log(level_id)
            return res.status(407).json({message:"wrong level Name."});
        }
        await Organization.addLevelModule(level_id,module_id);
        const i = await Teacher.addTeacherModule(id,module_id);
        const email = await Teacher.getEmail(id);
        const teacher = {id,email}
        const message = i === -567 ? "The module already Exists" : "Added a module successfully !";
        return res.status(201).json({message,teacher});
    /*} catch (error) {
        return res.status(500).json({message:"error adding a new module to the teacher "});
    }*/
}
//Imen :
const deleteTeacherModule = async (req,res) => {
    try {
        const id = req.teacher.id;
        const {moduleName}=req.body;
        const module_id = await Organization.getModuleID(moduleName);
        if (module_id === -1) {
            return res.status(404).json({ message: "Module not found!" });
        }
        await Teacher.deleteTeacherModule(id,module_id);
        return res.status(200).json({ message: "Module successfully removed from the teacher's list!" ,id});
    } catch (error) {
        return res.status(501).json({message:"error deleting the module from the teachers list !"});
    }
}
//Imen :
const updateModuleLevel = async (req,res) => {
    try {
        const id = req.teacher.id;  
        const {moduleName,levelName} = req.body ;
        const email = await Teacher.getEmail(id);
        const teacher = {id,email};
        const module_id = await Organization.getModuleID(moduleName);
        if (module_id === -1) {
            return res.status(404).json({ message: "Module not found!" ,teacher});
        }
        const level_id = await Organization.getLevelID(levelName);
        if (level_id === -1) {
            return res.status(404).json({ message: "Level not found!" ,teacher});
        }
        await Organization.updateModuleLevel(module_id,level_id);
        return res.status(200).json({message:"the module level has been changed",teacher});
    } catch (error) {
        return res.status(500).json({message:"Error in updating the module's level ."});
    }
}
//Imen :
const updateModuleName = async (req,res) => {
    try {
        const id = req.teacher.id;
        const {moduleName,newName} = req.body ;
        const module_id = await Organization.getModuleID(moduleName);
        if (module_id === -1) {
            return res.status(404).json({ message: "Module not found!" });
        }
        await Organization.updateModuleName(module_id,newName);       
        const email = await Teacher.getEmail(id);
        const teacher = {id,email}; 
        return res.status(200).json({message:"the module name has been changed",teacher});
    } catch (error) {
        return res.status(500).json({message:"Error in updating the module's name ."});
    }
}
//Imen :
const uploadStudentFile = async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const filePath = req.file.path;
    const records = [];

    // Read and parse CSV file
    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
            records.push(row);
        })
        .on('end', async () => {
            try {
                console.log(records);
                await Organization.processStudentData(records);
                fs.unlinkSync(filePath); // Delete file after processing
                res.json({ message: 'File processed successfully' });
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
};
//Imen :
const deleteAccount = async (req,res) => {
    try {
        const id = req.teacher.id;
        const teacher = await Teacher.getById(id);
        if(!teacher){
            return res.status(404).json({message:"no user with this id!",id});
        }
        await Teacher.delete(id);
        res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "Strict" });
        return res.status(200).json({message:"Teacher is deleted successfully"});
    } catch (error) {
        return res.status(500).json({message:"Error in deleting the account ."});
    }
}
//Imen:
const getTeachermodules = async (req, res) => {
    try {
      const id = req.teacher.id;
      const modules = await Teacher.getTeacherModules(id);
      return res.status(200).json({ modules }); // ✅ Wrap in JSON response
    } catch (error) {
      console.error("Error fetching teacher modules:", error);
      return res.status(500).json({ message: "Error in fetching modules." });
    }
  };

export default {
    registerTeacher ,
    loginTeacher,
    getFirstName,
    getLastName,
    getEmail,
    modifyName,
    modifySurName,
    modifyPassword,
    addLevel,
    addTeacherModule,
    deleteTeacherModule,
    updateModuleLevel,
    updateModuleName,
    uploadStudentFile,
    deleteAccount,
    getTeachermodules
};
