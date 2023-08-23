import Express  from "express";
import { UpdateSubCategory, createSubCategory, deleteSubCategory, getAllSubCategory, getOneSubCategory } from "./Subcategory.controller.js";
const SubcategoryRouter =  Express.Router({mergeParams:true});
SubcategoryRouter.route('/').get(getAllSubCategory).post(createSubCategory)
SubcategoryRouter.route('/:id').get(getOneSubCategory).put(UpdateSubCategory).delete(deleteSubCategory)
export default SubcategoryRouter;