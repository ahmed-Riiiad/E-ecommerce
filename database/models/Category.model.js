import Mongoose from "mongoose"


 const CategorySchema = Mongoose.Schema(
    {
        name:{
            type:String,
            require:true,
            unique : [true,'category already exist']  ,
            trim:[true],
            minlength:[2]
        },
     slug:{
        type: String,
        require:true,
        lowercase:true
        
     },
        imgs:String

    }, {
        timestamps: true,
    }
)
export const CategoryModel = Mongoose.model('Category',CategorySchema)