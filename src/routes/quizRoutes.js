import express from 'express';
import quizController from '../controllers/quizController.js';
import authenticateStudent, { authTeacherMiddleware } from '../middlewares/authMiddleware.js';


const router = express.Router();




router.delete('/:id', authTeacherMiddleware, quizController.deleteQuiz);
router.patch('/:id/title', authTeacherMiddleware, quizController.update_title);
router.patch('/:id/duration', authTeacherMiddleware, quizController.update_duration);
router.patch('/:id/status', authTeacherMiddleware, quizController.update_status);
router.patch('/:id/timedby', authTeacherMiddleware, quizController.update_timedby);
router.get('/Allmodule', authTeacherMiddleware, quizController.ALLQuizzes);
router.get('/draftmodule', authTeacherMiddleware, quizController.Draft_Quizzes);
router.get('/Pastmodule', authTeacherMiddleware, quizController.Past_Quizzes);
router.post("/start",authenticateStudent , quizController.startQuiz);
router.post("/submit", authenticateStudent, quizController.submitQuizManually);
router.post("/auto-submit", authenticateStudent, quizController.autoSubmitQuiz);
router.post("/start-quiz", authTeacherMiddleware, quizController.startQuizTeach);


export default router;
