import Express  from "express";
import {  addToWishList, getAllUserWishList, removeFromWishList } from "./wishList.controler.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controler.js";
const wishListRouter =  Express.Router();
wishListRouter
    .route('/').patch(protectedRoutes,allowedTo('user'),addToWishList)
    .delete(protectedRoutes,allowedTo('user'),removeFromWishList)
    .get(protectedRoutes,allowedTo('user','admin'),getAllUserWishList)
export default wishListRouter;