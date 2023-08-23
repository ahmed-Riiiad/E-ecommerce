import { BrandModel } from "../../../database/models/Brands.model.js"
import { generateError } from "../../utiles/generateError.js"
import { ApiFeature } from "../../utiles/apiFeatures.js"
import { catchError } from "../../utiles/catchError.js"
import slugify from "slugify"

const createBrand =catchError  (async(req,res)=>{
    req.body.slug = slugify(req.body.name)
    req.body.logo = req.file.filename
  let result =  BrandModel(req.body)
  await result.save()
  res.json({msg : 'success',result})
})

const getAllBrand =catchError (async(req,res,next)=>{
  let apiFeature = new ApiFeature(BrandModel.find(),req.query).paginate()
  .selectFields().filterByKeyword().sortBy()
  // execute
    let result = await apiFeature.mongooseQuery
    res.json({msg : 'success',page : apiFeature.page ,result})
})


const getOneBrand =catchError (async(req,res,next)=>{
    const {id}= req.params 
    let result =await BrandModel.findById(id)
    !result && next(new generateError('not found',404))
    result && res.json({msg : 'success',result})
  })

  const UpdateBrand =catchError (async(req,res,next)=>{
    const {id}= req.params 
    const {name} = req.body
    let result =await BrandModel.findByIdAndUpdate(id,{ name,slug: slugify(name)},{new:true})
    !result && next(new generateError('not found',404))
    result && res.json({msg : 'success',result})
  })

  const deleteBrand =catchError (async(req,res,next)=>{
    const {id}= req.params 
    let result =await BrandModel.findByIdAndDelete(id)
    !result && next(new generateError('not found',404))
    result && res.json({msg : 'success',result})
  })

  export{
    createBrand,getAllBrand,getOneBrand,UpdateBrand,deleteBrand
  }