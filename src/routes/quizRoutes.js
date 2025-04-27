import express from 'express';
import quizController from '../controllers/quizController.js';
import authenticateStudent, { authTeacherMiddleware } from '../middlewares/authMiddleware.js';
import multer from 'multer';
import fs from 'fs';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });
const router = express.Router();
router.post("/create", authTeacherMiddleware, quizController.createQuiz);
router.delete('/:id', authTeacherMiddleware, quizController.deleteQuiz);
router.patch('/:id/title', authTeacherMiddleware, quizController.update_title);
router.patch('/:id/duration', authTeacherMiddleware, quizController.update_duration);
router.patch('/:id/timedby', authTeacherMiddleware, quizController.update_timedby);
router.post('/ALLQuizzesbymodule', authTeacherMiddleware, quizController.ALLQuizzesbymodule );
router.post('/Draft_Quizzesbymodule', authTeacherMiddleware, quizController.Draft_Quizzesbymodule);
router.post('/Past_Quizzesbymodule', authTeacherMiddleware, quizController.Past_Quizzesbymodule);
router.get('/AllQuizzes2', authTeacherMiddleware, quizController.ALLQuizzes2);
router.get('/draftQuizzes', authTeacherMiddleware, quizController.Draft_Quizzes);
router.get('/PastQuizzes', authTeacherMiddleware, quizController.Past_Quizzes);
router.post("/start_student",authenticateStudent , quizController.startQuizstudent);
router.post("/submit", authenticateStudent, quizController.submitQuizManually);
router.post("/auto-submit", authenticateStudent, quizController.autoSubmitQuiz);
router.post("/addquizparticipants", authTeacherMiddleware, quizController.addquizparticipants);
router.post("/importQuiz", authTeacherMiddleware, upload.single('file'), quizController.importQuiz);
router.post("/start_teach",authenticateStudent , quizController.startQuizbyteach);
router.post("/reviewDraftQuiz",quizController.SeeQuiz);
router.get("/randomize/:quizId", quizController.randomazation);
export default router;





