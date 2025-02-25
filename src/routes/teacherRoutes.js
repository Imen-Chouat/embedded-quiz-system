import express from 'express';
import teacherControllers from '../controllers/teacherController.js';

const router = express.Router();

router.post('/register',teacherControllers.registerTeacher);
router.post('/login',teacherControllers.loginTeacher);

export default router;