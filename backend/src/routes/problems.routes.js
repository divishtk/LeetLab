import express from 'express';
import { authMiddleware, isAdmin } from '../middlewares/auth.middlewares.js';
import { createProblem, deleteProblemById, getAllProblems, getAllProblemsSolvedByUser, getProblemById, updateProblemById } from '../controllers/probleme.controllers.js';

const problemRoutes = express.Router();


 problemRoutes.post('/create-problem',authMiddleware, isAdmin,createProblem);
 problemRoutes.get('/get-problem/:id',authMiddleware, getProblemById);
 problemRoutes.get('/get-Allproblems',authMiddleware, getAllProblems);
 problemRoutes.put('/update-problem/:id',authMiddleware, isAdmin,updateProblemById);
 problemRoutes.delete('/delete-problem/:id',authMiddleware, isAdmin,deleteProblemById);
 problemRoutes.get('/get-solvedProblems',authMiddleware , getAllProblemsSolvedByUser);


export default problemRoutes;