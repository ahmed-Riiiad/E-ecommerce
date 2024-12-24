import Express  from "express";
import { UpdateCategory, createCategory, deleteCategory, getAllCategory, getOneCategory } from "./category.controler.js";
import { upLoadFile } from "../../midellware/uploadFile.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controler.js";
import SubcategoryRouter from "../SubCatogry/SubCategory.router.js";

const categoryRouter =  Express.Router();

categoryRouter.use('/:categoryId/subcategories', SubcategoryRouter)

categoryRouter.route('/')
.get(protectedRoutes,allowedTo('admin'),getAllCategory)
.post(protectedRoutes,allowedTo('admin') , upLoadFile('category', 'imgs'),createCategory)

categoryRouter.route('/:id')
.get(protectedRoutes,allowedTo('admin') ,getOneCategory)
.put(protectedRoutes,allowedTo('admin'),upLoadFile('category', 'imgs'),UpdateCategory)
.delete(protectedRoutes,allowedTo('admin'),deleteCategory)

export default categoryRouter;