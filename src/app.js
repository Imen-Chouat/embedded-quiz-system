import express from 'express';
import teacherRoutes from './routes/teacherRoutes';

const PORT = process.env.PORT || 7000 ;
const app = express();

app.use(express.json());
app.use('/api/teachers',teacherRoutes);

app.listen(PORT , ()=>{
    console.log(`server started at ${PORT}`);
})
