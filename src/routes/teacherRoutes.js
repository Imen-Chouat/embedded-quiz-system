import express from 'express';
import teacherControllers from '../controllers/teacherController.js';
import authTeacherMiddleware from '../middlewares/authMiddleware.js';
import authController from '../controllers/authController.js';
import multer from 'multer';
const router = express.Router();
const upload = multer({dest : 'uploads/'});

router.post('/register',teacherControllers.registerTeacher);
router.post('/login',teacherControllers.loginTeacher);
router.post('/refresh',authController.refreshAccessToken);
router.post('/logout',authTeacherMiddleware,authController.logoutTeacher);
router.patch('/modifyName',authTeacherMiddleware,teacherControllers.modifyName);// Imen : updating the name feild 
router.patch('/modifySurName',authTeacherMiddleware,teacherControllers.modifySurName);
router.patch('/modifyPassword',authTeacherMiddleware,teacherControllers.modifyPassword);
router.post('/addModule',teacherControllers.addTeacherModule);
router.delete('/deleteModule',teacherControllers.deleteTeacherModule);
router.patch('/updateModuleLevel',teacherControllers.updateModuleLevel);
router.patch('/updateModuleName',teacherControllers.updateModuleName);
router.post('/upload-students', upload.single('file'), teacherControllers.uploadStudentFile);
router.delete('/deleteAccount',teacherControllers.deleteAccount);
export default router;
