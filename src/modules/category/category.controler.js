import { CategoryModel } from "../../../database/models/Category.model.js"
import { generateError } from "../../utiles/generateError.js"
import { ApiFeature } from "../../utiles/apiFeatures.js"
import { catchError } from "../../utiles/catchError.js"
import slugify from "slugify"

const createCategory =catchError (async(req,res)=>{
    const {name} = req.body
  let result =  new CategoryModel({name,slug : slugify(name)})
  await result.save()
  res.json({msg : 'success',result})
})

const getAllCategory =catchError (async(req,res,next)=>{

  let apiFeature = new ApiFeature(CategoryModel.find(),req.query).paginate()
  .selectFields().filterByKeyword().sortBy()
  // execute
    let result = await apiFeature.mongooseQuery
    res.json({msg : 'success',page : apiFeature.page ,result})
})


const getOneCategory =catchError (async(req,res,next)=>{
    const {id}= req.params 
    let result =await CategoryModel.findById(id)
    !result && next(new generateError('not found',404))
    result && res.json({msg : 'success',result})
  })

  const UpdateCategory =catchError (async(req,res,next)=>{
    const {id}= req.params 
    const {name} = req.body
    let result =await CategoryModel.findByIdAndUpdate(id,{ name,slug: slugify(name)},{new:true})
    !result && next(new generateError('not found',404))
    result && res.json({msg : 'success',result})
  })

  const deleteCategory =catchError (async(req,res,next)=>{
    const {id}= req.params 
    let result =await CategoryModel.findByIdAndDelete(id)
    !result && next(new generateError('not found',404))
    result && res.json({msg : 'success',result})
  })

  export{
    createCategory,getAllCategory,getOneCategory,UpdateCategory,deleteCategory
  }