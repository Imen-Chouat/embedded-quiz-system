   import mysql from 'mysql2';
import pool from '../config/dbConfig.js';

class Quiz {
static async create(teacher_id , module_id , title , timed_by , duration ) {
    
    try {
    
        const [result] = await pool.execute(
            `INSERT INTO quizzes (teacher_id , module_id , title , timed_by, duration) VALUES (?, ?, ?, ?, ?)`,
            [teacher_id,  module_id ,title , timed_by, duration]
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
    // all the quizzes created by a teacher on all modules 
    static async getAllQuizzesByTeacher(teacherId) {
        try {
            const [quizzes] = await pool.execute(
                `SELECT q.title, q.created_at, m.moduleName 
                 FROM quizzes q
                 JOIN modules m ON q.module_id = m.id
                 WHERE q.teacher_id = ?`,
                [teacherId] 
            );
            return quizzes;
        } catch (error) {
            console.error("Error fetching quizzes by teacher:", error);
            throw error;
        }
    }
    
    static async getDraftQuizzes(teacherId) {
        try {
            const [quizzes] = await pool.execute(
            `SELECT q.title, q.created_at, m.moduleName 
             FROM quizzes q
             JOIN modules m ON q.module_id = m.id
             WHERE q.teacher_id = ? AND q.status = 'Draft'`,
                 
                [teacherId]
            );
            return quizzes;
        } catch (error) {
            console.error("Error fetching draft quizzes :", error);
            throw error; 
        }
    }
    static async getPastQuizzes(teacherId) {
        try {
            const [quizzes] = await pool.execute(
            `SELECT q.title, q.created_at, m.moduleName 
             FROM quizzes q
             JOIN modules m ON q.module_id = m.id
             WHERE q.teacher_id = ? AND q.status = 'Past'`,
                 
                [ teacherId]
            );
            return quizzes;
        } catch (error) {
            console.error("Error fetching  Past quizzes:", error);
            throw error; 
        }
    }
    // te3 submission 
    static async startQuizAttempt(studentId, quizId) {
        const [quizData] = await pool.execute(
            `SELECT created_at, duration FROM quizzes WHERE id = ?`,
            [quizId]
        );
    
        if (quizData.length === 0) {
            throw new Error("Quiz not found.");
        }
    
        const { created_at, duration } = quizData[0];
        const [hours, minutes, seconds] = duration.split(":").map(Number);
        const durationMs = ((hours * 3600) + (minutes * 60) + seconds) * 1000;
        const endTime = new Date(new Date(created_at).getTime() + durationMs);
        const now = new Date();
    
        if (now > endTime) {
            throw new Error("Quiz time is over.");
        }

        const [existing] = await pool.execute(
            `SELECT id FROM quiz_attempts WHERE student_id = ? AND quiz_id = ?`,
            [studentId, quizId]
        );
    
        if (existing.length > 0) {
            return existing[0].id; 
        }
        const [result] = await pool.execute(
            `INSERT INTO quiz_attempts (student_id, quiz_id, start_time, status)
             VALUES (?, ?, NOW(), 'in_progress')`,
            [studentId, quizId]
        );
    
        return result.insertId;
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
                `SELECT q.created_at, q.duration, qa.status
                 FROM quiz_attempts qa
                 JOIN quizzes q ON qa.quiz_id = q.id
                 WHERE qa.student_id = ? AND qa.quiz_id = ?`,
                [studentId, quizId]
            );
    
            if (attempt.length === 0) {
                throw new Error("No active quiz attempt found.");
            }
    
            const { created_at, duration, status } = attempt[0];
            if (status === "submitted") {
                console.log(`Quiz ${quizId} was already submitted manually.`);
                return "already_submitted";
            }

            const [hours, minutes, seconds] = duration.split(":").map(Number);
            const durationMs = ((hours * 3600) + (minutes * 60) + seconds) * 1000;

            const endTime = new Date(new Date(created_at.getTime() + durationMs));
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
    static async calculateTotalDuration(quizId) {
        try {
            const [questions] = await pool.execute(
                `SELECT duration_minutes FROM questions WHERE quiz_id = ?`,
                [quizId]
            );
    
            const totalDuration = questions.reduce(
                (total, question) => total + question.duration_minutes,
                0
            );
    
            return totalDuration;
        } catch (error) {
            console.error("Error calculating total duration:", error);
            throw error;
        }
    }
    
    static async updateQuizDuration(quizId, totalDuration) {
        try {
            
            await pool.execute(
                `UPDATE quizzes SET duration = ? WHERE id = ?`,
                [totalDuration, quizId]
            );
        } catch (error) {
            console.error("Error updating quiz duration:", error);
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
    // get all quizzes by a teacher for one module 
    static async getDraftQuizzesbymodule(teacherId, module_name) {
        try {
            const [quizzes] = await pool.execute(
                `SELECT q.title,q.created_at , m.moduleName 
                 FROM quizzes q
                 JOIN modules m ON q.module_id = m.id
                 WHERE m.moduleName = ? AND q.teacher_id = ? AND q.status = 'Draft'` ,
                [module_name, teacherId]
            );
    
            return quizzes;
        } catch (error) {
            console.error("Error fetching draft quizzes :", error);
            throw error; 
        }
    }
    static async getQuizzesByModule(teacherId, module_name) {
        try {
            const [quizzes] = await pool.execute(
                `SELECT q.title, q.created_at ,m.moduleName 
                 FROM quizzes q
                 JOIN modules m ON q.module_id = m.id
                 WHERE m.moduleName = ? AND q.teacher_id = ?`,
                [module_name, teacherId]
            );
    
            return quizzes;
        } catch (error) {
            console.error("Error fetching quizzes by module name and teacher:", error);
            throw error;
        }
    }
    static async getPastQuizzesbymodule(teacherId, module_name) {
        try {
        
            const [quizzes] = await pool.execute(
                `SELECT q.title,q.created_at , m.moduleName 
                 FROM quizzes q
                 JOIN modules m ON q.module_id = m.id
                 WHERE m.moduleName = ? AND q.teacher_id = ? AND q.status = 'Past'` ,
                [module_name, teacherId]
            );
    
            return quizzes;
        } catch (error) {
            console.error("Error fetching  Past quizzes:", error);
            throw error; 
        }
    }
    
    
    


}
export default Quiz ;
