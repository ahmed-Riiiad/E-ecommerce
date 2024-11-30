import Express  from "express";
import { UnActiveUser, UpdateUser, changePass, createUser, deleteUser, getAllUser, getOneUser } 
from "./user.controler.js";
import { ResetPassword, allowedTo, forgetPassword, protectedRoutes,
signIN, signUP, updatePassword, verify } from "../auth/auth.controler.js";


const userRouter =  Express.Router();
userRouter.use('/:userId/subcategories', userRouter)

// user
userRouter
    .route('/')
    .get(protectedRoutes,allowedTo('admin'),getAllUser)
    .post(protectedRoutes,allowedTo('user','admin'),createUser)
    .patch(protectedRoutes,allowedTo('user'),UpdateUser)
    .delete(protectedRoutes,allowedTo('user'),UnActiveUser)

userRouter. 
        route('/:id')
        .get(protectedRoutes,allowedTo('user'),getOneUser)
        .delete(protectedRoutes,allowedTo('user'),deleteUser)

userRouter.patch('changePass/:id',protectedRoutes,allowedTo('user'),changePass)

// auth
userRouter.post('/signUP', signUP)
userRouter.post('/signIn', signIN)
userRouter.get('/verify/:token', verify)
userRouter.post('/ForgetPassword', forgetPassword)
userRouter.patch('/ResetPassword/:token', ResetPassword)
userRouter.patch('/updatePassword', protectedRoutes, allowedTo('user') , updatePassword)
export default userRouter;