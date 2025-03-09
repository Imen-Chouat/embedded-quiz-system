import mysql from 'mysql2';
import pool from '../config/dbConfig.js';

class Quiz {
static async create(teacher_id, module , title ,status , timed_by , duration_minutes) {
    
    try {
    
        const [result] = await pool.execute(
            `INSERT INTO quizzes (teacher_id,module,  title, status, timed_by, duration_minutes) VALUES (?, ?, ?, ?, ?, ?)`,
            [teacher_id,  module,title , status, timed_by, duration_minutes]
        );

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
            return quiz[0];
        } catch (error) {
            console.error("Error finding quiz:", error);
            return null;
        }
    }

    static async findByTeacherId(teacherId) {
        try {
            const [quizzes] = await pool.execute(`SELECT * FROM quizzes WHERE teacher_id = ?`, [teacherId]);
            return quizzes;
        } catch (error) {
            console.error("Error finding quizzes for teacher:", error);
            return [];
        }
    }
    

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
    static async update_Module( quizId ,module) {
        try {
            const [result] = await pool.execute(
                `UPDATE quizzes SET module = ? WHERE id = ?`,
                [module, quizId]
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
                `UPDATE quizzes SET duration_minutes = ? WHERE id = ?`,
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
    


}
export default Quiz ;
