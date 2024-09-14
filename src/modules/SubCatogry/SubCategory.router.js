import Express  from "express";
import { UpdateSubCategory, createSubCategory, deleteSubCategory, getAllSubCategory, getOneSubCategory } from "./Subcategory.controller.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controler.js";
const SubcategoryRouter =  Express.Router({mergeParams:true});

SubcategoryRouter.route('/')
.get(protectedRoutes,allowedTo('admin','user'),getAllSubCategory)
.post(createSubCategory)

SubcategoryRouter.route('/:id')
.get(getOneSubCategory)
.put(protectedRoutes,allowedTo('admin') ,UpdateSubCategory)
.delete(protectedRoutes,allowedTo('admin') ,deleteSubCategory)
export default SubcategoryRouter;