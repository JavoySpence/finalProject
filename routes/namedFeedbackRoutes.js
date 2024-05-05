import express from 'express';
import {getNamedFeedbacks} from '../controllers/namedFeedbackControllers.js';

export const namedRouter = express.Router();

namedRouter
   .route('/')
   .get(getNamedFeedbacks)
//    .post(createAnnonymousFeedbacks);