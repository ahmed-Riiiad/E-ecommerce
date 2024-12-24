import Express  from "express";
import { UpdateSubCategory, createSubCategory, deleteSubCategory, getAllSubCategory, getOneSubCategory } from "./Subcategory.controller.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controler.js";
const SubcategoryRouter =  Express.Router({mergeParams:true});

SubcategoryRouter.route('/')
.get(protectedRoutes,allowedTo('admin'),getAllSubCategory)
.post(protectedRoutes,allowedTo('admin'),createSubCategory)

SubcategoryRouter.route('/:id')
.get(protectedRoutes,allowedTo('admin'),getOneSubCategory)
.put(protectedRoutes,allowedTo('admin') ,UpdateSubCategory)
.delete(protectedRoutes,allowedTo('user') ,deleteSubCategory)
export default SubcategoryRouter;