// FILE: USERSROUTES.JS
// CREATED BY: JAVOY SPENCE
// DESCRIPTION: FILE TO HANDLE USER ROUTES
// DATE CREATED: 1/5/2024

import express from 'express';
import { getAllUsers, getSingleUser, createUser, deleteUser} from '../controllers/usersController.js';

export const usersRouter = express.Router();

// usersRoutes without id
usersRouter
  .route('/')
  .get(getAllUsers)
  .post(createUser);

//   usersRoutes with id
usersRouter
  .route('/:id')
  .get(getSingleUser)
  .delete(deleteUser);

