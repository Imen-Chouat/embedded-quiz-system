import express from 'express';
import teacherControllers from '../controllers/teacherController.js';
import { authTeacherMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register',teacherControllers.registerTeacher);
router.post('/login',teacherControllers.loginTeacher);
router.patch('/modifyName',authTeacherMiddleware,teacherControllers.modifyName);// Imen : updating the name feild 
router.patch('/modifySurName',authTeacherMiddleware,teacherControllers.modifySurName);
router.patch('/modifyPassword',authTeacherMiddleware,teacherControllers.modifyPassword);
export default router;
