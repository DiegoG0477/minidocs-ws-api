import { Router } from "express";
import * as authController from '../controllers/auth.controller.js'

const authRouter = Router();

authRouter.post('/login', authController.login);
authRouter.post('/signUp', authController.signUp);

export default authRouter;