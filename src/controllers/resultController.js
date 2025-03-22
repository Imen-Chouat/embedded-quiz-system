import Result from '../modules/Result.js';

export const getQuizAttendance = async (req, res) => {
    try {
        const { quiz_id } = req.params;
        const attendance = await Result.getQuizAttendance(quiz_id); // Utilisation correcte
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export default {
    getQuizAttendance
};
  
