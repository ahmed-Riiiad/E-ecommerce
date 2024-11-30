import mongoose from "mongoose"


 const CouponSchema = mongoose.Schema(
    {
        code:{
            type:String,
            required:true ,
            trim:true,
            unique : true
        },
        Discount:{
        type: Number,
        required:true ,
        min : 0
     },
     expires:{
        type: Date,
        required :true 
     }

    }, {
        timestamps: true,
    }
)
export const CouponModel = mongoose.model('Coupon',CouponSchema)