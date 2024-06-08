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
    searchAppointmentsByDoctorName,
    getAllDoctors,
   
  
} from '../controllers/appointmentControllers.js';

export const appointmentRouter = express.Router();

// route that dont need id for manipulation
appointmentRouter
    .route('/')
    .get(getAllAppointments)
    .post(createAppointment);

// route that needs id for manipulation
appointmentRouter
    .route('/:id')
    .get(getSingleAppointment)
    .put(updateAppointment)
    .delete(deleteAppointment);

//  route to count items
//  appointmentRouter
//   .route('/count')
//   .get(getCountOfAppointments);


  // Add the search route here
// appointmentRouter
// .route('/search')
// .get(searchAppointmentsByDoctorName);

appointmentRouter
    .route('/doctors')
    .get(getAllDoctors);

 
    




