import Mongoose from "mongoose"


 const SubCategorySchema = Mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            unique : [true,'SubCategory already exist']  ,
            trim:[true],
            minlength:[2]
        },
     slug:{
        type: String,
        required:true,
        lowercase:true
        
     },
        Category:{
            type:Mongoose.Types.ObjectId,
            ref:'Category'
        }

    }, {
        timestamps: true,
    }
)

export const SubCategoryModel = Mongoose.model('SubCategory',SubCategorySchema)