import express from 'express';
import {getAnnonymousFeedbacks, createAnnonymousFeedbacks} from '../controllers/anonymousControllers.js';

export const anonymousRouter = express.Router();

anonymousRouter
   .route('/')
   .get(getAnnonymousFeedbacks)
   .post(createAnnonymousFeedbacks);
