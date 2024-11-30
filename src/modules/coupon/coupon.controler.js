import { CouponModel } from "../../../database/models/Coupon.model.js"
import { generateError } from "../../utiles/generateError.js"
import { ApiFeature } from "../../utiles/apiFeatures.js"
import { catchError } from "../../utiles/catchError.js"
import QRCode  from "qrcode"
import { UpdateModel,  deleteOne, getAll } from "../../utiles/handlerFactory.js"

const createCoupon=catchError (async(req,res)=>{
  let result =  new CouponModel(req.body)
  await result.save()
  res.json({ msg : 'success', result })
})

const getOneCoupon =catchError (async(req,res,next)=>{
    const {id}= req.params 
    let result =await CouponModel.findById(id)
    let Url =await QRCode.toDataURL(result.code)
    !result && next(new generateError('not found',404))
    result && res.json({msg : 'success',result,Url})
  })
  
  const getAllCoupon=getAll(CouponModel)
  const UpdateCoupon =UpdateModel(CouponModel)
  const deleteCoupon =deleteOne(CouponModel)

  export{
    createCoupon,getAllCoupon,getOneCoupon,UpdateCoupon,deleteCoupon
  }