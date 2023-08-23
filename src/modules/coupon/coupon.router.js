import Express  from "express";
import { UpdateCoupon, createCoupon, deleteCoupon, getAllCoupon, getOneCoupon } from "./coupon.controler.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controler.js";
const CouponRouter =  Express.Router();

CouponRouter.route('/')
    .get(protectedRoutes,allowedTo('admin','user'),getAllCoupon)
    .post(protectedRoutes,allowedTo('admin'),createCoupon)

CouponRouter.route('/:id')
    .get(protectedRoutes,allowedTo('user','admin'),getOneCoupon)
    .put(protectedRoutes,allowedTo('user'),UpdateCoupon)
    .delete(protectedRoutes,allowedTo('user'),deleteCoupon)

    export default CouponRouter;