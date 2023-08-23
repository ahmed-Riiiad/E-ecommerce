import mongoose from "mongoose"

const orderSchema = mongoose.Schema(
    {
user :  { type:mongoose.Types.ObjectId , ref :'user' },
items:[{
        product : {type:mongoose.Types.ObjectId ,  ref:"product"}, 
        price : Number ,
        quantity:Number
        }],
ToTalOrderPrice : Number ,
shippingAddress :{ 
    street : String,
    city:String,
    phone : Number
},
paymentMethod:{
    Type : String,
    enum : ['card','cash'],
  //  default :'cash'
 },
isPaid : {
        type:Boolean,
        default:false
    },
isDelivered : {
            type:Boolean,
            default:false
        },
paidAt : Date ,
deliveredAT : Date

}, {timestamps: true })

export const orderModel = mongoose.model('order',orderSchema)