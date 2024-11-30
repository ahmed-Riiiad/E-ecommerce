import { SubCategoryModel } from "../../../database/models/SubCategory.model.js"
import { generateError } from "../../utiles/generateError.js"
import { catchError } from "../../utiles/catchError.js"
import slugify from "slugify"
import { deleteOne, getOne } from "../../utiles/handlerFactory.js"

const createSubCategory =catchError (async(req,res)=>{
    const {name,category} = req.body
  let result = new SubCategoryModel({name,category,slug : slugify(name)})
 await result.save()
  res.json({msg : 'success',result})
})

const getAllSubCategory =catchError (async(req,res,next)=>{
    let filter = {}
    if(req.params.categoryId){
        filter = {category:req.params.categoryId}
    }
  let result =await SubCategoryModel.find(filter)
  res.json({msg : 'success',result})
})



const UpdateSubCategory =catchError (async(req,res,next)=>{
  const {id}= req.params 
  const {name,category} = req.body
  let result =await SubCategoryModel.findByIdAndUpdate(id,{ name,category,slug: slugify(name)},{new:true})
  !result && next(new generateError('not found',404))
  result && res.json({msg : 'success',result})
})

const getOneSubCategory =getOne(SubCategoryModel)
const deleteSubCategory =deleteOne(SubCategoryModel)
export {
  createSubCategory,getAllSubCategory,getOneSubCategory,UpdateSubCategory,deleteSubCategory
  }