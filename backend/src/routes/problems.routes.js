import express from 'express';
import { authMiddleware } from '../middlewares/auth.middlewares.js';

const problemRoutes = express.Router();


problemRoutes.post('/create-problem',authMiddleware, );
problemRoutes.get('/get-problem/:id');
problemRoutes.get('/get-Allproblems');
problemRoutes.get('/update-problem/:id');
problemRoutes.get('/delete-problem/:id');
problemRoutes.get('/get-solvedProblems');


export default problemRoutes;