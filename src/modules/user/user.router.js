import Express  from "express";
import { GetMe, UnActiveMe, UpdateME, UpdateUser, changeUserPass, createUser, deleteUser, getAllUser, getOneUser } 
from "./user.controler.js";
import { ResetPassword, allowedTo, forgetPassword, protectedRoutes,
signIN, signUP, updateMyPassword, verify } from "../auth/auth.controler.js";
import { upLoadFile } from "../../midellware/uploadFile.js";


const userRouter =  Express.Router();

// user
userRouter.use('/:userId/subcategories', userRouter)
userRouter.patch('/updateMyPassword', protectedRoutes,GetMe, updateMyPassword)
userRouter.patch('/updateMe', protectedRoutes, GetMe, UpdateME);
userRouter.delete('/UnActive',protectedRoutes,GetMe,UnActiveMe)
userRouter.get('/me', protectedRoutes,upLoadFile('users','photo') , GetMe , getOneUser )
userRouter.patch('/changeUserPass/:id', protectedRoutes, allowedTo('admin'), changeUserPass);




userRouter.route('/')
    .get(protectedRoutes,allowedTo('admin'),getAllUser)
    .post(protectedRoutes,allowedTo('admin'),createUser)
    .delete(protectedRoutes,GetMe,UnActiveMe)

userRouter. 
        route('/:id')
        .get(protectedRoutes,allowedTo('admin'),getOneUser)
        .delete(protectedRoutes,allowedTo('admin','user'),deleteUser)
        .patch(protectedRoutes,allowedTo('admin'),UpdateUser)



// auth
// userRouter.post('/signUP', signUP)
// userRouter.post('/signIn', signIN)
// userRouter.post('/verify/:token', verify)
// userRouter.post('/ForgetPassword', forgetPassword)
// userRouter.patch('/ResetPassword/:token', ResetPassword)
export default userRouter;