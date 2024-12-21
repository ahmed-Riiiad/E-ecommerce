import { generateError } from "../../utiles/generateError.js"
import { catchError } from "../../utiles/catchError.js"
import { userModel } from "../../../database/models/user.model.js"

const addAddress =catchError (async(req,res)=>{
  let result =  await userModel
  .findByIdAndUpdate(req.user._id,{$push:{addresses : req.body}},{new:true})
  !result && next(new generateError('not found',404))
    result && res.json({status : 'success', result : result.addresses})
})

const removeAddress =catchError (async(req,res)=>{
let result =  await userModel
.findByIdAndUpdate(req.user._id,{$pull:{addresses : {_id:req.body.addresses}}},{new:true})
!result && next(new generateError('not found',404))
  result && res.json({msg : 'success', result:result.addresses})
})

const getAddress =catchError (async(req,res)=>{
  let result =  await userModel.findOne({_id : req.user._id})
  !result && next(new generateError('not found',404))
    result && res.json({msg : 'success', result:result.addresses})
  })




  export{
    addAddress,removeAddress,getAddress
  }