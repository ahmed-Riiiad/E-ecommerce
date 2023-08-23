import Express  from "express";
import { UpdateProduct, createProduct, deleteProduct, getAllProduct, getOneProduct } from "./product.controler.js";
import { validate } from "../../midellware/validaition.js";
import { UpdateProductSchema, createProductSchema, deleteProductSchema, getProductSchema } from "./product.validation.js";
import { upLoadFiles } from "../../midellware/uploadFile.js";

const productRouter =  Express.Router();
let arrayOfFields = [{name : 'imgCover',maxCount: 1},{name :'imgs', maxCount:20}]
productRouter.route('/')
.get(getAllProduct)
.post(upLoadFiles('product',arrayOfFields),validate(createProductSchema),createProduct)

productRouter.route('/:id')
.get(validate(getProductSchema),getOneProduct)
.put(validate(UpdateProductSchema),UpdateProduct)
.delete(validate(deleteProductSchema),deleteProduct)
export default productRouter;