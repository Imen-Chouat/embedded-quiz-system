import express from 'express';
import teacherControllers from '../controllers/teacherController.js';

const router = express.Router();

router.post('/register',teacherControllers.registerTeacher);
router.post('/login',teacherControllers.loginTeacher);
router.patch('/modifyName',teacherControllers.modifyName);// Imen : updating the name feild 

export default router;