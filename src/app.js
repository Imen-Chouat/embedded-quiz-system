import express from 'express';
import teacherRoutes from './routes/teacherRoutes.js';
import appConfig from './config/appConfig.js';

//Imen : configuring the app 
const PORT = process.env.PORT || 7000 ;
const app = express();
appConfig(app);

//Imen : Routes 
app.use('/api/teachers',teacherRoutes);

export default app ;
