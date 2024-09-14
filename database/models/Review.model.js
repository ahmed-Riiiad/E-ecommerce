import Mongoose from "mongoose"


 const ReviewSchema = Mongoose.Schema(
    {
        Comment:{
            type:String,
            require:true ,
            trim:[true],
            minlength:[2]
        },
        Product:{
        type: Mongoose.Types.ObjectId,
       ref : 'Product'
     },
     user:{
        type: Mongoose.Types.ObjectId,
       ref : 'user'
     },
     ratings: {
        type: Number,
        min : 0 ,
        max : 5
     }

    }, {
        timestamps: true,
    }
)


ReviewSchema.pre(/^find/,function(){
    this.populate('user','name -_id')
})

export const ReviewModel = Mongoose.model('Review',ReviewSchema)