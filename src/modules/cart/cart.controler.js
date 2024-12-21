import { generateError } from "../../utiles/generateError.js"
import { catchError } from "../../utiles/catchError.js"
import { cartModel } from "../../../database/models/cart.model.js"
import { ProductModel } from "../../../database/models/Products.model.js"
import { CouponModel } from "../../../database/models/Coupon.model.js";
import {  deleteOne } from "../../utiles/handlerFactory.js";


function calcTotalPrice(cart) {
  let totalPrice = 0;
  cart.items.forEach((element) => {
    totalPrice += (element.quantity || 0) * (element.price || 0);  
  });
  cart.ToTalPrice = totalPrice;
}

const addProductToCart = catchError(async (req, res, next) => {
  let product = await ProductModel.findById(req.body.product);
  if (!product) {
    return next(new generateError('Product not found'));
  }
  req.body.price = product.Price;
  let isExistCart = await cartModel.findOne({ user: req.user._id });
  if (!isExistCart) {
    let cart = new cartModel({
      user: req.user._id,
      items: [req.body],
      ToTalPrice:0,  // Initialize ToTalPrice
      ToTalPriceAfterDiscount: 0, // Initialize ToTalPriceAfterDiscount
       Discount: 0, // Assuming no discount initially
    });
    calcTotalPrice(cart);
    await cart.save();
    cart = await cart.populate({
      path: 'user',   
      select: 'name', 
  })
    return res.json({ msg: 'Success', cart });
  }
  let item = isExistCart.items.find((elm) => elm.product.toString() === req.body.product);
  if (item) {
    // If product exists, increase the quantity and adjust the price accordingly
    item.quantity += 1;
    item.price = (item.quantity * product.Price || 1) ; // Update price based on new quantity
  } else {
    // Otherwise, add the new product to the cart
    req.body.price = product.Price;
    isExistCart.items.push(req.body);
  }

  // Recalculate the total price of the cart
  calcTotalPrice(isExistCart);

  // If a discount exists, apply it to the total price
  if (isExistCart.Discount) {
    isExistCart.ToTalPriceAfterDiscount =
      isExistCart.ToTalPrice - (isExistCart.ToTalPrice * isExistCart.Discount) / 100;
  }

  // Save the updated cart
  await isExistCart.save();

  // Populate the user field and return the updated cart
  isExistCart = await isExistCart.populate({
    path: 'user',   
    select: 'name', 
})
  return res.json({ status: 'Success', cart: isExistCart });
});


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
   

const applyCoupon = catchError(async (req, res) => {
      let Coupon = await CouponModel.findOne({ code: req.body.code, expires: { $gt: Date.now() } });
      let cart = await cartModel.findOne({ user:req.user._id });
      if (!Coupon) {
        return res.status(400).json({ msg: 'Coupon is invalid or expired' });
      }
      if (!cart) {
        return res.status(400).json({ msg: 'Cart not found for this user' });
      }
      cart.ToTalPriceAfterDiscount = cart.ToTalPrice - (cart.ToTalPrice * Coupon.Discount) / 100;
      cart.Discount = Coupon.Discount;
      await cart.save();
      res.status(201).json({ status: 'Success', cart });
    });
    

  const GetCart =catchError (async(req,res)=>{
    // const {id}= req.params 
    let cart =await cartModel.findOne({user : req.user._id})
     res.status(201).json({ msg:'success', cart })
  })

  const ClearUserCart =deleteOne(cartModel)

  export{
    ClearUserCart , removeProductFromCart,addProductToCart
    ,updateQuantity, applyCoupon ,GetCart
  }