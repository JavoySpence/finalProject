import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { appointmentRouter } from './routes/appointmentRoutes.js';
import { usersRouter } from './routes/usersRoutes.js';
import { doctorsRouter } from './routes/doctorsRoutes.js';


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

app.use('/api/v1/appointments', appointmentRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/doctors', doctorsRouter)

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

