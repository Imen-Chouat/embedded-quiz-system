import mysql from 'mysql2';
import pool from '../config/dbConfig.js';

static async getQuizAttendance(quiz_id) {
    try {
        const [rows] = await pool.execute(
            `SELECT COUNT(DISTINCT user_id) AS attendance_count 
             FROM answers 
             WHERE question_id IN (SELECT id FROM questions WHERE quiz_id = ?)`,
            [quiz_id]
        );
        return { quiz_id, attendance_count: rows[0].attendance_count };
    } catch (error) {
        throw new Error(`Error while retrieving quiz attendance: ${error.message}`);
    }
}
export default Result;
