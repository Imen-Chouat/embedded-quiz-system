import express from 'express';
import resultControllers from '../controllers/resultController.js';

const router = express.Router();

router.get('/quizAttendance/:quiz_id', resultControllers.getQuizAttendance);
router.get('/quizAverageGrade/:quiz_id', resultControllers.getAverageQuizGrade);

export default router;
