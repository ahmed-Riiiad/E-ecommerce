import Express  from "express";
import {  addToWishList, getUserWishList, removeFromWishList } from "./wishList.controler.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controler.js";
const wishListRouter =  Express.Router();

wishListRouter
    .route('/')
    .patch(protectedRoutes,allowedTo('user'),addToWishList)
    .delete(protectedRoutes,allowedTo('user'),removeFromWishList)
    .get(protectedRoutes,allowedTo('user'),getUserWishList)
export default wishListRouter;