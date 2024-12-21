import Express  from "express";
import { createSessionOrder, createCashOrder, getAllOrder, getSpecifiedOrder } 
from "./order.controler.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controler.js";

const orderRouter =  Express.Router();

orderRouter.route('/:id')
    .post(protectedRoutes,allowedTo('admin'),createCashOrder)

orderRouter.route('/')
     .get(protectedRoutes,allowedTo('admin'),getSpecifiedOrder)

orderRouter.route('/all')
.get(protectedRoutes,allowedTo('admin'),getAllOrder)

orderRouter.route('/checkOut/:id')
.post(protectedRoutes,allowedTo('user'),createSessionOrder)

export default orderRouter;