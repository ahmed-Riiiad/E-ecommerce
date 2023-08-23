import Mongoose from "mongoose"
import bcrypt from "bcrypt"
import mongoose from "mongoose"
 const user_schema = Mongoose.Schema(
    {
        name : {
           type: String,
           required:true,
           trim : true,
           minLength : [2 ,'too short']
        },
       password:{
        type: String,
        require:true,
        minLength : [6 ,'too short']
    },
        email : {
            type :String,
            required:true,
            minLength : 1,
            unique : true,
            trim : true
        },
        role: {
            type: String,
            enum: ['admin', 'user'],
            default: 'user'
        },
        IsActive :{
            type:Boolean,
            default:true
        },
        verified : {
            type:Boolean,
            default:false
        },
        passwordChangeAT : Date , 
        wishList : [{type:mongoose.Types.ObjectId , ref : 'Product'}],
        address : [{
            cityName   : String,
            street      : String,
            phone    : Number,
        }]
    }, {
        timestamps: true,
    }
)

user_schema.pre('save',function(){
    this.password = bcrypt.hashSync(this.password,7)
})

user_schema.pre(/^find/,function(){
    if(this._update.password)
    this._update.password = bcrypt.hashSync(this._update.password,7)
})

// user_schema.pre(/^find/,function(){
//     this.populate('user','name')
// })

export const userModel = Mongoose.model('user',user_schema)