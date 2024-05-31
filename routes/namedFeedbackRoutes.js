import express from 'express';
import { getNamedFeedbacks, createFeedback, deleteFeedback, getSingleFeedbacks } from '../controllers/namedFeedbackControllers.js';

const namedRouter = express.Router();

namedRouter
  .route('/')
  .get(getNamedFeedbacks)
  .post(createFeedback);
// .post(createAnnonymousFeedbacks);

namedRouter
  .route('/:id')
  .get(getSingleFeedbacks) 
  .delete(deleteFeedback); 

export { namedRouter };
