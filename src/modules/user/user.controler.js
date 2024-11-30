import { generateError } from "../../utiles/generateError.js"
import { ApiFeature } from "../../utiles/apiFeatures.js"
import { catchError } from "../../utiles/catchError.js"
import {  deleteOne } from "../../utiles/handlerFactory.js"
import { userModel } from "../../../database/models/user.model.js"

const filterObj = (obj , ...allowedFiles) =>{
  const newObj = {}
  Object.keys(obj).forEach(element => {
    if(allowedFiles.includes(element)) newObj[element] = obj[element]
  });
  return newObj
}

const createUser =catchError (async(req,res)=>{
  let user = await userModel.findOne({email : req.body.email})
  if(user){
    return next(new generateError("account already exist",409))}
  let result =  new userModel(req.body)
  await result.save()
  res.json({Status : 'success',result})  
})

const getAllUser =catchError (async(req,res,next)=>{

  let apiFeature = new ApiFeature(userModel.find(),req.query).paginate()
  .selectFields().filterByKeyword().sortBy()
  // execute
    let result = await apiFeature.mongooseQuery
    res.json({Status : 'success',page : apiFeature.page ,result})
})


const getOneUser =catchError (async(req,res,next)=>{
    const {id}= req.params 
    let result =await userModel.findById(id)
    !result && next(new generateError('not found',404))
    result && res.json({Status : 'success',result})
  })

  const UpdateUser =catchError (async(req,res,next)=>{
    // 1- create err if posted password 
    if (req.body.password){
      return next(new generateError('not authorized to change pass here',400))
    } 
    // 2- filter out unwanted filed like change role 
    const filterReqBody = filterObj(req.body,'name','email')
    // 3- update user doc 
    let result =await userModel.findByIdAndUpdate(req.user.id, filterReqBody ,{new:true})
    !result && next(new generateError('not found',404))
    result && res.json({Status : 'success',result})
  })

  const changePass =catchError (async(req,res,next)=>{
    const {id}= req.params 
    req.body.passwordChangeAT = Date.now()
    let result =await userModel.findByIdAndUpdate(id,req.body,{new:true})
    !result && next(new generateError('not found',404))
    result && res.json({Status : 'success',result})
  })

  const deleteUser = deleteOne(userModel)

  const UnActiveUser = catchError(async(req,res,next)=>{
    let result =await userModel.findByIdAndUpdate(req.user.id,{active : false} )
    res.Status(204).json({Status : 'success', result : null })
  })

  export{
    createUser,getAllUser,getOneUser,UpdateUser,deleteUser,changePass,UnActiveUser
  }