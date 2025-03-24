import jwt from 'jsonwebtoken';
import envConfig from '../config/envConfig.js';
import Quiz from '../modules/Quiz.js';
import pool from '../config/dbConfig.js';
/* import fs from 'fs';
import csv from 'csv-parser';
import { openai } from '../config/openaiConfig.js'; */

const createQuiz = async (req, res) => {
    try {
        const teacher_id = req.teacher.id; 
        const { title, module_id, status, timed_by, duration } = req.body; 
        const [module] = await pool.execute(
            `SELECT module_id 
             FROM teach_module
             WHERE teacher_id = ? AND module_id = ?`,
            [teacher_id, module_id] 
        );

        if (module.length === 0) {
            return res.status(403).json({ message: "Unauthorized. You can only create quizzes for modules you teach." });
        } 

        const quizId = await Quiz.create(teacher_id, module_id, title, status, timed_by, duration);
        const quiz = await Quiz.findById(quizId);

        return res.status(201).json({  quiz });
    } catch (error) {
        console.error("Error creating quiz:", error);
        return res.status(500).json({ message: "Failed to create quiz. Please try again later." });
    }
} 

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
const ALLQuizzes= async (req, res) => {
    try {
        const teacherId = req.teacher.id;
        const { module_id } = req.query;

        if (!module_id) {
            return res.status(400).json({ message: "Module ID is required." });
        }

        const quizzes = await Quiz.getQuizzesByModule(module_id, teacherId);

        return res.status(200).json({ quizzes });
    } catch (error) {
        console.error("Error in getQuizzesByModule:", error);
        return res.status(500).json({ message: "Failed to fetch quizzes by module." });
    }
};




const Draft_Quizzes = async (req, res) => {
    try {
        const teacherId = req.teacher.id; 
        const { module_id } = req.query; 
        console.log("Teacher ID:", teacherId);
        console.log("Module ID:", module_id);

        if (!teacherId || !module_id) {
            return res.status(400).json({ message: "Missing teacherId or moduleId" });
        }
        const quizzes = await Quiz.getDraftQuizzes(teacherId, module_id);
        return res.status(200).json({ quizzes });
    } catch (error) {
        console.error("Error in getDraftQuizzes:", error);
        return res.status(500).json({ message: "Failed to fetch draft quizzes." });
    }
};


const Past_Quizzes = async (req, res) => {
    try {
        const teacherId = req.teacher.id; 
        const { module_id } = req.query; 
        const quizzes = await Quiz.getPastQuizzes(teacherId, module_id);
        return res.status(200).json({ quizzes });
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
const update_status = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const teacherId = req.teacher.id; 

        const quiz = await Quiz.findById(id);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found." });
        }

        if (quiz.teacher_id !== teacherId) {
            return res.status(403).json({ message: "Unauthorized. You can only update your own quizzes." });
        }

        const isUpdated = await Quiz.update_status(id, status);
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
/*
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
};*/
// submission 
// ki student ydir start quiz manuellement
const startQuiz= async (req, res) => {
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
const startQuizTeach = async (req, res) => {
   
        try {
            const teacherId = req.teacher.id; 
            const { quizId, levelName, sectionNames, groupNames, studentEmails } = req.body;
    
            const [quiz] = await pool.query(`SELECT id, status FROM quizzes WHERE id = ? AND teacher_id = ?`, [quizId, teacherId]);
            if (quiz.length === 0) {
                return res.status(404).json({ message: "Quiz not found or you don't have permission." });
            }
            if (quiz[0].status !== "Draft") {
                return res.status(400).json({ message: "Quiz is not in draft mode." });
            }
    
            let studentIds = [];
    
         
            if (levelName && !sectionNames && !groupNames && !studentEmails) {
                const [students] = await pool.query(
                    `SELECT s.id FROM students s 
                     JOIN student_groups g ON s.group_id = g.id 
                     JOIN sections sec ON g.section_id = sec.id
                     JOIN levels l ON sec.level_id = l.id
                     WHERE l.level_name = ?`,
                    [levelName]
                );
                studentIds = students.map(s => s.id);
            }
    
          
            else if (levelName && sectionNames && !groupNames) {
                const [students] = await pool.query(
                    `SELECT s.id FROM students s 
                     JOIN student_groups g ON s.group_id = g.id 
                     JOIN sections sec ON g.section_id = sec.id
                     JOIN levels l ON sec.level_id = l.id
                     WHERE l.level_name = ? AND sec.section_name IN (?)`,
                    [levelName, sectionNames]
                );
                studentIds = students.map(s => s.id);
            }
    
           
            else if (levelName && sectionNames && groupNames && studentEmails.length == 0) {
                const [students] = await pool.query(
                    `SELECT s.id FROM students s 
                    
                     JOIN student_groups g ON s.group_id = g.id 
                     JOIN sections sec ON g.section_id = sec.id
                     JOIN levels l ON sec.level_id = l.id
                     WHERE l.level_name = ? AND sec.section_name IN (?) AND g.group_name IN (?)`,
                    [levelName, sectionNames, groupNames]
                );
                studentIds = students.map(s => s.id);
            }
    

            if (studentEmails && studentEmails.length > 0) {
                const [students] = await pool.query(
                    `SELECT id FROM students WHERE email IN (?)`, [studentEmails]
                );
                studentIds.push(...students.map(s => s.id));
            }
    
            if (studentIds.length === 0) {
                return res.status(400).json({ message: "No students found for the selected criteria." });
            }
    
      
            const values = studentIds.map(id => [quizId, id]);
            await pool.query(`INSERT INTO QuizParticipants (quiz_id, student_id) VALUES ?`, [values]);

            await pool.query(`UPDATE quizzes SET status = 'Past' WHERE id = ?`, [quizId]);
    
            return res.status(200).json({ message: "Quiz started successfully.", studentIds });
    
        } catch (error) {
            console.error("Error in startQuiz:", error);
            return res.status(500).json({ message: "Failed to start quiz." });
        }
    };
    
    

/*


// import quiz
// CSV format question , correct(le numéro de la reponse correct ) , options kol wahda fi ligne 
const importQuiz = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Aucun fichier téléversé.' });
    }

    const { quiz_id } = req.body;
    if (!quiz_id) {
        return res.status(400).json({ error: 'Le quiz_id est requis.' });
    }

    const questions = [];

    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (row) => {
            const { question, correct, ...options } = row;
            if (!question || !correct) {
                console.warn("Ligne ignorée : 'question' ou 'correct' manquant.");
                return;
            }
            const validOptions = Object.values(options)
                .filter(value => value.trim() !== "")
                .map(value => value.trim());

            questions.push({
                question_text: question.trim(),
                options: validOptions,
                correct: correct.trim(),
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
                    for (const [index, option] of q.options.entries()) {
                        await connection.query(
                            "INSERT INTO answers (question_id, answer_text, is_correct) VALUES (?, ?, ?)",
                            [questionId, option, q.correct === String(index + 1) ? 1 : 0]
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


const createQuizWithAI = async (req, res) => {
    const { teacher_id, module_id, title, level, num_questions } = req.body;

    if (!teacher_id || !module_id || !title || !level || !num_questions) {
        return res.status(400).json({ error: 'Tous les champs sont obligatoires.' });
    }

    if (isNaN(num_questions) || num_questions < 1 || num_questions > 50) {
        return res.status(400).json({ error: 'Le nombre de questions doit être un nombre entre 1 et 50.' });
    }

    try {
       
        const prompt = `Génère ${num_questions} questions à choix multiples sur le sujet : ${title}. Niveau : ${level}.
        Format :
        1. Question: ...
           Options: [A) ..., B) ..., C) ..., D) ...]
           Correct Answer: A, B, C, ou D.`;

        const response = await openai.createCompletion({
            model: 'gpt-4',
            prompt,
            max_tokens: 500,
            temperature: 0.7,
        });

        if (!response.data.choices || !response.data.choices[0].text) {
            throw new Error("Réponse invalide de l'API OpenAI.");
        }

        const generatedText = response.data.choices[0].text.trim();
        const questions = Quiz.parseGeneratedQuestions(generatedText);

        if (questions.length === 0) {
            throw new Error("Aucune question valide n'a été générée.");
        }

        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            
            const [quizResult] = await connection.query(
                "INSERT INTO quizzes (teacher_id, module_id, title, status, timed_by, duration) VALUES (?, ?, ?, 'Draft', 'quiz', 30)",
                [teacher_id, module_id, title]
            );
            const quizId = quizResult.insertId;
            for (const q of questions) {
                const [questionResult] = await connection.query(
                    "INSERT INTO questions (quiz_id, question_text) VALUES (?, ?)",
                    [quizId, q.question]
                );
                const questionId = questionResult.insertId;

                for (const [index, option] of q.options.entries()) {
                    await connection.query(
                        "INSERT INTO answers (question_id, answer_text, is_correct) VALUES (?, ?, ?)",
                        [questionId, option, q.correct === index ? 1 : 0]
                    );
                }
            }
            await connection.commit();
            res.json({ message: 'Quiz créé avec succès.', quiz_id: quizId });

        } catch (error) {
        
            await connection.rollback();
            console.error("Erreur lors de l'insertion dans la base de données :", error);
            res.status(500).json({ error: "Erreur lors de la création du quiz." });

        } finally {
           
            connection.release();
        }

    } catch (error) {
        console.error("Erreur lors de la génération du quiz :", error);
        res.status(500).json({ error: "Erreur lors de la génération du quiz." });
    }
}; */

export default {
    createQuiz,
    deleteQuiz,
    Quizzes_Type ,
    ALLQuizzes,
    Past_Quizzes ,
    Draft_Quizzes,
    update_title ,
    update_duration ,
    update_status ,
    update_timedby ,
    startQuizTeach ,
    /*
    randomazation ,
    */
    autoSubmitQuiz,
    submitQuizManually,
    startQuiz , 
    /*
    importQuiz ,
    createQuizWithAI ,*/


} ; 
