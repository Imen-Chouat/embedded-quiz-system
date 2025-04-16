


import pool from '../config/dbConfig.js';

class Result {
    
    static async getQuizAttendance(quiz_id) {
        try {
            const [rows] = await pool.query(
                `SELECT COUNT(*) AS attendance FROM Quiz_attempts WHERE quiz_id = ?`,
                [quiz_id]
            );
            return rows[0].attendance;
        } catch (error) {
            throw new Error('Erreur lors de la récupération de la participation au quiz.');
        }
    }

    static async getAverageQuizGrade(quiz_id) {
        try {
            const [rows] = await pool.query(
                `SELECT AVG(score) AS average_grade FROM Quiz_attempts WHERE quiz_id = ? AND status = 'completed'`,
                [quiz_id]
            );
            return rows[0].average_grade || 0;
        } catch (error) {
            throw new Error('Erreur lors du calcul de la moyenne des notes.');
        }
    }

   
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
                return 0; 
            }

            const successRate = (success / total) * 100;
            return successRate.toFixed(2); 
        } catch (error) {
            throw new Error('Erreur lors du calcul du pourcentage de réussite.');
        }
    }

    
    static async numberOfchoices(question_id) {
        try {
            const [rows] = await pool.execute(
                `SELECT COUNT(*) AS count FROM answers WHERE question_id = ?`,
                [question_id]
            );
            return rows[0].count;
        } catch (error) {
            throw new Error(`Erreur lors du comptage des choix pour la question: ${error.message}`);
        }
    }

    static async choicePercentage(question_id, answer_id) {
        try {
            const numberOfchoices = await this.numberOfchoices(question_id);
            if (numberOfchoices) {
                const [rows] = await pool.execute(
                    `SELECT COUNT(*) AS count FROM student_responses WHERE answer_id = ?`,
                    [answer_id]
                );
                const choiceRepetition = rows[0].count;
                const percentage = (choiceRepetition / numberOfchoices) * 100;
                return percentage;
            }
            return -1; 
        } catch (error) {
            throw new Error(`Erreur lors du calcul du pourcentage des choix: ${error.message}`);
        }
    }
}

export default Result;


};

