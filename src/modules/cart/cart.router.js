import Express  from "express";
import { removeProductFromCart,addProductToCart,updateQuantity, 
    applyCoupon, GetCart, ClearUserCart } from "./cart.controler.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controler.js";
const cartRouter =  Express.Router();

cartRouter.route('/')
    .get(protectedRoutes,allowedTo('user'),GetCart)
    .post(protectedRoutes,allowedTo('user'),addProductToCart)
cartRouter.route('/remove/:id')
    .delete(protectedRoutes,allowedTo('user'),removeProductFromCart)
    
cartRouter.route('/:id')
    .delete(protectedRoutes,allowedTo('user'),ClearUserCart)
    .put(protectedRoutes,allowedTo('user'),updateQuantity)
    
cartRouter.post('/applyCoupon',protectedRoutes,allowedTo('user'),applyCoupon)

export default cartRouter;