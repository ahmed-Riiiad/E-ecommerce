import Express  from "express";
import { UpdateCoupon, createCoupon, deleteCoupon, getAllCoupon, getOneCoupon } from "./coupon.controler.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controler.js";
const CouponRouter =  Express.Router();

CouponRouter.route('/')
    .get(getAllCoupon)
    .post(protectedRoutes,allowedTo('admin'),createCoupon)

CouponRouter.route('/:id')
    .get(getOneCoupon)
    .put(protectedRoutes,allowedTo('user'),UpdateCoupon)
    .delete(protectedRoutes,allowedTo('user', 'admin'),deleteCoupon)

    export default CouponRouter;