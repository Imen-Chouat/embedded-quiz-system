
import express from 'express';
import questionControllers from '../controllers/questionController.js';

const router = express.Router();

router.post('/create', questionControllers.createQuestion);
router.patch('/updateText', questionControllers.updateQuestionText);
router.patch('/updateDuration', questionControllers.updateQuestionDuration);
router.delete('/delete/:id', questionControllers.deleteQuestion);
router.get('/quiz/:quiz_id', questionControllers.getQuizQuestions);
router.get('/search', questionControllers.searchQuestions);
router.get('/:id', questionControllers.getQuestionById); 
router.get('/checkExpiration/:id', questionController.checkQuestionExpiration);


export default router;
