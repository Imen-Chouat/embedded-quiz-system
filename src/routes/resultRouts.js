import express from 'express';
import resultControllers from '../controllers/resultController.js';

const router = express.Router();

router.get('/quizAttendance/:quiz_id', resultControllers.getQuizAttendance);
router.get('/quizAverageGrade/:quiz_id', resultControllers.getAverageQuizGrade);
router.get('/quizSuccessRate/:quiz_id', resultControllers.getQuizSuccessRate);


export default router;
