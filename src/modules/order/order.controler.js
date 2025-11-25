import { generateError } from "../../utiles/generateError.js"
import { catchError } from "../../utiles/catchError.js"
import { cartModel } from "../../../database/models/cart.model.js"
import { orderModel } from "../../../database/models/order.model .js";
import { ProductModel } from "../../../database/models/Products.model.js";
import { getAll } from "../../utiles/handlerFactory.js";
import Stripe from 'stripe';
import { userModel } from "../../../database/models/user.model.js";

const stripe = new Stripe("sk_test_51NgtZqCEumfOCBvQ04dmbvhIelfdV6WaimfNeMkFpaxU67n5gOO02rQmK0H80QvyYJsstlmb4pD5uk44PRMXzbxH0029fxWMgM");

const createCashOrder = catchError(async (req, res, next) => {
  // Find the cart by its ID
  const cart = await cartModel.findById(req.params.id);
  if (!cart) return next(new generateError('Cart not found', 404)); // Handle missing cart

  // Calculate total order price, accounting for possible discount
  const ToTalOrderPrice = cart.ToTalPriceAfterDiscount ? cart.ToTalPriceAfterDiscount : cart.ToTalPrice;

  const order = new orderModel({
    user: req.user._id,  
    ToTalOrderPrice,    
    shippingAddress: req.body.shippingAddress, 
    items: cart.items,   
    paymentMethod: req.body.paymentMethod || 'cash',  
  });
  await order.save();
  if (order) {
    // Prepare bulk update options to decrease product quantities and increase sold quantities
    let options = cart.items.map(item => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: item.quantity } },
      },
    }));
    await ProductModel.bulkWrite(options);

    // Delete the cart after the order has been successfully created
    await cartModel.findByIdAndDelete(req.params.id);
    return res.status(201).json({ msg: 'Success', order });
  } else {
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
  const ToTalOrderPrice = cart.ToTalPriceAfterDiscount ?cart.ToTalPriceAfterDiscount:cart.ToTalPrice

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
    success_url:`${process.env.BASE_URL}/Api/v1/orders`,
    cancel_url:`${process.env.BASE_URL}`,
    customer_email : req.user.email ,
    client_reference_id : req.params.id ,
    metadata : req.body.shippingAddress

   })

   return res.status(200).json({ status: 'Success', session });
})

const createOnlineOrder = catchError(async (request, response, next) => {
  console.log('Webhook received');
  const sig = request.headers['stripe-signature'].toString();
  const endPoint = 'whsec_tLXVzmLYXjqwuhBPXeN6I4Vpz47hJqs0'
  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endPoint);
    console.log('Received webhook:', request.body);
    console.log('Stripe signature:', sig);
  } catch (err) {
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

// Handle the checkout session completion event
if (event.type === "checkout.session.completed") {
  let e = event.data.object;
  let cart = await cartModel.findById(e.client_reference_id);
  let user = await userModel.findOne({ email: e.customer_email });

  // Check if the cart has items
  if (cart.item[0]) {
      // Create a new order with the event data
      let order = new orderModel({
          user: user,
          items: cart.items,
          shippingAddress: e.metadata.shippingAddress,
          ToTalOrderPrice: e.amount_total / 100,
          paymentMethod: 'card',
          isPaid: true,
          paidAt: Date.now()
      });

      // Adjust total price if there's a discount
      if (cart.ToTalPriceAfterDiscount) {
          order.ToTalOrderPrice = cart.ToTalPriceAfterDiscount;
      }

      // Save the order to the database
      await order.save();

      // Update product quantities and sold counts in bulk
      if (order) {
          let option = cart.item.filter(item => item.quantity > 0).map((item) => ({
              updateOne: {
                  filter: { _id: item.product },
                  update: { $inc: { quantity: -item.quantity, sold: item.quantity } }
              }
          }));
          await ProductModel.bulkWrite(option);
      }

      // Clear the cart items
      await cartModel.findOneAndUpdate({ user: user._id }, { $set: { 'item': [] } }, { new: true });

      // Respond with success message and the created order
      return res.status(200).json({
          status: 'success',
          message: 'online payment created successfully',
          data: order
      });
  }

  // If cart is empty, pass an error to the next middleware
  next(new AppError('cart is empty!!!', 404));
} else {
  console.log(`Unhandled event type ${event.type}`);
}
});

async function card(checkoutSessionCompleted, res, next) {
  console.log('Client Reference ID:', checkoutSessionCompleted.client_reference_id);
  
  // Find the cart using the client reference ID
  const cart = await cartModel.findById(checkoutSessionCompleted.client_reference_id);
  if (!cart) {
    console.log('Cart not found for ID:', checkoutSessionCompleted.client_reference_id);
    return next(new generateError('Cart not found', 404));
  }

  // Find the user using the email from the session
  let user = await userModel.findOne({ email: checkoutSessionCompleted.email });
  console.log('User found:', user);

  // Create a new order
  const order = new orderModel({
    user: user._id,
    total_price: checkoutSessionCompleted.amount_total / 100,  // Assuming the amount is in cents
    shippingAddress: checkoutSessionCompleted.metadata.shippingAddress,
    items: cart.items,
    paymentMethod: 'card',
    isPaid: true,
    paidAt: Date.now(),
  });

  try {
    await order.save();
    console.log('Order saved successfully');
  } catch (err) {
    console.log('Error saving order:', err);
    return next(new generateError('Error saving order', 500));
  }

  if (order) {
    const options = cart.items.map(item => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: item.quantity } },
      }
    }));

    try {
      await ProductModel.bulkWrite(options);
      await cartModel.findByIdAndDelete(cart._id);  // Use the cart's _id to delete it
      return res.status(200).json({ status: 'Success', order });
    } catch (err) {
      console.log('Error updating products or deleting cart:', err);
      return next(new generateError('Error processing order', 500));
    }
  } else {
    return next(new generateError('Order creation failed', 500));
  }
}

  
  export{
    createCashOrder,getSpecifiedOrder,getAllOrder,createSessionOrder,createOnlineOrder
  }