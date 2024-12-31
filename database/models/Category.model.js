import Mongoose from "mongoose"


 const CategorySchema = Mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            unique : [true,'category already exist']  ,
            trim:[true],
            minlength:[2]
        },
     slug:{
        type: String,
        required:true,
        lowercase:true
        
     },
        imgs:String

    }, {
        timestamps: true,
    }
)

CategorySchema.post('save',(doc)=>{
    doc.imgs= process.env.BASE_URL +"/category/"+ doc.imgs
    console.log(doc)
})


export const CategoryModel = Mongoose.model('Category',CategorySchema)