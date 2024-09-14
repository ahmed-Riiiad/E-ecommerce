import { generateError } from "../../utiles/generateError.js"
import { catchError } from "../../utiles/catchError.js"
import { cartModel } from "../../../database/models/cart.model.js"
import { ProductModel } from "../../../database/models/Products.model.js"
import { CouponModel } from "../../../database/models/Coupon.model.js";


 function calcTotalPrice (cart){
  let TotalPrice = 0;
  cart.items.forEach(element => {
    TotalPrice += element.quantity * element.price
  });
  cart.ToTalPrice = TotalPrice
}
const addProductToCart =catchError (async(req,res,next)=>{
  let product =await ProductModel.findById(req.body.product)
  if(!product){return next(new generateError('product not found'))}
  req.body.price = product.price
  let isExistCart = await cartModel.findOne({user : req.user._id})
  if(!isExistCart){
    let cart =  new cartModel({
      user : req.user._id,
      items : [req.body]
    })
    calcTotalPrice (cart)
    await result.save()
    res.json({ msg : 'success', cart })
  }

  let item = isExistCart.items.find((elm)=>elm.product==req.body.product)
  if (item){
    item.quantity += 1
  }else{
    isExistCart.items.push(req.body)
  }
  
  calcTotalPrice (isExistCart)
  if(isExistCart.Discount){
  isExistCart.ToTalPriceAfterDiscount = isExistCart.ToTalPrice - (isExistCart.ToTalPrice*isExistCart.Discount)/100
  }

  await isExistCart.save()
  res.json({msg : 'success', cart : isExistCart })
  }
)

const removeProductFromCart =catchError (async(req,res)=>{
  let result =  await cartModel
  .findOneAndUpdate({user : req.user._id},{$pull:{items : {_id:req.params.id}}},{new:true})
!result && next(new generateError('not found',404))
calcTotalPrice (result)
if(result.Discount){
  result.ToTalPriceAfterDiscount = result.ToTalPrice - (result.ToTalPrice*result.Discount)/100
  }
    result && res.json({msg : 'success',cart: result})
  })
  
  const updateQuantity =catchError (async(req,res)=>{
    let product =await ProductModel.findById(req.params.id)
    if(!product){return next(new generateError('product not found'))}
    let isExistCart = await cartModel.findOne({user : req.user._id})
    let item = isExistCart.items.find((elm)=>elm.product==req.params.id)
    if (item){
      item.quantity = req.body.quantity
    }
    calcTotalPrice (isExistCart)
if(isExistCart.Discount){
  isExistCart.ToTalPriceAfterDiscount = isExistCart.ToTalPrice - (isExistCart.ToTalPrice*isExistCart.Discount)/100
  }
    await isExistCart.save()
    res.json({msg : 'success', cart : isExistCart })
    })
   

  const applyCoupon =catchError (async(req,res)=>{

    let Coupon =await CouponModel.findOne({code:req.body.code,expires:{$gt:Date.now()}})
    let cart =await cartModel.findOne({user:req.body._id})
    cart.ToTalPriceAfterDiscount = cart.ToTalPrice - (cart.ToTalPrice * Coupon.Discount)/100
    cart.Discount = Coupon.Discount
    await cart.save()
     res.status(201).json({msg:success,cart})
  })

  const GetCart =catchError (async(req,res)=>{

    let cart =await cartModel.findOne({user:req.body._id}).populate(items.product)
    
     res.status(201).json({ msg:success, cart })
  })

  const ClearUserCart =catchError (async(req,res)=>{
    const {id}= req.params 
    let result =await cartModel.findByIdAndDelete(id)
    !result && next(new generateError('not found',404))
    result && res.json({msg : 'success',result})
  })


  export{
    ClearUserCart , removeProductFromCart,addProductToCart
    ,updateQuantity, applyCoupon ,GetCart
  }