import Express  from "express";
import { UpdateProduct, createProduct, deleteProduct, getAllProduct, getOneProduct } from "./product.controler.js";
import { validate } from "../../midellware/validaition.js";
import { UpdateProductSchema, createProductSchema, deleteProductSchema, getProductSchema } from "./product.validation.js";
import { upLoadFiles } from "../../midellware/uploadFile.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controler.js";

const productRouter =  Express.Router();
let arrayOfFields = [{name : 'imgCover',maxCount: 1},{name :'imgs', maxCount:20}]


productRouter.route('/')
.get(getAllProduct)
.post(protectedRoutes,allowedTo('admin','user'),upLoadFiles('product',arrayOfFields),validate(createProductSchema),createProduct)

productRouter.route('/:id')
.get(validate(getProductSchema),getOneProduct)
.put(protectedRoutes,allowedTo('admin') , validate(UpdateProductSchema),UpdateProduct)
.delete( protectedRoutes,allowedTo('admin'), validate(deleteProductSchema),deleteProduct)
export default productRouter;