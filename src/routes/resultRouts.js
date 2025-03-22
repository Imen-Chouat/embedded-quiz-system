import express from 'express';
import resultControllers from '../controllers/resultController.js';

const router = express.Router();

// 📌 Route pour obtenir le nombre d'étudiants ayant participé à un quiz
router.get('/quizAttendance/:quiz_id', resultControllers.getQuizAttendance);

export default router;
