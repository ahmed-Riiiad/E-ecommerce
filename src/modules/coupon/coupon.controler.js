import { CouponModel } from "../../../database/models/Coupon.model.js"
import { generateError } from "../../utiles/generateError.js"
import { catchError } from "../../utiles/catchError.js"
import QRCode  from "qrcode"
import { UpdateModel,  deleteOne, getAll } from "../../utiles/handlerFactory.js"

const createCoupon=catchError (async(req,res)=>{
  const { code, Discount, expires } = req.body;
  if (!code || !Discount || !expires) {
    return next(new generateError('Missing required fields', 400));
  }
  const existingCoupon = await CouponModel.findOne({ code });
  if (existingCoupon) {
    return next(new generateError('Coupon code already exists', 400));
  }
  const newCoupon = new CouponModel({
    code,
    Discount,
    expires,
  });
  await newCoupon.save();
  res.status(201).json({
    status: 'success',
    message: 'Coupon created successfully',
    coupon: newCoupon,
  });
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