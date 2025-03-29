import express from 'express';
import quizController from '../controllers/quizController.js';
import authenticateStudent, { authTeacherMiddleware } from '../middlewares/authMiddleware.js';
import multer from 'multer';
import fs from 'fs';




const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage }); 


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
router.post("/importQuiz",authTeacherMiddleware , upload.single('file'), quizController.importQuiz);
router.get("/randomize/:quizId", quizController.randomazation);
router.post("/createQuizByAI",authTeacherMiddleware , upload.single('file'), quizController.createQuizByAI);
router.get("/reviewDraftQuiz",authTeacherMiddleware,quizController.SeeDraftQuiz);
export default router;



