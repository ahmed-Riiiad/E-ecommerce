import Express  from "express";
import {signUP, signIN, forgetPassword, ResetPassword, protectedRoutes, updateMyPassword, verify, verifyResetCode } from "./auth.controler.js";

const AuthRouter = Express.Router()
AuthRouter.post('/signUP', signUP)
AuthRouter.post('/signIn', signIN)
AuthRouter.patch('/updatePassword', protectedRoutes , updateMyPassword)
AuthRouter.post('/ForgetPassword', forgetPassword);
AuthRouter.post('/verifyResetCode', verifyResetCode);
AuthRouter.patch('/ResetPassword', ResetPassword);
AuthRouter.get('/verify/:token', verify)


export default AuthRouter