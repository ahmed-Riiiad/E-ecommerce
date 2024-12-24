import Express  from "express";
import { UpdateBrand, createBrand, deleteBrand, getAllBrand, getOneBrand } 
from "./brand.controller.js";
import { upLoadFile } from "../../midellware/uploadFile.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controler.js";

const BrandRouter =  Express.Router();

BrandRouter.route('/')
.get(protectedRoutes,allowedTo('admin'), getAllBrand)
.post(protectedRoutes,allowedTo('admin'), upLoadFile('brand','logo'),createBrand)

BrandRouter.route('/:id')
.get(protectedRoutes,allowedTo('admin'),getOneBrand)
.put(protectedRoutes,allowedTo('admin'), upLoadFile('brand', 'logo'), UpdateBrand)
.delete(protectedRoutes,allowedTo('admin'),deleteBrand)
export default BrandRouter;