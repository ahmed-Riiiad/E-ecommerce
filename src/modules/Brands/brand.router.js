import Express  from "express";
import { UpdateBrand, createBrand, deleteBrand, getAllBrand, getOneBrand } 
from "./brand.controller.js";
import { upLoadFile } from "../../midellware/uploadFile.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controler.js";

const BrandRouter =  Express.Router();

BrandRouter.route('/')
.get(getAllBrand)
.post(protectedRoutes,allowedTo('admin','user'), upLoadFile('brand', 'logo'),createBrand)

BrandRouter.route('/:id')
.get(getOneBrand)
.put(protectedRoutes,allowedTo('admin'), upLoadFile('brand', 'logo'), UpdateBrand)
.delete(protectedRoutes,allowedTo('admin'),deleteBrand)
export default BrandRouter;