import { generateError } from "../../utiles/generateError.js"
import { catchError } from "../../utiles/catchError.js"
import { userModel } from "../../../database/models/user.model.js"

const addToWishList =catchError (async(req,res)=>{
    const {product} = req.body
  let result =  await userModel.findByIdAndUpdate(req.user._id,{$addToSet:{wishList : product}},{new:true})
  !result && next(new generateError('not found',404))
    result && res.json({msg : 'success', result:result.wishList})
})

const removeFromWishList =catchError (async(req,res)=>{
  const {product} = req.body
let result =  await userModel.findByIdAndUpdate(req.user._id,{$pull:{wishList : product}},{new:true})
!result && next(new generateError('not found',404))
  result && res.json({msg : 'success', result:result.wishList})
})

const getAllUserWishList =catchError (async(req,res)=>{
let result =  await userModel.findOne({_id : req.user._id}).populate('wishList')
!result && next(new generateError('not found',404))
  result && res.json({msg : 'success', result:result.wishList})
})


  export{
    addToWishList,removeFromWishList,getAllUserWishList
  }