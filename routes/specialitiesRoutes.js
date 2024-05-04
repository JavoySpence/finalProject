import express from 'express';
import { getAllSpecialities, deleteSpeciality} from '../controllers/specialitiesControllers.js';

export const specialitiesRouter = express.Router();

specialitiesRouter
   .route('/')
   .get(getAllSpecialities)
//    .post(createDoctor)
 
specialitiesRouter
   .route('/:id')
   .delete(deleteSpeciality)