import express from 'express';
import teacherRoutes from './routes/teacherRoutes.js';
import appConfig from './config/appConfig.js';
import question_router from './routes/question_router.js';
import answer_router from './routes/answer_router.js';
import studentRoutes from './routes/studentRoutes.js';
import resultRoutes from './routes/resultRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import cookieParser from 'cookie-parser';

//Imen : configuring the app 
const PORT = process.env.PORT || 7000 ;
const app = express();
appConfig(app);

//Imen : Routes 
app.use(cookieParser());
app.use('/api/teachers',teacherRoutes);
app.use('/api/students',studentRoutes); 
app.use('/api/result',resultRoutes);
app.use('/api/quizzes',quizRoutes);
app.use('/api/answers', answer_router); 
app.use('/api/questions', question_router);

export default app ;
