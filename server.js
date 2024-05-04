import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import fs from 'fs';

// import { fileURLToPath } from 'url';
// import { dirname, join } from 'path';

import { appointmentRouter } from './routes/appointmentRoutes.js';
import { usersRouter } from './routes/usersRoutes.js';
import { doctorsRouter } from './routes/doctorsRoutes.js';
import { specialitiesRouter } from './routes/specialitiesRoutes.js';

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
app.use('/api/v1/doctors', doctorsRouter);
app.use('/api/v1/specialities', specialitiesRouter);


const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
