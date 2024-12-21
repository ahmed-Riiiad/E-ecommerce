import Express  from "express";
import { UpdateProduct, createProduct, deleteProduct, getAllProduct, getOneProduct } from "./product.controler.js";
import { upLoadFiles } from "../../midellware/uploadFile.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controler.js";
import reviewRouter from "../Review/Review.router.js";

const productRouter =  Express.Router();
productRouter.use('/:productId/reviews' ,reviewRouter)

let arrayOfFields = [{name : 'imgCover',maxCount: 1},{name :'imgs', maxCount:20}]


productRouter.route('/')
.get(getAllProduct)
.post(protectedRoutes,allowedTo('admin','user'),upLoadFiles('product',arrayOfFields),createProduct)

productRouter.route('/:id')
.get(protectedRoutes,allowedTo('user' ,'admin') ,getOneProduct)
.put(protectedRoutes,allowedTo('admin') , UpdateProduct)
.delete( protectedRoutes,allowedTo('admin'), deleteProduct)
export default productRouter;