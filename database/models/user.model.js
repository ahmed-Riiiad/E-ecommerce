import Mongoose from "mongoose"
import bcrypt from "bcrypt"
import mongoose from "mongoose"
import crypto from "crypto"
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
        required:true,
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
        PasswordResetToken: String,
        PasswordResetExpires:Date,
        active :{
            type :Boolean,
            default : true,
            select : false
        },
        wishList : [{type:mongoose.Types.ObjectId , ref : 'Product'}],
        address : [{
            cityName   : String,
            street      : String,
            phone    : String
        }]
    }, {
        timestamps: true,
    }
)

user_schema.pre('save',function(next){
    this.password = bcrypt.hashSync(this.password,7)
    next()
})
user_schema.pre('save',function(next){
    if (!this.isModified('password') || this.isNew ) return next()
    this.passwordChangeAT = Date.now() - 1000 
next()
})

user_schema.pre('findOneAndUpdate',function(next){
    if(this._update.password)
    this._update.password = bcrypt.hashSync(this._update.password,7)
    next()
})

user_schema.pre(/^find/,function(next){
    this.populate({
        path : 'user' ,
        select : 'name'
    })
    next()
})

user_schema.pre(/^find/,function(next){
    this.find({active : { $ne : false}})
    next()
})

user_schema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32)
    .toString('hex')
   this.PasswordResetToken = crypto.createHash('sha256')
   .update(resetToken)
   .digest('hex')
   this.PasswordResetExpires = Date.now() + 10*60*1000
   
   return resetToken
}
export const userModel = Mongoose.model('user',user_schema)