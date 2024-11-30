import { CategoryModel } from "../../../database/models/Category.model.js"
import { generateError } from "../../utiles/generateError.js"
import { catchError } from "../../utiles/catchError.js"
import slugify from "slugify"
import { deleteOne, getAll, getOne } from "../../utiles/handlerFactory.js"

const createCategory =catchError (async(req,res)=>{
  req.body.slug= slugify( req.body.name)
  req.body.imgs = req.file.filename 
  let result =  new CategoryModel(req.body)
  await result.save()
  res.json({msg : 'success',result})
})


const UpdateCategory =catchError (async(req,res,next)=>{
  const {id}= req.params 
  req.body.slug= slugify( req.body.name)
  req.body.imgs = req.file.filename 
  let result =await CategoryModel.findByIdAndUpdate(id, req.body ,{new:true})
  !result && next(new generateError('not found'),404)
  result && res.json({msg : 'success',result})
})

const getAllCategory =getAll(CategoryModel)
const getOneCategory =getOne(CategoryModel)
const deleteCategory = deleteOne(CategoryModel)

  export{
    createCategory,getAllCategory,getOneCategory,UpdateCategory,deleteCategory
  }