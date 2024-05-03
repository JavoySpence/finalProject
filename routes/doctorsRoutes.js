// FILE: USERSROUTES.JS
// CREATED BY: JAVOY SPENCE
// DESCRIPTION: FILE TO HANDLE USER ROUTES
// DATE CREATED: 1/5/2024

import express from 'express';
import {getAllDoctors, createDoctor } from '../controllers/doctorsController.js';

export const doctorsRouter = express.Router();

doctorsRouter
   .route('/')
   .get(getAllDoctors)
   .post(createDoctor);


