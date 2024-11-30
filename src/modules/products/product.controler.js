import { catchError } from "../../utiles/catchError.js"
import  {ProductModel} from "../../../database/models/Products.model.js"
import slugify from "slugify"
import {  deleteOne, getAll, getOne } from "../../utiles/handlerFactory.js"

const createProduct =catchError (async(req,res)=>{
    req.body.slug = slugify(req.body.Title)
    req.body.imgCover = req.files.imgCover[0].filename
    req.body.imgs = req.files.imgs.map(obj=>obj.filename)
  let mongooseQuery =  new ProductModel(req.body)
  await  mongooseQuery.save()
  res.json({msg : 'success',mongooseQuery})
})


const UpdateProduct =catchError (async(req,res,next)=>{
  const {id}= req.params 
  if (req.body.Title) req.body.slug = slugify(req.body.Title)
  let result =await ProductModel.findByIdAndUpdate(id,req.body,{new:true})
!result && next(new generateError('doc not found', 404 ))
result && res.json({msg : 'success',result})
})

const getAllProduct =getAll(ProductModel)
const getOneProduct =getOne(ProductModel)
const deleteProduct =deleteOne(ProductModel)

  export{
    createProduct,getAllProduct,getOneProduct,UpdateProduct,deleteProduct
  }