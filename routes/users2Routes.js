// FILE: USERSROUTES.JS
// CREATED BY: JAVOY SPENCE
// DESCRIPTION: FILE TO HANDLE USER ROUTES
// DATE CREATED: 1/5/2024

import express from 'express';
import { loginUser, registerUser, protect } from '../controllers/usersController2.js';


export const users2Router = express.Router();

// usersRoutes without id
users2Router
  .route('/')
  .post(registerUser)
  .get(loginUser)


users2Router
  .route('/:id')
  .get(protect)

 

// usersRoutes with id

