import Express  from "express";
import { removeProductFromCart,addProductToCart,updateQuantity, applyCoupon } from "./cart.controler.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controler.js";
const cartRouter =  Express.Router();

cartRouter.route('/')
    .post(protectedRoutes,allowedTo('user'),addProductToCart)

cartRouter.route('/:id')
    .delete(protectedRoutes,allowedTo('user','admin'),removeProductFromCart)
    .put(protectedRoutes,allowedTo('user','admin'),updateQuantity)

    cartRouter.post('/applyCoupon',protectedRoutes,allowedTo('user','admin'),applyCoupon)

export default cartRouter;