import Express  from "express";
import { UpdateBrand, createBrand, deleteBrand, getAllBrand, getOneBrand } from "./brand.controller.js";
const BrandRouter =  Express.Router();
BrandRouter.route('/').get(getAllBrand).post(createBrand)
BrandRouter.route('/:id').get(getOneBrand).put(UpdateBrand).delete(deleteBrand)
export default BrandRouter;