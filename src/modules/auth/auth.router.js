import Express  from "express";
import {signUP, signIN, forgetPassword, ResetPassword, protectedRoutes, updateMyPassword, verify } from "./auth.controler.js";

const AuthRouter = Express.Router()
AuthRouter.post('/signUP', signUP)
AuthRouter.post('/signIn', signIN)
AuthRouter.post('/ForgetPassword', forgetPassword)
AuthRouter.patch('/updatePassword', protectedRoutes , updateMyPassword)
AuthRouter.post('/verify/:token', verify)
AuthRouter.patch('/ResetPassword/:token', ResetPassword)


export default AuthRouter