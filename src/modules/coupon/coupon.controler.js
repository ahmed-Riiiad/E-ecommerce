import { CouponModel } from "../../../database/models/Coupon.model.js"
import { generateError } from "../../utiles/generateError.js"
import { ApiFeature } from "../../utiles/apiFeatures.js"
import { catchError } from "../../utiles/catchError.js"
import QRCode  from "qrcode"

const createCoupon=catchError (async(req,res)=>{
  let result =  new CouponModel(req.body)
  await result.save()
  res.json({ msg : 'success', result })
})

const getAllCoupon=catchError (async(req,res,next)=>{

  let apiFeature = new ApiFeature(CouponModel.find(),req.query).paginate()
  .selectFields().filterByKeyword().sortBy()

  // execute
    let result = await apiFeature.mongooseQuery
    res.json({msg : 'success',page : apiFeature.page ,result})
})


const getOneCoupon =catchError (async(req,res,next)=>{
    const {id}= req.params 
    let result =await CouponModel.findById(id)
    let Url =await QRCode.toDataURL(result.code)
    !result && next(new generateError('not found',404))
    result && res.json({msg : 'success',result,Url})
  })

  const UpdateCoupon =catchError (async(req,res,next)=>{
    const {id}= req.params 
    let result =await CouponModel.findOneAndUpdate(id , req.body,{new:true})
    !result && next(new generateError('U are not authorize to update this Coupon',404))
    result && res.json({msg : 'success',result})
  })

  const deleteCoupon =catchError (async(req,res,next)=>{
    const {id}= req.params 
    let result =await CouponModel.findByIdAndDelete(id)
    !result && next(new generateError('not found',404))
    result && res.json({msg : 'success',result})
  })

  export{
    createCoupon,getAllCoupon,getOneCoupon,UpdateCoupon,deleteCoupon
  }