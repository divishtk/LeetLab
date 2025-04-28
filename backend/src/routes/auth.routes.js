import express from 'express';
import { check, login, logout, register } from '../controllers/auth.controllers.js';
import { authMiddleware } from '../middlewares/auth.middlewares.js';

const authRoutes = express.Router();



authRoutes.route('/register').post(register);
authRoutes.route('/login').get(login);
authRoutes.route('/logout').post(authMiddleware,logout);
authRoutes.route('/check').get(authMiddleware,check);









export default authRoutes;