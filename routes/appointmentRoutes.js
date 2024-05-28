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
    getCountOfAppointments,
  
} from '../controllers/appointmentControllers.js';

export const appointmentRouter = express.Router();


appointmentRouter
    .route('/')
    .get(getAllAppointments)
    .post(createAppointment);


appointmentRouter
    .route('/:id')
    .get(getSingleAppointment)
    .put(updateAppointment)
    .delete(deleteAppointment);

 
 appointmentRouter
  .route('/count')
  .get(getCountOfAppointments);

 
    




