// FILE: USERSROUTES.JS
// CREATED BY: JAVOY SPENCE
// DESCRIPTION: FILE TO HANDLE USER ROUTES
// DATE CREATED: 1/5/2024

import express from 'express';
import { loginUser, registerUser, protect, getThisUser } from '../controllers/usersController2.js';


export const users2Router = express.Router();

// usersRoutes without id
// users2Router
//   .route('/')
//   .post(registerUser)
  


users2Router.post('/login',loginUser)
users2Router.post('/register',registerUser)



users2Router.use(protect);
  // .route('/:id')
  // .get(protect)
  users2Router.get('/my-profile', getThisUser);



 

// usersRoutes with id

