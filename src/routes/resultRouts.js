import express from 'express';
import resultControllers from '../controllers/resultController.js';

const router = express.Router();

router.get('/quizAttendance/:quiz_id', resultControllers.getQuizAttendance);
router.get('/quizAverageGrade/:quiz_id', resultControllers.getAverageQuizGrade);
router.get('/quizSuccessRate/:quiz_id', resultControllers.getQuizSuccessRate);
router.get('/quiz/:quizId/student/:studentId/score', resultControllers.getScore);
router.get('/quiz/:quizId/participants', resultControllers.getQuizParticipantsTable);
router.get('/quiz/:quizId/participants', resultControllers.getQuizParticipantsTable);
router.get('/students/:studentId/quizzesCompleted', resultControllers.getCompletedQuizzesByStudent);
router.get('/:studentId/modules', resultControllers.getStudentModules);


export default router;
