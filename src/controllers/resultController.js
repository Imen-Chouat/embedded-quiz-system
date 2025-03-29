import Result from '../modules/Result.js';
import Answer from '../modules/Answer.js';
export const getQuizAttendance = async (req, res) => {
    try {
        const { quiz_id } = req.params;
        const attendance = await Result.getQuizAttendance(quiz_id);
        res.json({ quiz_id, attendance });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAverageQuizGrade = async (req, res) => {
    try {
        const { quiz_id } = req.params;
        const averageGrade = await Result.getAverageQuizGrade(quiz_id);
        res.json({ quiz_id, average_grade: averageGrade });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
xport const getQuizSuccessRate = async (req, res) => {
    try {
        const { quiz_id } = req.params;
        const successRate = await Result.getQuizSuccessRate(quiz_id);
        res.json({ quiz_id, success_rate: `${successRate}%` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const questionChoicePercentage = async (req ,res) => {
    try {
        const {question_id} = req.body ;
        let answers = await Answer.getAnswersByQuestionId(question_id);
        let result = [];
        for (let answer of answers) {
            let percentage = await Result.choicePercentage(question_id, answer.id);
            result.push({ answer_id: answer.id , answer_text: answer.answer_text, percentage });
        }
        res.status(200).json({ question_id, answersPercentages: result });
    } catch (error) {
        res.status(500).json({ message:'error finding the choices percentage'});
    }
}

export default {
    getQuizAttendance,
    getAverageQuizGrade,
    getQuizSuccessRate,
    questionChoicePercentage 
};
  
