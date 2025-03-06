import express from 'express';
import studentControllers from '../controllers/studentController.js';

const router = express.Router();


router.post('/Register',studentControllers.RegisterStudent);
router.post('/login',studentControllers.loginStudent);
router.patch('/modify_LastName',studentControllers.modify_LastName );
router.patch('/modify_FirstName',studentControllers.modify_FirstName );
router.patch('/modify_password',studentControllers.modify_password );
router.patch('/modify_group',studentControllers.modify_group );

export default router;
