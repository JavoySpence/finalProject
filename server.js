import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import fileUpload from 'express-fileupload';
// import fs from 'fs';

import { appointmentRouter } from './routes/appointmentRoutes.js';
import { usersRouter } from './routes/usersRoutes.js';
import { users2Router } from './routes/users2Routes.js';
import { doctorsRouter } from './routes/doctorsRoutes.js';
import { specialitiesRouter } from './routes/specialitiesRoutes.js';
import { timeRouter } from './routes/timeRoutes.js';
import { sexRouter } from './routes/sexRoutes.js';
import { anonymousRouter } from './routes/annonymousRoutes.js';
import { namedRouter } from './routes/namedFeedbackRoutes.js';
import { appointment_resche } from './routes/appointmentReschedule.js';



const app = express();



app.use(fileUpload());

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

app.use('/api/v1/appointments', appointmentRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/users2', users2Router);
app.use('/api/v1/doctors', doctorsRouter);
app.use('/api/v1/specialities', specialitiesRouter);
app.use('/api/v1/time', timeRouter);
app.use('/api/v1/sex', sexRouter);
app.use('/api/v1/annonymous', anonymousRouter);
app.use('/api/v1/namedFeedback', namedRouter);
app.use('/api/v1/appointment_resche', appointment_resche);


const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
