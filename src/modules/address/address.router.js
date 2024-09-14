import Express  from "express";
import {  addAddress, getAddress, removeAddress } from "./address.controler.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controler.js";
const addressRouter =  Express.Router();

addressRouter
    .route('/')
    .patch(protectedRoutes,allowedTo('user'),addAddress)
    .delete(protectedRoutes,allowedTo('user'),removeAddress)
    .get(protectedRoutes,allowedTo('user'),getAddress)

export default addressRouter;