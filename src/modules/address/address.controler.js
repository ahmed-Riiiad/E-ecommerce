import { generateError } from "../../utiles/generateError.js"
import { catchError } from "../../utiles/catchError.js"
import { userModel } from "../../../database/models/user.model.js"

const addAddress =catchError (async(req,res)=>{
  let result =  await userModel
  .findByIdAndUpdate(req.user._id,{$addToSet:{address : req.body}},{new:true})
  !result && next(new generateError('not found',404))
    result && res.json({msg : 'success', result:result.wishList})
})

const removeAddress =catchError (async(req,res)=>{
let result =  await userModel
.findByIdAndUpdate(req.user._id,{$pull:{address : {_id:req.body.address}}},{new:true})
!result && next(new generateError('not found',404))
  result && res.json({msg : 'success', result:result.address})
})

const getAddress =catchError (async(req,res)=>{
  let result =  await userModel.findOne({_id : req.user._id})
  !result && next(new generateError('not found',404))
    result && res.json({msg : 'success', result:result.address})
  })




  export{
    addAddress,removeAddress,getAddress
  }