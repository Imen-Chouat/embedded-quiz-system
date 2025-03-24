
import mysql from 'mysql2';
import pool from '../config/dbConfig.js';

class Quiz {
static async create(teacher_id , module_id , title ,status , timed_by , duration ) {
    
    try {
    
        const [result] = await pool.execute(
            `INSERT INTO quizzes (teacher_id , module_id ,  title, status, timed_by, duration) VALUES (?, ?, ?, ?, ?, ?)`,
            [teacher_id,  module_id ,title , status, timed_by, duration]
        );
        console.log('Insert result:', result);
        return result.insertId;
    } catch (error) {
        console.error(`Error creating quiz: ${error.message}`);
        throw new Error("Failed to create quiz. Please try again later.");
    }
}


    static async delete(quizId) {
        try {
            const [result] = await pool.execute(`DELETE FROM quizzes WHERE id = ?`, [quizId]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error("Error deleting quiz:", error);
            return false;
        }
    }

    

    static async findById(quizId) {
        try {
            const [quiz] = await pool.execute(`SELECT * FROM quizzes WHERE id = ?`, [quizId]);
           
            if (quiz.length === 0) {
                throw new Error(`Quiz with ID ${id} not found`);
            } 
            return quiz[0];  
        }
         catch (error) {
            console.error("Error finding quiz:", error);
            return null;
        }
    }
// kamel les quiz les creeahom teacher 
    static async findByTeacherId(teacherId) {
        try {
            const [quizzes] = await pool.execute(`SELECT * FROM quizzes WHERE teacher_id = ?`, [teacherId]);
            return quizzes;
        } catch (error) {
            console.error("Error finding quizzes for teacher:", error);
            return [];
        }
    }
    
// hadou te3 update 
    static async update_Title( quizId ,title) {
        try {
            const [result] = await pool.execute(
                `UPDATE quizzes SET title = ? WHERE id = ?`,
                [title, quizId]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error("Error updating quiz:", error);
            return false;
        }
    }
    
    static async update_status( quizId ,status) {
        try {
            const [result] = await pool.execute(
                `UPDATE quizzes SET status = ? WHERE id = ?`,
                [status, quizId]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error("Error updating quiz:", error);
            return false;
        }
    }
    static async update_duration( quizId ,time) {
        try {
            const [result] = await pool.execute(
                `UPDATE quizzes SET duration = ? WHERE id = ?`,
                [time, quizId]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error("Error updating quiz:", error);
            return false;
        }
    }
    static async update_timedby( quizId ,etat) {
        try {
            const [result] = await pool.execute(
                `UPDATE quizzes SET timed_by = ? WHERE id = ?`,
                [etat , quizId]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error("Error updating quiz:", error);
            return false;
        }
    }
    static async getRandomizedQuestions(quizId) {
        try {
            const [questions] = await pool.execute(
                `SELECT * FROM questions WHERE quiz_id = ?`,
                [quizId]
            );
    
            if (questions.length === 0) {
                return [];
            }
            const shuffledQuestions = questions.slice().sort(() => Math.random() - 0.5);
            return shuffledQuestions;
        } catch (error) {
            console.error("Error fetching randomized questions:", error);
            return [];
        }
    }
    // get quiz by module for a teacher 
    
    static async getQuizzesByModule(moduleId, teacherId) {
        try {
            const [quizzes] = await pool.execute(
                `SELECT q.title,  m.moduleName 
                 FROM quizzes q
                JOIN modules m ON q.module_id = m.id
                WHERE q.module_id = ? AND q.teacher_id = ?`,
                [moduleId, teacherId]
            );
    
            return quizzes;
        } catch (error) {
            console.error("Error fetching quizzes by module and teacher:", error);
            throw error; 
        }
    }
    
    static async  getQuizzesByType(teacherId, timedBy) {
        try {
        
            const [quizzes] = await pool.execute(
                `SELECT * FROM quizzes 
                 WHERE teacher_id = ? AND timed_by = ?`,
                [teacherId, timedBy]
            );
            return quizzes;
        } catch (error) {
            console.error("Error fetching quizzes by timed_by:", error);
            throw error; 
        }
    }
    static async getDraftQuizzes(teacherId, module_id) {
        try {
            const [quizzes] = await pool.execute(
                `SELECT q.title,  m.moduleName 
                 FROM quizzes q
                JOIN modules m ON q.module_id = m.id
                WHERE q.module_id = ? AND q.teacher_id = ? AND q.status = 'Draft'`,
                 
                [module_id ,teacherId]
            );
            return quizzes;
        } catch (error) {
            console.error("Error fetching draft quizzes :", error);
            throw error; 
        }
    }
    static async getPastQuizzes(teacherId, module_id) {
        try {
            const [quizzes] = await pool.execute(
                `SELECT q.title,  m.moduleName 
                 FROM quizzes q
                JOIN modules m ON q.module_id = m.id
                WHERE q.module_id = ? AND q.teacher_id = ? AND q.status = 'Past'`,
                [module_id , teacherId]
            );
            return quizzes;
        } catch (error) {
            console.error("Error fetching  Past quizzes:", error);
            throw error; 
        }
    }
    // te3 submission 
    static async startQuizAttempt(studentId, quizId) {
        try {
            const [result] = await pool.execute(
                `INSERT INTO quiz_attempts (student_id, quiz_id, start_time, status)
                 VALUES (?, ?, NOW(), 'inprogress')`,
                [studentId, quizId]
            );
            return result.insertId;
        } catch (error) {
            console.error("Error starting quiz attempt:", error);
            throw error;
        }
    }
    
    static async submitQuizManually(studentId, quizId, responses) {
        try {
            await pool.query("START TRANSACTION");
    
            for (const response of responses) {
                const { questionId, answerId, isCorrect } = response;
                await pool.execute(
                    `INSERT INTO student_responses (student_id, quiz_id, question_id, answer_id, is_correct )
                     VALUES (?, ?, ?, ?, ? )`,
                    [studentId, quizId, questionId, answerId, isCorrect]
                );
            }
    
            const [scoreResult] = await pool.execute(
                `SELECT COUNT(*) AS score
                 FROM student_responses
                 WHERE student_id = ? AND quiz_id = ? AND is_correct = 1`,
                [studentId, quizId]
            );
            const score = scoreResult[0].score;
    
            await pool.execute(
                `UPDATE quiz_attempts
                 SET end_time = NOW(), status = 'submitted', score = ?
                 WHERE student_id = ? AND quiz_id = ?`,
                [score, studentId, quizId]
            );
    
            await pool.query("COMMIT");
    
            return { message: "Quiz submitted successfully.", score };
        } catch (error) {
            await pool.query("ROLLBACK");
            console.error("Error submitting quiz manually:", error);
            throw error;
        }
    }
    
    static async autoSubmitQuiz(studentId, quizId) {
        try {
            const [attempt] = await pool.execute(
                `SELECT qa.start_time, q.duration, qa.status
                 FROM quiz_attempts qa
                 JOIN quizzes q ON qa.quiz_id = q.id
                 WHERE qa.student_id = ? AND qa.quiz_id = ?`,
                [studentId, quizId]
            );
    
            if (attempt.length === 0) {
                throw new Error("No active quiz attempt found.");
            }
    
            const { start_time, duration, status } = attempt[0];
    
            if (status === "submitted") {
                console.log(`Quiz ${quizId} was already submitted manually.`);
                return "already_submitted";
            }
    
            const endTime = new Date(start_time.getTime() + duration * 60000);
            const currentTime = new Date();
    
          
            if (currentTime >= endTime) {
                await this.finalizeQuizSubmission(studentId, quizId);
                console.log(`Quiz ${quizId} automatically submitted for student ${studentId}.`);
                return "submitted_now";
            }
    
           
            setTimeout(async () => {
                await this.finalizeQuizSubmission(studentId, quizId);
                console.log(`Quiz ${quizId} automatically submitted for student ${studentId}.`);
            }, endTime - currentTime);
    
            return "scheduled";
        } catch (error) {
            console.error("Error scheduling auto-submission:", error);
            throw error;
        }
    }
    
    
    static async finalizeQuizSubmission(studentId, quizId) {
        const [responses] = await pool.execute(
            `SELECT question_id, answer_id, is_correct
             FROM student_responses
             WHERE student_id = ? AND quiz_id = ?`,
            [studentId, quizId]
        );
    
        const score = responses.filter((r) => r.is_correct).length;
    
        await pool.execute(
            `UPDATE quiz_attempts
             SET end_time = NOW(), status = 'submitted', score = ?
             WHERE student_id = ? AND quiz_id = ?`,
            [score, studentId, quizId]
        );
    }
    /*
    static async parseGeneratedQuestions(text) {
        const questions = [];
        const regex = /(\d+)\.\sQuestion:\s(.+?)\nOptions:\s\[A\)\s(.+?),\sB\)\s(.+?),\sC\)\s(.+?),\sD\)\s(.+?)\]\nCorrect Answer:\s([A-D])/g;
        
        let match;
        while ((match = regex.exec(text)) !== null) {
            const question = match[2];
            const options = [match[3], match[4], match[5], match[6]];
            const correct = ['A', 'B', 'C', 'D'].indexOf(match[7]);
    
            if (question && options.length === 4 && correct !== -1) {
                questions.push({ question, options, correct });
            } else {
                console.warn("Question invalide ignorée :", match[0]);
            }
        }
    
        return questions;
    }
    
    

*/
}
export default Quiz ;
