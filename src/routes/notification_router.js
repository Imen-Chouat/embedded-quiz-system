import express from 'express';
import notificationController from '../controllers/notificationController.js';

const router = express.Router();

router.post('/notify-new-quiz', notificationController.notifyNewQuiz);
router.get('/check-new-quiz', notificationController.checkNewQuiz);

export default router;
