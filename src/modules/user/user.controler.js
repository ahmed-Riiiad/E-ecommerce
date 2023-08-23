import { CategoryModel } from "../../../database/models/Category.model.js"
import { generateError } from "../../utiles/generateError.js"
import { ApiFeature } from "../../utiles/apiFeatures.js"
import { catchError } from "../../utiles/catchError.js"
import slugify from "slugify"

const createUser =catchError (async(req,res)=>{
  let user = await userModel.findOne({email : req.body.email})
  if(user){
    return next(new generateError("account already exist",409))}
  let result =  new userModel(req.body)
  await result.save()
  res.json({msg : 'success',result})  
})

const getAllUser =catchError (async(req,res,next)=>{

  let apiFeature = new ApiFeature(userModel.find(),req.query).paginate()
  .selectFields().filterByKeyword().sortBy()
  // execute
    let result = await apiFeature.mongooseQuery
    res.json({msg : 'success',page : apiFeature.page ,result})
})


const getOneUser =catchError (async(req,res,next)=>{
    const {id}= req.params 
    let result =await userModel.findById(id)
    !result && next(new generateError('not found',404))
    result && res.json({msg : 'success',result})
  })

  const UpdateUser =catchError (async(req,res,next)=>{
    const {id}= req.params 
    let result =await userModel.findByIdAndUpdate(id,req.body,{new:true})
    !result && next(new generateError('not found',404))
    result && res.json({msg : 'success',result})
  })

  const changePass =catchError (async(req,res,next)=>{
    const {id}= req.params 
    let result =await userModel.findByIdAndUpdate(id,req.body,{new:true})
    !result && next(new generateError('not found',404))
    result && res.json({msg : 'success',result})
  })

  const deleteUser =catchError (async(req,res,next)=>{
    const {id}= req.params 
    let result =await userModel.findByIdAndDelete(id)
    !result && next(new generateError('not found',404))
    result && res.json({msg : 'success',result})
  })

  export{
    createUser,getAllUser,getOneUser,UpdateUser,deleteUser,changePass
  }