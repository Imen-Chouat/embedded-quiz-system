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
static async getQuizSuccessRate(quiz_id) {
    try {
        const [totalRows] = await pool.query(
            `SELECT COUNT(*) AS total FROM Quiz_attempts WHERE quiz_id = ? AND status = 'completed'`,
            [quiz_id]
        );

        const [successRows] = await pool.query(
            `SELECT COUNT(*) AS success FROM Quiz_attempts WHERE quiz_id = ? AND status = 'completed' AND score >= 10`,
            [quiz_id]
        );

        const total = totalRows[0].total;
        const success = successRows[0].success;

        if (total === 0) {
            return 0; // Aucun participant, donc 0% de réussite
        }

        const successRate = (success / total) * 100;
        return successRate.toFixed(2); // Retourne un pourcentage avec 2 décimales
    } catch (error) {
        throw new Error('Erreur lors du calcul du pourcentage de réussite.');
    }
}

    static async numberOfchoices(question_id){
        try {
            const [rows] = await pool.execute(`SELECT COUNT(*)AS count FROM answers WHERE question_id = ?`,[question_id]);
            return rows[0].count ;
        } catch (error) {
            throw new Error(`Error counting the number of choices for the question: ${error.message}`);
        }
    }
const choicePercentage = async (question_id,answer_id) {
        try {
            const numberOfchoices =await this.numberOfchoices(question_id);
            if(numberOfchoices){
                const [rows] = await pool.execute(`SELECT COUNT(*) AS count FROM student_responses WHERE answer_id = ?`,[answer_id]);
                const choiceRepetition = rows[0].count ;
                const percentage = (choiceRepetition / numberOfchoices ) * 100 ;
                return percentage ;
            }
            return -1 ;
        } catch (error) {
            throw new Error(`Error calculating choice percentage: ${error.message}`);
        }
    }

export default {
    getQuizAttendance,
    getAverageQuizGrade,
    getQuizSuccessRate,
    choicePercentage
};

