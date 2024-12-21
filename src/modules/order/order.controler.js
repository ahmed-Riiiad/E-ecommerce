import { generateError } from "../../utiles/generateError.js"
import { catchError } from "../../utiles/catchError.js"
import { cartModel } from "../../../database/models/cart.model.js"
import { orderModel } from "../../../database/models/order.model .js";
import { ProductModel } from "../../../database/models/Products.model.js";
import { getAll } from "../../utiles/handlerFactory.js";
import Stripe from 'stripe';

const stripe = new Stripe("sk_test_51NgtZqCEumfOCBvQ04dmbvhIelfdV6WaimfNeMkFpaxU67n5gOO02rQmK0H80QvyYJsstlmb4pD5uk44PRMXzbxH0029fxWMgM");

const createCashOrder = catchError(async (req, res, next) => {
  // Find the cart by its ID
  const cart = await cartModel.findById(req.params.id);
  if (!cart) return next(new generateError('Cart not found', 404)); // Handle missing cart

  // Calculate total order price, accounting for possible discount
  const ToTalOrderPrice = cart.ToTalPriceAfterDiscount ? cart.ToTalPriceAfterDiscount : cart.ToTalPrice;

  // Create a new order object
  const order = new orderModel({
    user: req.user._id,  // Get user from req.user
    ToTalOrderPrice,     // Use the calculated total price
    shippingAddress: req.body.shippingAddress, // From the request body
    items: cart.items,   // Use items from the cart
    paymentMethod: req.body.paymentMethod || 'cash',  // Default to 'cash' if not provided
  });

  // Save the order
  await order.save();

  if (order) {
    // Prepare bulk update options to decrease product quantities and increase sold quantities
    let options = cart.items.map(item => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: item.quantity } },
      },
    }));

    // Update product quantities in bulk
    await ProductModel.bulkWrite(options);

    // Delete the cart after the order has been successfully created
    await cartModel.findByIdAndDelete(req.params.id);

    // Respond with a success message and the created order
    return res.status(201).json({ msg: 'Success', order });
  } else {
    // If the order creation fails, return an error
    return next(new generateError('Failed to create order', 500));
  }
});


const getSpecifiedOrder =catchError (async(req,res,next)=>{
  let order = await orderModel.findOne({user : req.user._id})
  return res.status(200).json({ msg: 'Success', order });

})

const getAllOrder =getAll(orderModel)


const createSessionOrder =catchError (async(req,res,next)=>{
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
    success_url:`${process.env.Base_Url}/Api/v1`,
    cancel_url:`${process.env.Base_Url}`,
    customer_email : req.user.email ,
    client_reference_id : req.params.id ,
    metadata : req.body.shippingAddress

   })

   return res.status(200).json({ status: 'Success', session });
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
    card(checkoutSessionCompleted,res) 
    console.log(`Create Order here`);

  }else{
    console.log(`Unhandled event type ${event.type}`);
    
  }
})

async function card(e , res){
  const cart = await cartModel.findById(e.client_reference_id)
  if (!cart) return next(new generateError('not found',404))
   let user = await userModel.findOne({email : e.email})
  const order = new orderModel({
    user : user._id ,
    total_price : e.unit_amount/100 ,
    shippingAddress : e.metadata.shippingAddress,
    items : cart.items,
    paymentMethod : 'card',
    isPaid : true ,
    paidAt : Date.now()
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
   return res.status(200).json({ status: 'Success', order });
   
  }else{
    return next(new generateError('not found',404))
  }

}
  
  export{
    createCashOrder,getSpecifiedOrder,getAllOrder,createSessionOrder,createOnlineOrder
  }