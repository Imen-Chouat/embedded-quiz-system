import pool from '../config/database.js';


export const getQuizAttendance = async (req, res) => {
    try {
        const { quiz_id } = req.params;
        const [rows] = await pool.query(
            `SELECT COUNT(*) AS attendance FROM Quiz_attempts WHERE quiz_id = ?`,
            [quiz_id]
        );
        res.json({ quiz_id, attendance: rows[0].attendance });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const getAverageQuizGrade = async (req, res) => {
    try {
        const { quiz_id } = req.params;
        const [rows] = await pool.query(
            `SELECT AVG(score) AS average_grade FROM Quiz_attempts WHERE quiz_id = ? AND status = 'completed'`,
            [quiz_id]
        );
        res.json({ quiz_id, average_grade: rows[0].average_grade || 0 });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export default {
    getQuizAttendance,
    getAverageQuizGrade
};

