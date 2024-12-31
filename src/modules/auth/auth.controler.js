import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto';
import { catchError } from '../../utiles/catchError.js';
import { userModel } from '../../../database/models/user.model.js';
import { generateError } from '../../utiles/generateError.js';
import { Email } from '../../utiles/email.js';

// signUp
export const signUP = catchError(async (req, res, next) => {
    try {
        const { name, email, password, passwordConfirm } = req.body;

        // Check if the user already exists
        let user = await userModel.findOne({ email });

        // If user exists and is inactive, reactivate them
        if (user) {
            if (!user.active) {
                user.active = true;
                await user.save(); // Reactivate the user
            }
            return next(new generateError('Email already exists', 409));
        }

        // Create a new user if not already registered
        let newUser = new userModel({
            name,
            email,
            password,
            passwordConfirm,
        });
        let token2 = jwt.sign(
            {
              email 
            },
            process.env.VERIFY_TOKEN,
            { expiresIn: process.env.TOKEN_EXPIRE }
        );

        // Send a welcome email to the user
        const url = `${req.protocol}://${req.get('host')}/Api/v1/users/verify/${token2}`;
        // console.log(url)
        await new Email(newUser, url).verifyEmail();
        await newUser.save();

        // Return the success response with the user details and token
        res.status(201).json({
            message: 'success',
            newUser,
        });
    } catch (error) {
        next(error);
    }
});

// verify
export const verify = async(req,res,next)=>{
    const {token } = req.params
        jwt.verify(token ,process.env.VERIFY_TOKEN , async (err , decoded)=>{
       if (err){
       return res.json(err)
        }else {
          await userModel.findOneAndUpdate({email : decoded.email},{ verified : true})
       res.status(201).json({ status:"success" })
               }
            }) 
}


  // log In
  export const signIN = catchError(async (req, res, next) => {
    const { password, email } = req.body;

    if (!email || !password) {
        return next(new generateError('Email & password not provided', 400));
    }

    // Explicitly search for the user including inactive ones
    let user = await userModel.findOne({ email }).select('+password +passwordConfirm');
    if (!user) {
        return next(new generateError('Email not found', 409));
    }
    const url = `${req.protocol}://${req.get('host')}/Api/v1/users/me`;
    // Check if the user is verified
    if (user.verified === false) {
        return next(new generateError('Your account has been un verified. Please verify your email.', 403));
    }

    // Compare the provided password with the stored hash
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return next(new generateError('Incorrect password', 401));
    }

    // Generate a JWT token
    let token = jwt.sign(
        {
            name: user.name,
            email: user.email,
            user_id: user._id,
            role: user.role,
        },
        process.env.TOKEN_PASS,
        { expiresIn: process.env.TOKEN_EXPIRE }
    );
    await new Email(user, url).sendWelcome();

    // Send JWT in a cookie
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.TOKEN_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);

    return res.status(200).json({
        status: 'success',
        token,
        user
    });
});



//authentication
export const protectedRoutes = catchError(async (req, res, next) => {
    let token;

    // 1. Get token from headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]; // Extract token from Authorization header
    }

    if (!token) {
        console.log('Token not found in headers');
        return next(new generateError('You are not logged in', 401)); // Handle missing token
    }

    try {
        // 2. Verify the token
        let decoded = jwt.verify(token, process.env.TOKEN_PASS);

        // 3. Check if user still exists
        let user = await userModel.findById(decoded.user_id);
        if (!user) {
            console.log('User not found with ID:', decoded.user_id);
            return next(new generateError('where is user !', 401));
        }
        
        // 4. Check if user changed password after token was issued
        let passwordChangeAT = user.passwordChangeAT instanceof Date
            ? user.passwordChangeAT.getTime() / 1000
            : new Date(user.passwordChangeAT).getTime() / 1000;

        if (passwordChangeAT > decoded.iat) {
            return next(new generateError('Invalid token (password changed)', 401));
        }

        // 5. Attach user to the request object for further use
        req.user = user;
        next(); 
    } catch (error) {
        return next(new generateError('Invalid or expired token', 401));
    }
});


//authorization
export const allowedTo = (...roles)=>{
    return catchError(async(req,res,next)=>{
        if(!roles.includes(req.user.role)) 
        return next( new generateError(`cannot authorize , You Are ${req.user.role}` , 401  ))
        next()
    })
}


//forget Password
export const forgetPassword = catchError(async (req, res, next) => {
    // Get user based on posted email
    const user = await userModel.findOne({ email: req.body.email });

    if (!user) return next(new generateError('Email does not exist', 404));

    // Generate random reset token
    const resetToken = user.createPasswordResetToken();  

    // Save the user with the token and expiration 
    await user.save({ validateBeforeSave: false });

    // Send reset token to user email
    try {
        const resetUrl = `${req.protocol}://${req.get('host')}/Api/v1/users/ResetPassword/${resetToken}`;
        console.log('Reset URL:', resetUrl);
        await new Email(user, resetUrl).sendPasswordReset();

        res.status(200).json({
            status: 'Success',
            message: 'Token sent to email',
        });
    } catch (err) {
        // If there is an error while sending email, clear the token fields
        user.PasswordResetToken = undefined;
        user.PasswordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new generateError('There was an error while sending the email', 500));
    }
});



//reset password    
export const ResetPassword = catchError(async (req,res,next) =>{
    //get user based on token
    const hashedToken = crypto.createHash('sha256')
    .update(req.params.token)
    .digest('hex')
  
    const user = await userModel.findOne({
        PasswordResetToken : hashedToken,
        PasswordResetExpires : {$gt : Date.now()}
    })
    
    //if token has not expire ,and there is an user , set the new password
    if (!user)  return next(new generateError('token not valid', 404))

    await user.save({validateBeforeSave : false })
    user.password = req.body.password
    user.PasswordResetToken = undefined
    user.PasswordResetExpires = undefined
    await user.save()

    //4- log the user in , send jwt 
    let token = jwt.sign(
        {   name:user.name,
            email:user.email,
            user_id:user._id,
            role : user.role
        }, process.env.TOKEN_PASS ,{expiresIn : process.env.TOKEN_EXPIRE}
    )
     // send jwt in cookie to prevent attacker hack pass in local storage 
     const cookieOptions = {
        expires : new Date(
          Date.now() + process.env.TOKEN_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly : true
      }
      if(process.env.NODE_ENV === 'production') cookieOptions.secure = true
      res.cookie('jwt', token ,cookieOptions )

      res.status(201).json({ status:"success", token })
    })


//update password
export const updateMyPassword = catchError(async (req,res,next) =>{
    const { id } = req.params;
        // 1- get user   
        const user = await userModel.findById(id).select('+password')
        // 2- check if current pass is correct 
        const match = await bcrypt.compare(req.body.passwordCurrent , user.password )
        if (!match)  return next(new generateError('password not correct', 401))
        // 3- update pass 
        user.password = req.body.password
        user.passwordConfirm = req.body.passwordConfirm
        await user.save()
        // 4- log the user in , send jwt 
        let token = jwt.sign(
            {   name:user.name,
                email:user.email,
                user_id:user._id,
                role : user.role
            }, process.env.TOKEN_PASS ,{expiresIn : process.env.TOKEN_EXPIRE}
        )
         // send jwt in cookie to prevent attacker hack pass in local storage 
    const cookieOptions = {
        expires : new Date(
          Date.now() + process.env.TOKEN_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly : true
      }
      if(process.env.NODE_ENV === 'production') cookieOptions.secure = true
      res.cookie('jwt', token ,cookieOptions )
          res.status(200).json({message:'success',token})
        })












