import jwt from "jsonwebtoken";
import envConfig from "../config/envConfig.js";
import Quiz from "../modules/Quiz.js";
import pool from "../config/dbConfig.js";
import fs from "fs";
import csv from "csv-parser";
import multer from "multer";
import Question from '../modules/Question.js';
import Answer from '../modules/Answer.js';


const createQuiz = async (req, res) => {
    try {
        const teacher_id = req.teacher.id;
        const { title, module, timed_by, duration,questionVisibility } = req.body;
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5]?[0-9]):([0-5]?[0-9])$/;
        
        if (timed_by === 'quiz' && !timeRegex.test(duration)) {
            return res.status(401).json({ message: "Invalid duration format. Use 'HH:MM:SS'." });
        }
        const [moduleRows] = await pool.execute(
            `SELECT id FROM modules WHERE moduleName = ?`,
            [module]
        );
        if (moduleRows.length === 0) {
            return res.status(404).json({ message: "Module not found." });
        }

        const module_id = moduleRows[0].id;
        

        const [teachRows] = await pool.execute(
            `SELECT * FROM teach_module WHERE teacher_id = ? AND module_id = ?`,
            [teacher_id, module_id]
        );
        if (teachRows.length === 0) {
            return res.status(403).json({ message: "Unauthorized. You can only create quizzes for modules you teach." });
        } 

        let quizDuration;

        if (timed_by === 'quiz') {
            quizDuration = duration;  
        } else if (timed_by === 'question') {
            quizDuration = "00:00:00"; 
        } else {
            return res.status(400).json({ message: "Invalid timed_by value. Must be 'quiz' or 'question'." });
        }
        const quizId = await Quiz.create(teacher_id, module_id, title, timed_by, quizDuration, questionVisibility);
        const quiz = await Quiz.findById(quizId);
        return res.status(201).json({ quiz });

    } catch (error) {
        console.error("Error creating quiz:", error);
        return res.status(500).json({ message: "Failed to create quiz. Please try again later." });
    }
};


const deleteQuiz = async (req, res) => {
    try {
        const teacherId = req.teacher.id; 
        const { id } = req.params;
        const quiz = await Quiz.findById(id);
        if (!quiz || quiz.teacher_id !== teacherId) {
            return res.status(403).json({ message: "Vous n'êtes pas autorisé à supprimer ce quiz." });
        }
        await Quiz.delete(id);
        res.status(200).json({ message: "Quiz supprimé avec succès." });

    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression du quiz." });
    }
};
const Quizzes_Type  = async (req, res) => {
    try {
        const teacherId = req.teacher.id; 
        const { timed_by } = req.query; 
        const quizzes = await Quiz.getQuizzesByType(teacherId, timed_by);
        return res.status(200).json({ quizzes });
    } catch (error) {
        console.error("Error in getQuizzesByType:", error);
        return res.status(500).json({ message: "Failed to fetch quizzes by timed_by." });
    }
};

// get allquizzes for a teacher 

const ALLQuizzes2 = async (req, res) => {
    try {
        const teacherId = req.teacher.id;  
        const quizzes = await Quiz.getAllQuizzesByTeacher(teacherId);

        return res.status(200).json({ quizzes });
    } catch (error) {
        console.error("Error in getAllQuizzesByTeacher:", error);
        return res.status(500).json({ message: "Failed to fetch quizzes." });
    }
};


const Draft_Quizzes = async (req, res) => {
    try {
        const teacherId = req.teacher.id; 
        console.log("Teacher ID:", teacherId);
      

        if (!teacherId ) {
            return res.status(400).json({ message: "Missing teacherId " });
        }
        const draft = await Quiz.getDraftQuizzes(teacherId);
        return res.status(200).json({draft });
    } catch (error) {
        console.error("Error in getDraftQuizzes:", error);
        return res.status(500).json({ message: "Failed to fetch draft quizzes." });
    }
};


const Past_Quizzes = async (req, res) => {
    try {
        const teacherId = req.teacher.id; 
        
        const Past = await Quiz.getPastQuizzes(teacherId);
        return res.status(200).json({ Past });
    } catch (error) {
        console.error("Error in getPastQuizzes:", error);
        return res.status(500).json({ message: "Failed to fetch Past quizzes ." });
    }
};

const update_title = async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;
        const teacherId = req.teacher.id; 

        const quiz = await Quiz.findById(id);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found." });
        }

        if (quiz.teacher_id !== teacherId) {
            return res.status(403).json({ message: "Unauthorized. You can only update your own quizzes." });
        }

        const isUpdated = await Quiz.update_Title(id, title);
        if (isUpdated) {
            const updatedQuiz = await Quiz.findById(id);
            return res.status(200).json({ message: "Quiz updated successfully.", quiz: updatedQuiz });
        }

        return res.status(400).json({ message: "Quiz update failed." });
    } catch (error) {
        console.error("Error updating quiz:", error);
        return res.status(500).json({ message: "Failed to update quiz. Please try again later." });
    }
};
const getModuleNameById = async (req, res) => {
    try {
        const { module_id } = req.body;

        const [rows] = await pool.query(`SELECT moduleName FROM modules WHERE id = ?`, [module_id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Module not found" });
        }

        res.status(200).json({ moduleName: rows[0].moduleName });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const update_duration = async (req, res) => {
    try {
        const { id } = req.params;
        const { duration } = req.body;
        const teacherId = req.teacher.id; 
        const quiz = await Quiz.findById(id);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found." });
        }
        if (quiz.teacher_id !== teacherId) {
            return res.status(403).json({ message: "Unauthorized. You can only update your own quizzes." });
        }
        const isUpdated = await Quiz.update_duration(id, duration);
        if (isUpdated) {
            const updatedQuiz = await Quiz.findById(id);
            return res.status(200).json({ message: "Quiz updated successfully.", quiz: updatedQuiz });
        }
        return res.status(400).json({ message: "Quiz update failed." });
    } catch (error) {
        console.error("Error updating quiz:", error);
        return res.status(500).json({ message: "Failed to update quiz. Please try again later." });
    }
};

const update_timedby = async (req, res) => {
    try {
        const { id } = req.params;
        const { timedby } = req.body;
        const teacherId = req.teacher.id; 

        const quiz = await Quiz.findById(id);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found." });
        }

        if (quiz.teacher_id !== teacherId) {
            return res.status(403).json({ message: "Unauthorized. You can only update your own quizzes." });
        }

        const isUpdated = await Quiz.update_timedby(id, timedby);
        if (isUpdated) {
            const updatedQuiz = await Quiz.findById(id);
            return res.status(200).json({ message: "Quiz updated successfully.", quiz: updatedQuiz });
        }

        return res.status(400).json({ message: "Quiz update failed." });
    } catch (error) {
        console.error("Error updating quiz:", error);
        return res.status(500).json({ message: "Failed to update quiz. Please try again later." });
    }
}; 
const update_visibility = async (req, res) => {
    try {
        const { id } = req.params;
        const { visibility } = req.body;
        const teacherId = req.teacher.id; 

        const quiz = await Quiz.findById(id);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found." });
        }

        if (quiz.teacher_id !== teacherId) {
            return res.status(403).json({ message: "Unauthorized. You can only update your own quizzes." });
        }

        const isUpdated = await Quiz.update_visibility(id, visibility);
        if (isUpdated) {
            const updatedQuiz = await Quiz.findById(id);
            return res.status(200).json({ message: "Visibility updated successfully.", quiz: updatedQuiz });
        }

        return res.status(400).json({ message: "Visibility update failed." });
    } catch (error) {
        console.error("Error updating quiz visibility:", error);
        return res.status(500).json({ message: "Failed to update visibility. Please try again later." });
    }
};
const update_Module = async (req, res) => {
    try {
        const { id } = req.params;
        const { module } = req.body;
        const teacherId = req.teacher.id; 

        const quiz = await Quiz.findById(id);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found." });
        }

        if (quiz.teacher_id !== teacherId) {
            return res.status(403).json({ message: "Unauthorized. You can only update your own quizzes." });
        }

        const isUpdated = await Quiz.update_Module(id, module);
        if (isUpdated) {
            const updatedQuiz = await Quiz.findById(id);
            return res.status(200).json({ message: "Quiz updated successfully.", quiz: updatedQuiz });
        }
        return res.status(400).json({ message: "Quiz update failed." });
    } catch (error) {
        console.error("Error updating quiz:", error);
        return res.status(500).json({ message: "Failed to update quiz. Please try again later." });
    }
};
const randomazation = async (req, res) => {
    try {
        const { quizId } = req.params;
        
        const questions = await Quiz.getRandomizedQuestions(quizId);

        if (questions.length === 0) {
            return res.status(404).json({ message: "No questions found for this quiz." });
        }

        return res.status(200).json({ questions });

    } catch (error) {
        console.error("Error fetching quiz questions:", error);
        return res.status(500).json({ message: "Failed to fetch quiz questions. Please try again later." });
    }
};
// submission 
// ki student ydir start quiz manuellement
const startQuizstudent= async (req, res) => {
    try {
        const studentId = req.student.id; 
        const { quizId } = req.body; 
        const attemptId = await Quiz.startQuizAttempt(studentId, quizId);
        return res.status(200).json({ message: "Quiz attempt started successfully.", attemptId });
    } catch (error) {
        console.error("Error in startQuizAttempt:", error);
        return res.status(500).json({ message: "Failed to start quiz attempt." });
    }
}
// Submit a quiz manually
const submitQuizManually = async (req, res) => {
    try {
        const studentId = req.student.id; 
        const { quizId, responses } = req.body; 
        const result = await Quiz.submitQuizManually(studentId, quizId, responses);
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error in submitQuizManually:", error);
        return res.status(500).json({ message: "Failed to submit quiz manually." });
    }
}
const autoSubmitQuiz = async (req, res) => {
    try {
        const studentId = req.student.id; 
        const { quizId } = req.body; 
        
        const result = await Quiz.autoSubmitQuiz(studentId, quizId);

        if (result === "already_submitted") {
            return res.status(400).json({ message: "Quiz already submitted manually." });
        }

        return res.status(200).json({ message: "Automatic submission scheduled successfully." });
    } catch (error) {
        console.error("Error in autoSubmitQuiz:", error);
        return res.status(500).json({ message: "Failed to schedule automatic submission." });
    }
};

const addquizparticipants = async (req, res) => {
    try {
        const teacherId = req.teacher.id;
        const { quizId, levelName, sectionNames, groupNames, studentEmails } = req.body;

        const [quiz] = await pool.query(
            `SELECT id, status FROM quizzes WHERE id = ? AND teacher_id = ?`,
            [quizId, teacherId]
        );
        if (quiz.length === 0) {
            return res.status(404).json({ message: "Quiz not found " });
        }
        if (!teacherId) {
            return res.status(403).json({ message: "teacher unothorized not found " });
        }

        if (quiz[0].status !== "Draft") {
            return res.status(400).json({ message: "Quiz is not in draft mode." });
        }

        let studentIds = new Set();

if (levelName && (!sectionNames || sectionNames.length === 0) && (!groupNames || groupNames.length === 0) && (!studentEmails || studentEmails.length === 0)) {
    // Only level
    const [students] = await pool.query(`
        SELECT s.id FROM students s
        JOIN student_group_csv sgc ON s.email = sgc.email
        JOIN student_groups g ON sgc.group_id = g.id
        JOIN sections sec ON g.section_id = sec.id
        JOIN levels l ON sec.level_id = l.id
        WHERE l.level_name = ?`,
        [levelName]
    );
    students.forEach(s => studentIds.add(s.id));
}
else if (levelName && sectionNames && sectionNames.length > 0 && (!groupNames || groupNames.length === 0)) {
   
    const placeholders = sectionNames.map(() => '?').join(',');
    const [students] = await pool.query(`
        SELECT s.id FROM students s
        JOIN student_group_csv sgc ON s.email = sgc.email
        JOIN student_groups g ON sgc.group_id = g.id
        JOIN sections sec ON g.section_id = sec.id
        JOIN levels l ON sec.level_id = l.id
        WHERE l.level_name = ? AND sec.section_name IN (${placeholders})`,
        [levelName, ...sectionNames]
    );
    students.forEach(s => studentIds.add(s.id));
}
else if (levelName && sectionNames && sectionNames.length > 0 && groupNames && groupNames.length > 0) {
   
    const sectionPlaceholders = sectionNames.map(() => '?').join(',');
    const groupPlaceholders = groupNames.map(() => '?').join(',');
    const [students] = await pool.query(`
        SELECT s.id FROM students s
        JOIN student_group_csv sgc ON s.email = sgc.email
        JOIN student_groups g ON sgc.group_id = g.id
        JOIN sections sec ON g.section_id = sec.id
        JOIN levels l ON sec.level_id = l.id
        WHERE l.level_name = ? 
        AND sec.section_name IN (${sectionPlaceholders})
        AND g.group_name IN (${groupPlaceholders})`,
        [levelName, ...sectionNames, ...groupNames]
    );
    students.forEach(s => studentIds.add(s.id));
}

if (studentEmails && studentEmails.length > 0) {
    const emailPlaceholders = studentEmails.map(() => '?').join(',');
    const [students] = await pool.query(
        `SELECT id FROM students WHERE email IN (${emailPlaceholders})`,
        [...studentEmails]
    );
    students.forEach(s => studentIds.add(s.id));
}

// No students found
if (studentIds.size === 0) {
    return res.status(400).json({ message: "No students found for the selected criteria." });
}


const values = [...studentIds].map(id => [quizId, id]);
await pool.query(`INSERT INTO QuizParticipants (quiz_id, student_id) VALUES ?`, [values]);

return res.status(200).json({ message: "Quiz started successfully.", studentIds: [...studentIds] });

        
    } catch (error) {
        console.error("Error in addquizparticipants:", error);
        return res.status(500).json({ message: "Failed to start quiz." });
    }
};
// import quiz
// CSV format question , correct(le numéro de la reponse correct ) , options kol wahda fi ligne 
// Configure multer for file upload
const importQuiz = async (req, res) => {
    if (!req.teacher || !req.teacher.id) {
        return res.status(403).json({ message: "Accès interdit." });
    }

    const teacherId = req.teacher.id;
    const { quiz_id } = req.body;
    console.log(req.body);
    if (!quiz_id || isNaN(quiz_id)) {
        return res.status(400).json({ error: "Le quiz_id est requis et doit être un nombre valide." });
    }

    if (!req.file) {
        return res.status(400).json({ error: "Aucun fichier téléversé." });
    }

    const questions = [];

    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (row) => {
            const { question, correct } = row;

            const options = Object.keys(row)
                .filter(key => key.startsWith('option'))  
                .map(key => row[key].trim());           

            if (!question || !correct) {
                console.warn("Ligne ignorée : 'question' ou 'correct' manquant.");
                return;
            }

          
            const correctIndex = parseInt(correct) - 1; 
            if (correctIndex < 0 || correctIndex >= options.length) {
                console.warn(`Ligne ignorée : L'index de la réponse correcte est invalide. Index : ${correct}`);
                return;
            }

            questions.push({
                question_text: question.trim(),
                options,
                correct: options[correctIndex],
            });
        })
        .on('end', async () => {
            if (questions.length === 0) {
                return res.status(400).json({ error: 'Le fichier CSV est vide ou invalide.' });
            }

            const connection = await pool.getConnection();
            try {
                await connection.beginTransaction();

                for (const q of questions) {
                   
                    const [questionResult] = await connection.query(
                        "INSERT INTO questions (quiz_id, question_text) VALUES (?, ?)",
                        [quiz_id, q.question_text]
                    );

                    const questionId = questionResult.insertId;

                    
                    const answers = q.options.map((option, index) => [
                        questionId, option, q.correct === option ? 1 : 0
                    ]);

                    if (answers.length > 0) {
                        await connection.query(
                            "INSERT INTO answers (question_id, answer_text, is_correct) VALUES ?",
                            [answers]
                        );
                    }
                }

                await connection.commit();
                fs.unlinkSync(req.file.path);  
                res.json({ message: 'Quiz importé avec succès.' });
            } catch (error) {
                await connection.rollback();
                console.error("Erreur lors de l'importation du quiz :", error);
                res.status(500).json({ error: "Une erreur s'est produite lors de l'importation du quiz." });
            } finally {
                connection.release();
            }
        })
        .on('error', (error) => {
            console.error("Erreur lors de la lecture du fichier CSV :", error);
            res.status(500).json({ error: "Une erreur s'est produite lors de la lecture du fichier CSV." });
        });
};

const getQuizDuration = async (req , res) => {
    try {
        const {quizId }= req.params ;
      const [duration] = await pool.execute(
        "SELECT duration FROM quizzes WHERE id = ? AND timed_by = ?",
        [quizId, 'question']
      );
      if (duration.length > 0) {
        res.status(200).json({ duration: duration[0].duration });
      } else {
        res.status(404).json({ message: "Quiz not found or not timed by question" });
      }
    
    }catch(error){
        return res.status(500).json({ message: "Server error", error: error.message });
    }
  };

const ALLQuizzesbymodule= async (req, res) => {
    try {
        const teacherId = req.teacher.id;
        const { module_name } = req.body;
    

        if (!module_name) {
            return res.status(400).json({ message: "Module name is required" });
        }
        const quizzes = await Quiz.getQuizzesByModule(teacherId, module_name);

        return res.status(200).json({ quizzes });
    } catch (error) {
        console.error("Error in getQuizzesByModule:", error);
        return res.status(500).json({ message: "Failed to fetch quizzes by module." });
    }
};
const Getlevel= async (req, res) => {
    try {
        const teacherId = req.teacher.id;
        const { module_id } = req.body;
        if (!module_id) {
            return res.status(400).json({ message: "Module name is required" });
        }
        const level = await Quiz.getlevelbymodule(module_id);

        return res.status(200).json({"level_id" :level });
    } catch (error) {
        console.error("Error in getlevelByModule:", error);
        return res.status(500).json({ message: "Failed to fetch quizzes by module." });
    }
};

const Draft_Quizzesbymodule = async (req, res) => {
    try {
        const teacherId = req.teacher.id; 
        const { module_name} = req.body; 
        

        if (!teacherId ) {
            return res.status(400).json({ message: "Missing teacherId or moduleId" });
        }
        const draft = await Quiz.getDraftQuizzesbymodule(teacherId, module_name);
        return res.status(200).json({ draft });
    } catch (error) {
        console.error("Error in getDraftQuizzes:", error);
        return res.status(500).json({ message: "Failed to fetch draft quizzes." });
    }
};


const Past_Quizzesbymodule = async (req, res) => {
    try {
        const teacherId = req.teacher.id; 
        const { module_name } = req.body; 
        const past = await Quiz.getPastQuizzesbymodule(teacherId, module_name);
        return res.status(200).json({ past });
    } catch (error) {
        console.error("Error in getPastQuizzes:", error);
        return res.status(500).json({ message: "Failed to fetch Past quizzes ." });
    }
};

const startQuizbyteach = async (req, res) => {
    try {
        const teacherId = req.teacher.id;
        const { quizId } = req.body;

        const [quiz] = await pool.query(
            `SELECT id, status FROM quizzes WHERE id = ? AND teacher_id = ?`,
            [quizId, teacherId]
        );
        if (quiz.length === 0) {
            return res.status(404).json({ message: "Quiz not found or unauthorized." });
        }
        if (quiz[0].status !== "Draft") {
            return res.status(400).json({ message: "Quiz is already active or ended." });
        }
        return res.status(200).json({
            message: "Quiz started successfully.",
        });

    } catch (error) {
        console.error("Error starting quiz:", error);
        return res.status(500).json({ message: "Failed to start quiz." });
    }
};
const SeeDraftQuiz = async (req ,res )=>{
    try {

        const {quiz_id} = req.body ;
        const quiz = await Quiz.findById(quiz_id);
        let questions = await Question.getQuizQuestions(quiz_id);
        let questionNanswers = await Promise.all(
            questions.map(async (question) => {
                let answers = await Answer.getAnswersByQuestionId(question.id);
                return { question, answers };
            })
        );
        return res.status(200).json({message:'successfully returned the draft quiz info',draft: {
            quiz, questionNanswers
        }});
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch the darfted quiz."});
    }
}; 

export default {
    createQuiz,
    deleteQuiz,
    Quizzes_Type ,
    ALLQuizzesbymodule,
    Draft_Quizzesbymodule,
    Past_Quizzesbymodule,
    ALLQuizzes2,
    Past_Quizzes ,
    Draft_Quizzes,
    update_title ,
    update_duration ,
    update_timedby ,
    addquizparticipants,
    randomazation ,
    autoSubmitQuiz,
    submitQuizManually,
    startQuizstudent , 
    importQuiz ,
    startQuizbyteach ,
    SeeDraftQuiz ,
    update_Module ,
    getQuizDuration ,
    Getlevel , 
    getModuleNameById,
    update_visibility
} ; 
