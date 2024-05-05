// FILE: SPECIALITYROUTES.JS
// CREATED BY: JAVOY SPENCE
// DESCRIPTION: FILE TO HANDLE SPECIALITY ROUTES
// DATE CREATED: 1/5/2024


import express from 'express';
import { getAllSpecialities, deleteSpeciality, createSpeciality} from '../controllers/specialitiesControllers.js';

export const specialitiesRouter = express.Router();


specialitiesRouter
   .route('/')
   .get(getAllSpecialities)
   .post(createSpeciality)

 
specialitiesRouter
   .route('/:id')
   .delete(deleteSpeciality)
  