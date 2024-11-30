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
     await cartModel.findByIdAndDelete(req.params.id)
     res.status(201).json({msg:success , order })
     
    }else{
      return next(new generateError('not found',404))
    }
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
        unit_amount:ToTalOrderPrice * 100,
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

const createOnlineOrder =catchError(async(request, response) => {
  const sig = request.headers['stripe-signature'].toString();

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, 'whsec_tLXVzmLYXjqwuhBPXeN6I4Vpz47hJqs0');
  } catch (err) {
    return response.status(400).send(`Webhook Error: ${err.message}`);
    
  }

  // Handle the event
  if(event.type == 'checkout.session.completed' ){
    const checkoutSessionCompleted = event.data.object;
    console.log(`Create Order here`);

  }else{
    console.log(`Unhandled event type ${event.type}`);
    
  }
})
  
  export{
    createCashOrder,getSpecifiedOrder,getAllOrder,createCardOrder,createOnlineOrder
  }