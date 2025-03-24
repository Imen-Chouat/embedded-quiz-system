import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import envConfig from '../config/envConfig.js';
import Student from '../modules/Student.js';
import pool from '../config/dbConfig.js';


const registerStudent = async (req, res) => {
    try {
      const { first_name, last_name, email, password, level_name, section_name, group_name } = req.body;
      
      const emailExist = await Student.searchByEmail(email);
      if (emailExist) {
        return res.status(400).send({ "message": "Email already exists." });
      }

      const [level] = await pool.execute("SELECT id FROM levels WHERE level_name = ?", [level_name]);
      if (level.length === 0) {
        return res.status(404).send({ "message": "Level not found." });
      }
      const level_id = level[0].id;
      console.log("Finding section_id for section_name:", section_name); 
      const [section] = await pool.execute("SELECT id FROM sections WHERE section_name = ? AND level_id = ?", [section_name, level_id]);
      if (section.length === 0) {
        return res.status(404).send({ "message": "Section not found." });
      }
      const section_id = section[0].id;
      console.log("Finding group_id for group_name:", group_name); 
      const [group] = await pool.execute("SELECT id FROM student_groups WHERE group_name = ? AND section_id = ?", [group_name, section_id]);
      if (group.length === 0) {
        return res.status(404).send({ "message": "Group not found." });
      }
      const group_id = group[0].id;
      console.log("Hashing password..."); 
      const password_hash = await bcryptjs.hash(password, 8);
      console.log("Creating student..."); 
      const newID = await Student.create(first_name, last_name, email, password_hash, group_id);
      const student = await Student.getById(newID);
  
      return res.status(201).json(student);
    } catch (error) {
      console.error("Error in registerStudent:", error);
      return res.status(500).send({ "message": "Problem registering a student", "error": error.message });
    }
  };
const loginStudent = async (req,res)=>{ 
    try {
        const {email, password} = req.body ;
        const student = await Student.searchByEmail(email);
        if(student){
            const isMatch = await bcryptjs.compare(password,student.password_hash);
            if(!isMatch){
                return res.status(400).json({"message":"wrong password"});
            }
            const token = jwt.sign({id : student.id , email : student.email},envConfig.JWT_SECRET,{expiresIn : '24h'});
            return res.status(201).json({"message":"student loged in successfully !",token});
        }
        else{
         return res.status(400).json({"message":"Email not found"});
        }

    } catch (error) {
        console.error(error);
    }
};

const modify_LastName = async (req,res) =>{
    try {
        const studentId = req.student.id;
        const { newName } = req.body ;
        let student = await Student.getById(studentId);
        
        if(!student){
            return res.status(404).json({"message":"Wrong id and student not found "});
        }
        const modified = await Student.update_LastName(studentId, newName);
        if(modified > 0) {
            student = await Student.getById(studentId);
            return res.status(200).json({"message" : "The name modified successfully",student});
        }
        return res.status(400).json({"message":"Failling in modifying the name !"});
    }catch(error){
        console.error("Error modifying student name:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }

} 
const modify_FirstName = async (req,res) =>{
    try {
        const studentId = req.student.id;
        const { newName } = req.body ;
        let student = await Student.getById( studentId );
        if(!student){
            return res.status(404).json({"message":"Wrong id"});
        }
        const modified = await Student.update_FirstName( studentId , newName);
        if(modified > 0) {
            student = await Student.getById( studentId );
            return res.status(200).json({"message" : "The firstname modified successfully",student});
        }
        return res.status(400).json({"message":"Failling in modifying the firstname !"});
    }catch(error){
        console.error("Error modifying student firstname:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }

} 
const modify_password = async (req,res) =>{
    try {
        const studentId = req.student.id;
        const {  new_password } = req.body ;
        let student = await Student.getById( studentId );
        if(!student){
            return res.status(404).json({"message":"Wrong id"});
        }
        const modified = await Student.update_Password( studentId ,new_password);
        if(modified > 0) {
            student = await Student.getById(studentId );
            return res.status(200).json({"message" : "The password modified successfully",student});
        }
        return res.status(400).json({"message":"Failling in modifying the password !"});
    }catch(error){
        console.error("Error modifying student password :", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}
const modify_group = async (req,res) =>{
        try{
        const studentId = req.student.id;    
        const {  new_level , new_section , new_group} = req.body ;
        let student = await Student.getById( studentId );
        if (!student){
            return res.status(404).json({"message":"Wrong id"});
        }
        const [promo] = await pool.execute("SELECT id FROM levels WHERE level_name = ?", [new_level]);
        if (promo.length === 0) {
            throw new Error("NewPromo non trouvée !");
        }
        const level_id = promo[0].id;
        const [section] = await pool.execute("SELECT id FROM sections WHERE section_name = ? AND level_id = ?", [new_section, level_id]);
        if (section.length === 0) {
            throw new Error("Section non trouvée !");
        }
        const section_id = section[0].id;
        const [group] = await pool.execute("SELECT id FROM student_groups WHERE group_name = ? AND section_id = ?", [new_group, section_id]);
        if (group.length === 0) {
            throw new Error("Groupe non trouvé !");
        }
        const group_id = group[0].id;
        const modified = await Student.update_groupid( studentId , group_id);
        if(modified > 0) {
            student = await Student.getById(studentId );
            return res.status(200).json({"message" : "The group_id  modified successfully",student});
        }
        return res.status(400).json({"message":"Failling in modifying the group_id  !"});
        }catch(error){
            console.error("Error modifying student group_id  :", error);
            return res.status(500).json({ message: "Server error", error: error.message });
        }
}

export default {
    registerStudent ,
    loginStudent ,
    modify_LastName , 
    
    modify_FirstName ,

    modify_password ,
    modify_group

};

