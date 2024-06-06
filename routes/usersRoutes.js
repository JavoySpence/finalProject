// FILE: USERSROUTES.JS
// CREATED BY: JAVOY SPENCE
// DESCRIPTION: FILE TO HANDLE USER ROUTES
// DATE CREATED: 1/5/2024

import express from 'express';
import {protect, createAdminUser, registerUser, loginUser, getThisUser} from '../controllers/usersController.js';
// import { protect } from '../controllers/usersController.js';


export const usersRouter = express.Router();

usersRouter.post('/create-user', createAdminUser )
usersRouter.post('/register', registerUser )
usersRouter.post('/login', loginUser )

usersRouter.use(protect)
usersRouter.get('/my-profile', getThisUser )


// usersRoutes with id
// usersRouter
//   .route('/:id')
//   .get(getSingleUser)
//   .delete(deleteUser)
//   .put( updateUser);

