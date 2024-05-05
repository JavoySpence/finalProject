// FILE: USERSROUTES.JS
// CREATED BY: JAVOY SPENCE
// DESCRIPTION: FILE TO HANDLE DOCTOR ROUTES
// DATE CREATED: 1/5/2024

import express from 'express';
import {createDoctor, getAllDoctors, deleteDoctor, getSingleDoctor, updateDoctor} from '../controllers/doctorsController.js';
import fileUpload from 'express-fileupload';



export const doctorsRouter = express.Router();

doctorsRouter.use(
   fileUpload({
       limits: {
           fileSize: 2 * 1024 * 1024, 
       },
       abortOnLimit: true, 
   })
);

// doctors routes without id
doctorsRouter
   .route('/')
   .get(getAllDoctors)
   .post(createDoctor)
 
// doctors routes with id
doctorsRouter
   .route('/:id')
   .get(getSingleDoctor)
   .delete(deleteDoctor)
   .put(updateDoctor);




