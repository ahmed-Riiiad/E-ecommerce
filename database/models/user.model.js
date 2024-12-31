import Mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import validator from 'validator';

const user_schema = Mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell us your name'],
      trim: true,
      minLength: [2, 'Too short'],
    },
    password: {
      type: String,
      required: true,
      minLength: [6, 'Too short'],
      select: false,
    },
    passwordConfirm: {
      type: String,
      select: false,
      required: [true, 'Please confirm your password'],
      validate: {
        validator: function(el) {
          return el === this.password;
        },
        message: 'Passwords are not the same',
      },
    },
    email: {
      type: String,
      required: [true, 'Please provide your E-mail'],
      unique: true,
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid E-mail'],
    },
    photo: {
      type: String,
      default: 'default.jpg',
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'guide'],
      default: 'user',
    },
    user: {
      type: Mongoose.Schema.ObjectId,
      ref: 'user',
    },
    wishList:[ {
      type: Mongoose.Schema.ObjectId,
      ref: 'Product',
    }],
    addresses :[{ 
      street : String,
      city:String,
      phone : String
  }],
    verified: {
      type: Boolean,
      default: false,
    },
    passwordChangeAT: Date,
    PasswordResetToken: String,
    PasswordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// user_schema.post('find',(doc)=>{
//   console.log(doc)
//   doc.photo= process.env.BASE_URL +"/users/"+ doc.photo
// })

// Pre-save hook to hash password and remove passwordConfirm field
user_schema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 7);
  this.passwordConfirm = undefined;
  next();
});

// Pre-save hook to update passwordChangeAT when password is modified
user_schema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangeAT = Date.now();
  next();
});

// Pre-findOneAndUpdate hook to hash the password during an update
user_schema.pre('findOneAndUpdate', async function(next) {
  if (this._update.password) {
    this._update.password = await bcrypt.hash(this._update.password, 7);
  }
  next();
});

// Pre-find hook to populate user field and filter inactive users
user_schema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name',
  });
  this.find({ active: { $ne: false } });
  next();
});

// Method to create a password reset token
user_schema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.PasswordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.PasswordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

export const userModel = Mongoose.model('user', user_schema);
