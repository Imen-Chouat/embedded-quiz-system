import express from 'express';
import questionControllers from '../controllers/questionController.js';

const router = express.Router();

router.post('/create', questionControllers.createQuestion);
router.patch('/updateText/:id', questionControllers.updateQuestionText);
router.patch('/updateDuration/:id', questionControllers.updateQuestionDuration);
router.patch('/updateGrade/:id', questionControllers.updateQuestionGrade);
router.delete('/delete/:id', questionControllers.deleteQuestion);
router.get('/quiz/:quiz_id', questionControllers.getQuizQuestions);
router.get('/:id', questionControllers.getQuestionById);

export default router;
