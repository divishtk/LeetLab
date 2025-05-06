import express, { application } from 'express';
import { authMiddleware, isAdmin } from '../middlewares/auth.middlewares.js';
import { createProblem, deleteProblemById, getAllProblems, getAllProblemsSolvedByUser, getProblemById, updateProblemById } from '../controllers/probleme.controllers.js';

const submissionRoutes = express.Router();


submissionRoutes.get('/get-AllSubmission',authMiddleware)
submissionRoutes.get('/get-submission/:problemId',authMiddleware)
submissionRoutes.get('/get-submissionCount/:problemId',authMiddleware)



export default submissionRoutes;