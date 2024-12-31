import mongoose from "mongoose"


 const ProductSchema = mongoose.Schema(
    {
        Title:{
            type:String,
            required:true,
            unique : [true,'Product already exist']  ,
            trim:[true],
            minlength:[2]
        },
     slug:{
        type: String,
        required:true,
        lowercase:true
        
     },
        Price:{
            type:Number,
            required:true,
            min : 0 
        },
        PriceAfterDisc:{
            type:Number,
            min : 0 
        },
        RatingAverage:{
            type:Number,
            min:[1,'Must be more than 1'],
            max:[5,'Must be less than 1']
        },
        RatingCount:{
            type:Number,
            min: 0,
            default: 0
        },
        Description: {
            type:String,
            minlength:[5,'too short'],
            trim:true
        },
        quantity : {
            type:Number,
            min : 0 ,
            default:0,
            required : [true,'product quantity required ']
        },
        sold :{
            type:Number,
            min: 0,
            default: 0
        },
        imgCover :String,
        imgs: [String],
        category :{
            type:mongoose.Types.ObjectId,
            ref : 'Category',
            required : [true,'product category required ']
        },
        SubCategory :{
            type:mongoose.Types.ObjectId,
            ref : 'SubCategory',
            required : [true,'product Subcategory required ']
        },
        Brand :{
            type:mongoose.Types.ObjectId,
            ref : 'Brand',
            required : [true,'product Brand required ']
        }
    }, {
        timestamps: true, toJSON:{virtuals:true } , toObject:{virtuals:true }
    }
)

ProductSchema.post('save',(doc)=>{
    console.log(doc)
    doc.imgCover= process.env.BASE_URL +"/product/"+ doc.imgCover
    doc.imgs = doc.imgs.map((path=>process.env.BASE_URL +"/product/"+ path))
})

ProductSchema.virtual('myReview',{
    ref : 'Review',
    localField:'_id',
    foreignField:'product'
})

ProductSchema.pre('/^find/',function(){
    this.populate('myReview')
})

export const ProductModel = mongoose.model('Product',ProductSchema)