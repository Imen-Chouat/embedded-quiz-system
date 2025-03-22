import Result from '../modules/Result.js';

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

export default {
    getQuizAttendance,
    getAverageQuizGrade
};
  
