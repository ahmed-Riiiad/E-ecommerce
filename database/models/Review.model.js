import Mongoose from "mongoose"
import { ProductModel } from "./Products.model.js"


 const ReviewSchema = Mongoose.Schema(
    {
    Comment:{
            type:String,
            required:[true , 'Comment Can’t be empty'] ,
            trim:[true],
            minlength:[2]
        },
    product:{
        type: Mongoose.Types.ObjectId,
        ref : 'Product',
        required:[true , 'Review must Belong To a product'] 
        },
    user:{
        type: Mongoose.Types.ObjectId,
        ref : 'user',
        required:[true , 'Review must Belong To a User'] 
        },
    ratings: {
        type: Number,
        min : 1 ,
        max : 5
        },
    createdAt : {
        type : Date ,
        default : Date.now()
        }

    }, {
        timestamps: true , toJSON:{virtuals:true } , toObject:{virtuals:true }
    }
)


// ReviewSchema.index({product: 1 , user : 1} , { unique : true})

ReviewSchema.pre(/^find/,function(next){
    this.populate({
             path : 'user',
             select : 'name photo'
         })
    next()
})



ReviewSchema.statics.calcAverageRating = async function(productId){
    const stats = await this.aggregate([
        {
          $match :{product : productId}
        },
        {
          $group  : {    
            _id : 'product' ,
            numRating : {$sum : 1} ,
            avgRating : {$avg : '$rating'}
          }
        }, 
    ])
    if(stats.length > 0){
        await ProductModel.findByIdAndUpdate(productId , {
            ratingAverage : stats[0]. avgRating ,
            ratingQuantity :stats[0].numRating
        })              

    }else{
        await ProductModel.findByIdAndUpdate(productId , {
            ratingAverage : 4.5,
            ratingQuantity :0
        })  
    }
   
}

ReviewSchema.post('save',function(){
    //this point to current review
    this.constructor.calcAverageRating(this.product)
})

// update & Delete
ReviewSchema.pre(/^findOneAnd/, async function (next) {
    // Only fetch the document if it's not already fetched
    if (!this._conditions) {
        return next();
    }

    // Access the document only if the query was executed
    this.review = await this.model.findOne(this._conditions);
    next();
});



ReviewSchema.post(/^findOneAnd/, async function () {
    if (this.review) {
        await this.review.constructor.calcAverageRating(this.review.product);
    }
});


export const ReviewModel = Mongoose.model('Review',ReviewSchema)
