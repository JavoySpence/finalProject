// FILE: STUDENTROUTES.JS
// CREATED BY: JAVOY SPENCE
// DESCRIPTION: FILE TO HANDLE APPOINTMENT ROUTES
// DATE CREATED: 1/5/2024

import express from 'express';
import {
    getAllAppointments,
    getSingleAppointment,
    updateAppointment,
    createAppointment,
    deleteAppointment,
  
} from '../controllers/appointmentControllers.js';

export const appointmentRouter = express.Router();

// Routes without ID: for creating a new appointment and fetching all appointments with a join to user details
appointmentRouter
    .route('/')
    .get(getAllAppointments)
    .post(createAppointment);

// Routes with ID: for fetching, updating, and deleting an appointment by its ID
appointmentRouter
    .route('/:id')
    .get(getSingleAppointment)
    .put(updateAppointment)
    .delete(deleteAppointment);

 






