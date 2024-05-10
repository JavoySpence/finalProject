import express from 'express';
import {getAllRescheduless} from '../controllers/appointmentReschedules.js';

export const appointment_resche = express.Router();

appointment_resche
    .route('/')
    .get(getAllRescheduless)
    .put()
 
