import  Mongoose  from "mongoose"

const BrandSchema = Mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            unique : [true,'Brand already exist']  ,
            trim:[true],
            minlength:[2]
        },
        slug:{
            type: String,
            required:true,
            lowercase:true
            
        },
        logo:String

    }, {timestamps: true,})

BrandSchema.post('save',(doc)=>{
    console.log(doc)
    doc.logo= process.env.BASE_URL +"/brand/"+ doc.logo
})

export const BrandModel = Mongoose.model('Brand',BrandSchema)