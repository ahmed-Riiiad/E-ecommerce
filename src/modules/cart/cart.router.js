import Express  from "express";
import { removeProductFromCart,addProductToCart,updateQuantity, 
    applyCoupon, GetCart, ClearUserCart } from "./cart.controler.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controler.js";
const cartRouter =  Express.Router();

cartRouter.route('/')
    .get(protectedRoutes,allowedTo('user','admin'),GetCart)
    .post(protectedRoutes,allowedTo('user'),addProductToCart)
cartRouter.route('/remove/:id')
    .delete(protectedRoutes,allowedTo('user','admin'),removeProductFromCart)
    
cartRouter.route('/:id')
    .delete(protectedRoutes,allowedTo('user','admin'),ClearUserCart)
    // .get(protectedRoutes,allowedTo('user','admin'),GetCart)
    .put(protectedRoutes,allowedTo('user','admin'),updateQuantity)
    
cartRouter.post('/applyCoupon',protectedRoutes,allowedTo('user','admin'),applyCoupon)

export default cartRouter;