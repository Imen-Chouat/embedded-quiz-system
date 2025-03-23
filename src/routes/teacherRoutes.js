import express from 'express';
import teacherControllers from '../controllers/teacherController.js';
import {authTeacherMiddleware , authmiddle} from '../middlewares/authMiddleware.js';
import { refreshAccessToken } from '../controllers/authController.js';
import Organization from '../modules/Organization.js';
//import multer from 'multer';
const router = express.Router();
//const upload = multer({dest : 'uploads/'});

router.post('/register',teacherControllers.registerTeacher);
router.post('/login',teacherControllers.loginTeacher);
router.patch('/modifyName',authmiddle,teacherControllers.modifyName);// Imen : updating the name feild 
router.patch('/modifySurName',authTeacherMiddleware,teacherControllers.modifySurName);
router.patch('/modifyPassword',authTeacherMiddleware,teacherControllers.modifyPassword);
router.post('/refresh-token',refreshAccessToken);
router.post('/addModule',teacherControllers.addTeacherModule);
router.delete('/deleteModule',teacherControllers.deleteTeacherModule);
router.patch('/updateModuleLevel',teacherControllers.updateModuleLevel);
router.patch('/updateModuleName',teacherControllers.updateModuleName);
router.delete('/deleteAccount',teacherControllers.deleteAccount);
export default router;
