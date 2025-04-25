import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import envConfig from '../config/envConfig.js';
import Student from '../modules/Student.js';
import pool from '../config/dbConfig.js';
import Organization from '../modules/Organization.js';
import authController from './authController.js';


const registerStudent = async (req, res) => {
    try {
      const { first_name, last_name, email, password} = req.body;
      
      const emailExist = await Student.searchByEmail(email);
      if (emailExist) {
        return res.status(400).send({ "message": "Email already exists." });
      }
      console.log("Hashing password..."); 
      const password_hash = await bcryptjs.hash(password, 8);
      console.log("Creating student..."); 
      const newID = await Student.create(first_name, last_name, email, password_hash );
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
            const {accessToken , refreshToken } = authController.generateTokenStudent(student);
            await Student.updateRefreshToken(student.id,refreshToken);
            res.cookie("refreshToken",refreshToken,{
                httpOnly: true,
                secure: true,
                sameSite: "Strict",
            });
            
            return res.status(201).json({"message":"student loged in successfully !",token: accessToken,refreshToken});
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
const updateStudentGroup = async (req, res) => {
    try {
        const studentId = req.student.id;
        const { new_group } = req.body;

        if (!new_group) {
            return res.status(400).json({ message: "Please provide a new group name." });
        }
        const student = await Student.getById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found." });
        }
        const [existsCSV] = await pool.execute(
            "SELECT * FROM student_group_csv WHERE email = ?",
            [student.email]
        );
        if (existsCSV.length === 0) {
            return res.status(403).json({ message: "You can't modify your group. CSV not uploaded by teacher." });
        }
        const [groupRows] = await pool.execute(
            "SELECT id FROM student_groups WHERE group_name = ?",
            [new_group]
        );
        if (groupRows.length === 0) {
            return res.status(400).json({ message: "This group does not exist." });
        }

        await pool.execute(
            "UPDATE student_group_csv SET group_id = ? WHERE email= ?",
            [groupRows[0].id, student.email]
        );

        return res.status(200).json({ message: "Group updated successfully." });

    } catch (error) {
        console.error("Error updating group:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

const deleteAccount = async (req, res) => {
    try {
        
        const studentId = req.student.id;
        console.log("Requête reçue pour suppression:", req.body);

        const student = await Student.getById(studentId);
        if (!student) {
            return res.status(404).json({ message: "No user with this ID!" });
        }

        await Student.delete(studentId);
        res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "Strict" });

        return res.status(200).json({ message: "Student account deleted successfully." });

    } catch (error) {
        console.error("Error deleting account:", error);
        return res.status(500).json({ message: "Error in deleting the account." });
    }
};


        const reviewQuiz = async (req,res) => {
            try {
                const {student_id,quiz_id} = req.body ;
                const [attended] = await pool.execute(`SELECT * FROM quiz_attempts WHERE quiz_id = ? AND student_id = ?`,[quiz_id,student_id]);
                if(!attended.length){
                    return res.status(404).json({message:"the student did not attend this quiz ."});
                }
                const questions = await Question.getQuizQuestions(quiz_id);
                let questionNanswer = await Promise.all(
                    questions.map(async (question) => {
                        const [answer] = await pool.execute(
                            `SELECT * FROM student_responses WHERE student_id = ? AND question_id = ? AND quiz_id = ?`,
                            [student_id, question.id, quiz_id]
                        );
        
                        if (answer.length === 0) {
                            return { question, answer: null }; // No answer for this question
                        }
        
                        let { answer_text, is_correct } = await Answer.getAnswerById(answer[0].id);
                        return { 
                            question, 
                            answer: { id: answer[0].id, answer_text, is_correct } 
                        };
                    })
                );
                const quiz = await Quiz.findById(quiz_id);
                return res.status(200).json({message:"successful fetching of the review",
                    quizAttempt: {quiz,questionNanswer}
                });
            } catch (error) {
                return res.status(500).json({message:"error fetching the quiz review"});
            }
        }  ;
const getstudentbygroup = async (req, res) => {
   
  try {
    const { group_name } = req.body;
    const [group] = await pool.query(`
      SELECT id
      FROM student_groups
      WHERE group_name = ?
    `, [group_name]);

    if (group.length === 0) {
      return res.status(404).json({ message: 'Group not found.' });
    }

    const groupId = group[0].id;
    const [students] = await pool.query(`
      SELECT  s.email
      FROM student_group_csv s
      WHERE s.group_id = ?
    `, [groupId]);

    if (students.length === 0) {
      return res.status(404).json({ message: 'No students found in this group.' });
    }
    res.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: 'Error fetching students.' });
  }} ;

export default {
    registerStudent ,
    loginStudent ,
    modify_LastName , 
    modify_FirstName ,
    deleteAccount,
    modify_password ,
    updateStudentGroup ,
    reviewQuiz ,
    getstudentbygroup 

};
