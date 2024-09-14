import { CategoryModel } from "../../../database/models/Category.model.js"
import { generateError } from "../../utiles/generateError.js"
import { ApiFeature } from "../../utiles/apiFeatures.js"
import { catchError } from "../../utiles/catchError.js"
import slugify from "slugify"

const createCategory =catchError (async(req,res)=>{
  req.body.slug= slugify( req.body.name)
  req.body.imgs = req.file.filename 
  let result =  new CategoryModel(req.body)
  await result.save()
  res.json({msg : 'success',result})
})

const getAllCategory =catchError (async(req,res,next)=>{

  let apiFeature = new ApiFeature(CategoryModel.find(),req.query).paginate()
  .selectFields().filterByKeyword().sortBy().Search()
  // execute
    let result = await apiFeature.mongooseQuery
    res.json({msg : 'success',page : apiFeature.page ,result})
})


const getOneCategory =catchError (async(req,res,next)=>{
    const {id}= req.params 
    let result =await CategoryModel.findById(id)
    !result && next(new generateError('not found'),404)
    result && res.json({msg : 'success',result})
  })

  const UpdateCategory =catchError (async(req,res,next)=>{
    const {id}= req.params 
    req.body.slug= slugify( req.body.name)
    req.body.imgs = req.file.filename 
    let result =await CategoryModel.findByIdAndUpdate(id, req.body ,{new:true})
    !result && next(new generateError('not found'),404)
    result && res.json({msg : 'success',result})
  })

  const deleteCategory =catchError (async(req,res,next)=>{
    const {id}= req.params 
    let result =await CategoryModel.findByIdAndDelete(id)
    !result && next(new generateError('not found'),404)
    result && res.json({msg : 'success',result})
  })

  export{
    createCategory,getAllCategory,getOneCategory,UpdateCategory,deleteCategory
  }