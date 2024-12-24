import { generateError } from "../../utiles/generateError.js"
import { catchError } from "../../utiles/catchError.js"
import { userModel } from "../../../database/models/user.model.js"

const addToWishList = catchError(async (req, res, next) => {
  const { product } = req.body;
  const user = await userModel.findById(req.user._id);
  if (!user) {
    return next(new generateError('User not found', 404));
  }
  if (user.wishList && user.wishList.includes(product)) {
    return res.status(400).json({ msg: 'Product already in wish list' });
  }
  const result = await userModel.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { wishList: product } },
    { new: true }
  );
  if (!result) {
    return next(new generateError('Update failed', 400));
  }
  res.json({ msg: 'Success', result:result.wishList });
});


const removeFromWishList =catchError (async(req,res)=>{
  const {product} = req.body
let result =  await userModel.findByIdAndUpdate(req.user._id,{$pull:{wishList : product}},{new:true})
!result && next(new generateError('not found',404))
  result && res.json({msg : 'success', result:result.wishList})
})

const getUserWishList =catchError (async(req,res)=>{
let result =  await userModel.findOne({_id : req.user._id}).populate({
  path: 'wishList',   
  select: 'name', 
})
!result && next(new generateError('not found',404))
  result && res.json({status : 'success', result:result.wishList})
})


  export{
    addToWishList,removeFromWishList,getUserWishList
  }