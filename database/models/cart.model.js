import mongoose from "mongoose"

const cartSchema = mongoose.Schema(
    {
user :  {
            type:mongoose.Types.ObjectId ,
            ref:'user'
        },
items:[{
        product : {type:mongoose.Types.ObjectId ,  ref:"product"}, 
        price : Number ,
        quantity:{type :Number , default : 1}
        }],
ToTalPrice : Number ,
ToTalPriceAfterDiscount : Number , 
Discount : Number

    }, {timestamps: true,})

export const cartModel = mongoose.model('cart',cartSchema)