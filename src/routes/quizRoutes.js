import express from 'express';
import quizController from '../controllers/quizController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();
router.post('/create', authMiddleware, quizController.createQuiz);
router.delete('/:id', authMiddleware, quizController.deleteQuiz);
router.patch('/:id/title', authMiddleware, quizController.update_title);
router.patch('/:id/module', authMiddleware, quizController.update_module);
router.patch('/:id/duration', authMiddleware, quizController.update_duration);
router.patch('/:id/status', authMiddleware, quizController.update_status);
router.patch('/:id/timedby', authMiddleware, quizController.update_timedby);
router.get('/:quizId/randomize', authMiddleware, quizController.randomazation);

export default router;
