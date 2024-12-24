import Express  from "express";
import { UpdateCoupon, createCoupon, deleteCoupon, getAllCoupon, getOneCoupon } from "./coupon.controler.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controler.js";
const CouponRouter =  Express.Router();

CouponRouter.route('/')
    .get(protectedRoutes,allowedTo('admin'),getAllCoupon)
    .post(protectedRoutes,allowedTo('admin'),createCoupon)

CouponRouter.route('/:id')
    .get(getOneCoupon)
    .put(protectedRoutes,allowedTo('admin'),UpdateCoupon)
    .delete(protectedRoutes,allowedTo('admin'),deleteCoupon)

    export default CouponRouter;