import  Mongoose  from "mongoose"

const BrandSchema = Mongoose.Schema(
    {
        name:{
            type:String,
            require:true,
            unique : [true,'Brand already exist']  ,
            trim:[true],
            minlength:[2]
        },
        slug:{
            type: String,
            require:true,
            lowercase:true
            
        },
        logo:String

    }, {timestamps: true,})

BrandSchema.post('init',(doc)=>{
        doc.logo= process.env.Base_Url +"/brand/"+ doc.logo
})

export const BrandModel = Mongoose.model('Brand',BrandSchema)