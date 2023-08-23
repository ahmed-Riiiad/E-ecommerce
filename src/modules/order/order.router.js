import Express  from "express";
import { createCashOrder, getAllOrder, getSpecifiedOrder } from "./order.controler.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controler.js";
const orderRouter =  Express.Router();

orderRouter.route('/:id')
    .post(protectedRoutes,allowedTo('user'),createCashOrder)



orderRouter.route('/')
     .get(protectedRoutes,allowedTo('user'),getSpecifiedOrder)


orderRouter.get('/all',getAllOrder)

export default orderRouter;