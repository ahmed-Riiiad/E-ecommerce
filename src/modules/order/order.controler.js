import { generateError } from "../../utiles/generateError.js"
import { catchError } from "../../utiles/catchError.js"
import { cartModel } from "../../../database/models/cart.model.js"
import { orderModel } from "../../../database/models/order.model .js";
import { ProductModel } from "../../../database/models/Products.model.js";
import Stripe from 'stripe';
const stripe = new Stripe(process.env.stripeSecretKey);


const createCashOrder =catchError (async(req,res,next)=>{
    const cart = await cartModel.findById(req.params.id)
    const ToTalOrderPrice = cart.ToTalPriceAfterDiscount ?
    cart.ToTalPriceAfterDiscount:cart.ToTalPrice
    const order = new orderModel({
      user : req.user._id ,
      total_price : ToTalOrderPrice ,
      shippingAddress : req.body.shippingAddress,
      items : cart.items,
      paymentMethod : req.body.paymentMethod
    })
    await order.save()

    if(order){
      let Options = cart.items.map(item=>({
        updateOne: {
          filter:{ _id: item.product },
          update  :{ $inc:{quantity:-item.quantity,sold:item.quantity} }}
        
      
      }))
     await ProductModel.bulkWrite(Options)
    }

await cartModel.findByIdAndDelete(req.params.id)
})

const getSpecifiedOrder =catchError (async(req,res,next)=>{
  let order = await orderModel.findOne({user : req.user._id}).populate('items.product')
  res.status(200).json({msg:success}, order )
})

const getAllOrder =catchError (async(req,res,next)=>{
  let orders = await orderModel.findOne({}).populate('items.product')
  res.status(200).json({msg:success}, orders )
})


const createCardOrder =catchError (async(req,res,next)=>{
  const cart = await cartModel.findById(req.params.id)
  const ToTalOrderPrice = cart.ToTalPriceAfterDiscount ?
  cart.ToTalPriceAfterDiscount:cart.ToTalPrice

   let session = await stripe.checkout.sessions.create({

    line_items:[
      {price_data:{
        currency:'egp',
        unit_amount:(ToTalOrderPrice*100),
        product_data:{name:req.params.id}
      },
    quantity:1}
    ],
    mode:"payment",
   // success_url:`${process.env.FRONTEND}/thankyou`,
   // cancel_url:`${process.env.FRONTEND}`,
    customer_email : req.user.email ,
    client_reference_id : req.params.id ,
    metadata : req.body.shippingAddress

   })

   res.json({msg : success}, session)
})
  
  export{
    createCashOrder,getSpecifiedOrder,getAllOrder
  }