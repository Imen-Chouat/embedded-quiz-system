import express from 'express';
import teacherRoutes from './routes/teacherRoutes';
import appConfig from './config/appConfig';

//Imen : configuring the app 
const PORT = process.env.PORT || 7000 ;
const app = express();
appConfig(app);

//Imen : Routes 
app.use('/api/teachers',teacherRoutes);

export default app ;
