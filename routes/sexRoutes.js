// FILE: SEXROUTES.JS
// CREATED BY: JAVOY SPENCE
// DESCRIPTION: FILE TO HANDLE SEX ROUTES
// DATE CREATED: 1/5/2024


import express from 'express';
import {getAllSex, } from '../controllers/sexControllers.js';

export const sexRouter = express.Router();

sexRouter
   .route('/')
   .get(getAllSex)
   

