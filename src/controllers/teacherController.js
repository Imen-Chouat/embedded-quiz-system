import bcryptjs from 'bcryptjs';
//import jwt from 'jsonwebtoken';
//import envConfig from '../config/envConfig.js';
import Teacher from '../modules/Teacher.js';
import Organization from '../modules/Organization.js';
import authController from './authController.js';
import fs from 'fs';
import csv from 'csv-parser';

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
            const {accessToken , refreshToken } = authController.generateTokensTeacher(teacher);
            await Teacher.updateRefreshToken(teacher.id,refreshToken);
            res.cookies("refreshToken",refreshToken,{
                httpOnly: true,
                secure: true,
                sameSite: "Strict",
            });
            return res.status(201).json({"message":"teacher loged in successfully !",token: accessToken,refreshToken});
        }else{
            return res.status(404).json({"message":"Email not found"});
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({"message":"error in the system !"});
    }
};

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

const addTeacherModule = async (req,res)=> {
    try {
        const {id,moduleName,levelName} = req.body ;
        let module_id = await Organization.getModuleID(moduleName);
        if(module_id == -1){
            await Organization.createModule(moduleName);
        }
        module_id = await Organization.getModuleID(moduleName)
        const level_id = await Organization.getLevelID(levelName);
        if (level_id == -1){
            return res.status(404).json({message:"wrong level Name."});
        }
        await Organization.addLevelModule(level_id,module_id);
        await Teacher.addTeacherModule(id,module_id);
        return res.status(201).json({message: "Added a module successfully !",id});
    } catch (error) {
        return res.status(500).json({message:"error adding a new module to the teacher "});
    }
}

const deleteTeacherModule = async (req,res) => {
    try {
        const {id,moduleName}=req.body;
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

const updateModuleLevel = async (req,res) => {
    try {
        const {id,moduleName,levelName} = req.body ;
        const module_id = await Organization.getModuleID(moduleName);
        if (module_id === -1) {
            return res.status(404).json({ message: "Module not found!" });
        }
        const level_id = await Organization.getLevelID(levelName);
        if (level_id === -1) {
            return res.status(404).json({ message: "Level not found!" });
        }
        await Organization.updateModuleLevel(module_id,level_id);
        return res.status(200).json({message:"the module level has been changed",id});
    } catch (error) {
        return res.status(500).json({message:"Error in updating the module's level ."});
    }
}

const updateModuleName = async (req,res) => {
    try {
        const {id,moduleName,newName} = req.body ;
        const module_id = await Organization.getModuleID(moduleName);
        if (module_id === -1) {
            return res.status(404).json({ message: "Module not found!" });
        }
        await Organization.updateModuleName(module_id,newName);        
        return res.status(200).json({message:"the module name has been changed",id});
    } catch (error) {
        return res.status(500).json({message:"Error in updating the module's name ."});
    }
}

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
                await Organization.processStudentData(records);
                fs.unlinkSync(filePath); // Delete file after processing
                res.json({ message: 'File processed successfully' });
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
};

const deleteAccount = async (req,res) => {
    try {
        const {id} = req.body ;
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
};
const getTeacherClasses = async (req, res) => {
    try {
      const teacherId = req.teacher.id;
  
      const [levels] = await pool.query(`
        SELECT DISTINCT lv.id AS level_id, lv.level_name
        FROM teachers t
        JOIN teach_module tm ON t.id = tm.teacher_id
        JOIN level_module lm ON tm.module_id = lm.module_id
        JOIN levels lv ON lm.level_id = lv.id
        WHERE t.id = ?
      `, [teacherId]);
  
      const levelsCleaned = [];
  
      for (const level of levels) {
        const [sections] = await pool.query(`
          SELECT s.id AS section_id, s.section_name
          FROM sections s
          WHERE s.level_id = ?
        `, [level.level_id]);
  
        const sectionsCleaned = [];
  
        for (const section of sections) {
          const [groups] = await pool.query(`
            SELECT g.id AS group_id, g.group_name
            FROM student_groups g
            WHERE g.section_id = ?
          `, [section.section_id]);
  
          const cleanedGroups = groups.map(g => ({ group_name: g.group_name }));
  
          sectionsCleaned.push({
            section_name: section.section_name,
            groups: cleanedGroups
          });
        }
        levelsCleaned.push({
          level_name: level.level_name,
          sections: sectionsCleaned
        });
      }
      res.status(200).json({ levels: levelsCleaned });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };
  


export default {
    registerTeacher ,
    loginTeacher,
    modifyName,
    modifySurName,
    modifyPassword,
    addTeacherModule,
    deleteTeacherModule,
    updateModuleLevel,
    updateModuleName,
    uploadStudentFile,
    deleteAccount ,
    getTeacherClasses 
};


