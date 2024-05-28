import express from 'express';
import { getAllRescheduless, createReschedule, deleteReschedule } from '../controllers/appointmentReschedules.js';

export const appointment_resche = express.Router();

appointment_resche
    .route('/')
    .get(getAllRescheduless)
    .post(createReschedule);

appointment_resche
    .route('/:id')
    .delete(deleteReschedule);
