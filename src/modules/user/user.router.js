import Express  from "express";
import { UpdateUser, changePass, createUser, deleteUser, getAllUser, getOneUser } from "./user.controler.js";
const userRouter =  Express.Router();
userRouter.use('/:userId/subcategories', userRouter)
userRouter
    .route('/')
    .get(getAllUser)
    .post(createUser)
userRouter. 
        route('/:id')
        .get(getOneUser)
        .put(UpdateUser)
        .delete(deleteUser)

userRouter.patch('changePass/:id',changePass)
export default userRouter;