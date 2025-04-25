import Result from '../modules/Result.js';
import Answer from '../modules/Answer.js';
 const getQuizAttendance = async (req, res) => {
    try {
        const { quiz_id } = req.params;
        const attendance = await Result.getQuizAttendance(quiz_id);
        res.json({ quiz_id, attendance });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const getStudentModules = async (req, res) => {
    const { studentId } = req.params;
    try {
        const modules = await Student.getStudentModules(studentId);
        res.status(200).json({ studentId, modules });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getStudentUpcomingQuizzes = async (req, res) => {
    try {
        const quizzes = await Student.getUpcomingQuizzes(req.params.studentId);
        res.json({ upcoming_quizzes: quizzes });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



export const getStudentMissedQuizzes = async (req, res) => {
    try {
        const quizzes = await Student.getMissedQuizzes(req.params.studentId);
        res.json({ missed_quizzes: quizzes });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



export const getCompletedQuizzesByStudent = async (req, res) => {
    const studentId = req.params.studentId;

    try {
        const quizzes = await Student.getCompletedQuizzes(studentId);
        res.json({ quizzes });
    } catch (error) {
        console.error("Controller error:", error.message);
        res.status(500).json({ error: "Failed to retrieve quizzes" });
    }
};

const getScore = async (req, res) => {
    const { studentId, quizId } = req.params;

    try {
        // Calculer le score de l'étudiant pour ce quiz
        const score = await calculateScore(studentId, quizId);

        if (score === 0) {
            return res.status(404).json({ message: 'Aucune réponse trouvée pour cet étudiant dans ce quiz.' });
        }

        // Répondre avec le score
        return res.status(200).json({ score });
    } catch (error) {
        console.error('Erreur lors du calcul du score:', error);
        return res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};
const getQuizParticipantsTable = async (req, res) => {
    const { quizId } = req.params;

    try {
        // Récupérer tous les étudiants ayant participé à ce quiz
        const participants = await Result.getQuizParticipants(quizId); // Utiliser le modèle approprié pour récupérer les participants

        if (participants.length === 0) {
            return res.status(404).json({ message: 'Aucun étudiant n\'a participé à ce quiz.' });
        }

        // Calculer le score de chaque participant
        const results = [];
        for (const participant of participants) {
            const score = await calculateScore(participant.id, quizId);
            results.push({
                first_name: participant.first_name,
                last_name: participant.last_name,
 
                score
            });
        }

        // Répondre avec la liste des participants et leurs scores
        return res.status(200).json({ participants: results });
    } catch (error) {
        console.error('Erreur lors de la récupération des participants et des scores:', error);
        return res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};
 const getAverageQuizGrade = async (req, res) => {
    try {
        const { quiz_id } = req.params;
        const averageGrade = await Result.getAverageQuizGrade(quiz_id);
        res.json({ quiz_id, average_grade: averageGrade });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
 const getQuizSuccessRate = async (req, res) => {
    try {
        const { quiz_id } = req.params;
        const successRate = await Result.getQuizSuccessRate(quiz_id);
        res.json({ quiz_id, success_rate: `${successRate}%` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
 const questionChoicePercentage = async (req ,res) => {
    try {
        const {question_id} = req.body ;
        let answers = await Answer.getAnswersByQuestionId(question_id);
        let result = [];
        for (let answer of answers) {
            let percentage = await Result.choicePercentage(question_id, answer.id);
            result.push({ answer_id: answer.id , answer_text: answer.answer_text, percentage });
        }
        res.status(200).json({message:"successful fetching of the question percentage", question_id, answersPercentages: result });
    } catch (error) {
        res.status(500).json({ message:'error finding the choices percentage'});
    }
}

export default {
    getQuizAttendance,
    getAverageQuizGrade,
    getQuizSuccessRate,
    questionChoicePercentage ,
    getScore,
    getQuizParticipantsTable,
    getStudentModules,
    getCompletedQuizzesByStudent,
    getStudentUpcomingQuizzes,
    getStudentMissedQuizzes
    
};
  
