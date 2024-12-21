import { BrandModel } from "../../../database/models/Brands.model.js"
import { generateError } from "../../utiles/generateError.js"
import { catchError } from "../../utiles/catchError.js"
import slugify from "slugify"
import { deleteOne, getAll, getOne } from "../../utiles/handlerFactory.js"

const createBrand =catchError  (async(req,res)=>{
    req.body.slug = slugify(req.body.name)
    if(req.file){
      req.body.logo = req.file.filename
      console.log(req.file)
    }
  
  let result =  BrandModel(req.body)
  await result.save()
  res.json({msg : 'success',result})
})


const UpdateBrand =catchError (async(req,res,next)=>{
  const {id}= req.params 
  req.body.slug = slugify(req.body.name)
  req.body.logo = req.file.filename
  let result =await BrandModel.findByIdAndUpdate(id,req.body,{new:true})
  !result && next(new generateError('not found'),404)
  result && res.json({msg : 'success',result})
})

const getAllBrand =getAll(BrandModel)
const getOneBrand =getOne(BrandModel)
const deleteBrand =deleteOne(BrandModel)
export{
    createBrand,getAllBrand,getOneBrand,UpdateBrand,deleteBrand
  }