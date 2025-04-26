import express from 'express';
import teacherControllers from '../controllers/teacherController.js';
import authTeacherMiddleware from '../middlewares/authMiddleware.js';
import authController from '../controllers/authController.js';
import multer from 'multer';
const router = express.Router();
const upload = multer({dest : 'uploads/'});

router.post('/register',teacherControllers.registerTeacher);
router.post('/login',teacherControllers.loginTeacher);
router.post('/getFirstName',authTeacherMiddleware,teacherControllers.getFirstName);
router.post('/getLastName',authTeacherMiddleware,teacherControllers.getLastName);
router.post('/getEmail',authTeacherMiddleware,teacherControllers.getEmail);
router.patch('/modifyName',authTeacherMiddleware,teacherControllers.modifyName);// Imen : updating the name feild 
router.patch('/modifySurName',authTeacherMiddleware,teacherControllers.modifySurName);
router.patch('/modifyPassword',authTeacherMiddleware,teacherControllers.modifyPassword);
router.post('/refresh',authController.refreshAccessToken);
router.post('/logout',authTeacherMiddleware,authController.logoutTeacher);
router.post('/addModule',authTeacherMiddleware,teacherControllers.addTeacherModule);
router.delete('/deleteModule',authTeacherMiddleware,teacherControllers.deleteTeacherModule);
router.patch('/updateModuleLevel',authTeacherMiddleware,teacherControllers.updateModuleLevel);
router.patch('/updateModuleName',authTeacherMiddleware,teacherControllers.updateModuleName);
router.post('/upload-students', upload.single('file'), teacherControllers.uploadStudentFile);
router.delete('/deleteAccount',authTeacherMiddleware,teacherControllers.deleteAccount);
router.get('/getModules',authTeacherMiddleware,teacherControllers.getTeachermodules);
export default router;
