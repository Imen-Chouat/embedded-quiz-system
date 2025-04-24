


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
    async function calculateScore(studentId, quizId) {
    try {
        // Récupérer toutes les réponses de l'étudiant pour ce quiz
        const [studentResponses] = await pool.query(`
            SELECT sr.question_id, sr.answer_id, a.is_correct
            FROM student_responses sr
            JOIN answers a ON sr.answer_id = a.id
            WHERE sr.student_id = ? AND sr.quiz_id = ?
        `, [studentId, quizId]);

        if (studentResponses.length === 0) {
            return 0; // Si l'étudiant n'a pas encore répondu aux questions du quiz
        }

        // Calculer le score de l'étudiant
        let score = 0;
        studentResponses.forEach(response => {
            if (response.is_correct) {
                score += 1; // Ajout d'un point pour chaque bonne réponse
            }
        });

        return score; // Retourner le score final
    } catch (error) {
        console.error('Error calculating score:', error);
        return 0;
    }
}
    // Fonction pour obtenir le tableau des étudiants avec leur score dans un quiz donné
export const getQuizParticipantsTable = async (req, res) => {
    const { quizId } = req.params;

    try {
        // Récupérer tous les étudiants ayant participé à ce quiz
        const [participants] = await pool.query(`
            SELECT s.id, s.first_name, s.last_name, s.email
            FROM students s
            JOIN QuizParticipants qp ON qp.student_id = s.id
            WHERE qp.quiz_id = ?
        `, [quizId]);

        if (participants.length === 0) {
            return res.status(404).json({ message: 'Aucun étudiant n\'a participé à ce quiz.' });
        }

        // Calculer le score de chaque étudiant
        const results = [];

        for (const participant of participants) {
            const score = await calculateScore(participant.id, quizId);
            results.push({
                first_name: participant.first_name,
                last_name: participant.last_name,
                email: participant.email,
                score
            });
        }

        // Répondre avec la liste des participants et leurs scores
        return res.status(200).json({ participants: results });
    } catch (error) {
        console.error('Erreur lors de la récupération des participants et des scores:', error);
        return res.status(500).json({ message: 'Erreur interne du serveur' });
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

