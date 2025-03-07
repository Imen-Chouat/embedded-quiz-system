import express from 'express';
import teacherRoutes from './routes/teacherRoutes.js';
import studentRouters from  './routes/studentRoutes.js';
import question_router from './routes/question_router.js';
import answer_router from './routes/answer_router.js';
import appConfig from './config/appConfig.js';

//Imen : configuring the app 
const PORT = process.env.PORT || 7000 ;
const app = express();
appConfig(app);


//Imen : Routes 
app.use('/api/teachers',teacherRoutes);
app.use('/api/students',studentRoutes);
app.use('/api/questions', question_router);
app.use('/api/answers', answer_router); 
export default app ;
