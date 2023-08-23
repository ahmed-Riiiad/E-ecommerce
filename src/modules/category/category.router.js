import Express  from "express";
import { UpdateCategory, createCategory, deleteCategory, getAllCategory, getOneCategory } from "./category.controler.js";
import SubcategoryRouter from "../SubCatogry/SubCategory.router.js";
const categoryRouter =  Express.Router();
categoryRouter.use('/:categoryId/subcategories', SubcategoryRouter)
categoryRouter.route('/').get(getAllCategory).post(createCategory)
categoryRouter.route('/:id').get(getOneCategory).put(UpdateCategory).delete(deleteCategory)
export default categoryRouter;