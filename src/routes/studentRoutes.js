import express from 'express';
import studentControllers from '../controllers/studentController.js';
import authenticateStudent from '../middlewares/authMiddleware.js';
const router = express.Router();



router.post('/register',studentControllers.registerStudent );
router.post('/login',studentControllers.loginStudent );
router.delete('/delete', authenticateStudent ,studentControllers.deleteAccount);
router.patch('/modify_LastName',authenticateStudent ,studentControllers.modify_LastName );
router.patch('/modify_FirstName',authenticateStudent ,studentControllers.modify_FirstName );
router.patch('/modify_password',authenticateStudent ,studentControllers.modify_password );
router.patch('/modify_group',authenticateStudent ,studentControllers.updateStudentGroup  );
router.get('/reviewQuiz',authenticateStudent ,studentControllers.reviewQuiz );

export default router;
