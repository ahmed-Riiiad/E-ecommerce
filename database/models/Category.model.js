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

CategorySchema.post('init',(doc)=>{
    doc.imgs= process.env.Base_Url +"/category/"+ doc.imgs
})


export const CategoryModel = Mongoose.model('Category',CategorySchema)