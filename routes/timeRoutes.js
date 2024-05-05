// FILE: TIMEROUTES.JS
// CREATED BY: JAVOY SPENCE
// DESCRIPTION: FILE TO HANDLE TIME ROUTES
// DATE CREATED: 1/5/2024



import express from 'express';
import { getAllTime} from '../controllers/timeControllers.js';

export const timeRouter = express.Router();
// route to handle time data without id
timeRouter
   .route('/')
   .get(getAllTime)