import Express  from "express";
import { removeProductFromCart,addProductToCart,updateQuantity, 
    applyCoupon, GetCart, ClearUserCart } from "./cart.controler.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controler.js";
const cartRouter =  Express.Router();

cartRouter.route('/')
    .post(protectedRoutes,allowedTo('user'),addProductToCart)
    .get(protectedRoutes,allowedTo('user'), GetCart)


cartRouter.route('/:id')
    .delete(protectedRoutes,allowedTo('user'),removeProductFromCart)
    .put(protectedRoutes,allowedTo('user'),updateQuantity)
    .delete(protectedRoutes,allowedTo('user'),ClearUserCart)
    
cartRouter.post('/applyCoupon',protectedRoutes,allowedTo('user','admin'),applyCoupon)

export default cartRouter;