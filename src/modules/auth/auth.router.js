import Express  from "express";
import {signUP, signIN } from "./auth.controler.js";
const AuthRouter = Express.Router()
AuthRouter.post('/signUP', signUP)
AuthRouter.post('/signIn', signIN)



export default AuthRouter