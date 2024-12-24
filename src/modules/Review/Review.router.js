import Express  from "express";
import { UpdateReview, createReview, deleteReview, getAllReview, getOneReview } from "./Review.controler.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controler.js";
const reviewRouter =  Express.Router({mergeParams : true});

reviewRouter.route('/').get(protectedRoutes,allowedTo('user'),getAllReview)
    .post(protectedRoutes,allowedTo('user'),createReview)

    reviewRouter.route('/:id')
    .get(protectedRoutes,allowedTo('user','admin'),getOneReview)
    .put(protectedRoutes,allowedTo('user'),UpdateReview)
    .delete(protectedRoutes,allowedTo('user','admin'),deleteReview)

    export default reviewRouter;