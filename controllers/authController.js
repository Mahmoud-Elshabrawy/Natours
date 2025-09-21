const {promisify} = require('util')
const User = require('../models/userModel')
const catchAsync = require('../utilities/catchAsync')
const AppError = require('../utilities/appError')
const jwt = require('jsonwebtoken')
const Email = require('../utilities/email')
const crypto = require('crypto')
const { url } = require('inspector')


const signToken = id => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE_IN
    })
}

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id)

    res.cookie('jwt', token, {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE_IN * 24 * 60 * 60 * 1000),
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true
    })

    user.password = undefined
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    })
}

const signUp = catchAsync(async(req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt,
        role: req.body.role,
    })
    
    const url = `${req.protocol}://${req.get('host')}/me`
    await new Email(newUser, url).sendWelcome()
    createSendToken(newUser, 201, res)
})


const logIn = catchAsync(async(req, res, next) => {
    const {email, password} = req.body
    console.log('Login attempt - Email:', email, 'Password:', password);
    
    if(!email || !password) {
        return next(new AppError('Please provide correct email and password', 400))
    }
    
    const user = await User.findOne({email}).select('+password')
    
    if (!user) {
        console.log('User not found in database');
        return next(new AppError('Incorrect email or password', 401))
    }
    
    
    const isMatch = await user.correctPassword(password, user.password);
    console.log('Password match result:', isMatch);
    
    if(!isMatch) {
        return next(new AppError('Incorrect email or password', 401))
    }

    createSendToken(user, 200, res)
})


const logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    })
    res.status(200).json({status: 'success'})
}

const protectAll = catchAsync(async(req, res, next) => {
    // 1) Get token and check it
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    } else if(req.cookies.jwt) {
        token = req.cookies.jwt
    }
    // console.log(token);
    if(!token) {
        return next(new AppError('You are not logged in, Please log in', 401))
    }
    
    // 2) Verify the token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    // console.log(decoded);


    // 3) Check if the user still exists
    const user = await User.findById(decoded.id)
    // console.log(user);
    if(!user) return next(new AppError('The user belonging to this token does no exists', 401))
    

    // 4) Check if the password changed after the token issued
    if(user.changedPasswordAfter(decoded.iat)) return next(new AppError('User recently changed password!, Please login again.', 401))
        
    res.locals.user = user
    req.user = user
    next()
})


const isLoggedIn = async(req, res, next) => {

    if(req.cookies.jwt) {
        try {

            // 2) Verify the token
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET)
            
            // 3) Check if the user still exists
            const user = await User.findById(decoded.id)
            if(!user) return next()
                
                
                // 4) Check if the password changed after the token issued
                if(user.changedPasswordAfter(decoded.iat)) return next()
                    
                    // There is a LoggedIn User
                    res.locals.user = user
                } catch (err) {
                    return next()
                }
        // next()
    }
    next()
}


const restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles -> ['admin', 'lead-guide']
        if(!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403))
        }
        next()
    }
}

const forgotPassword = catchAsync(async(req, res, next) => {
    // 1) Get User based on email
    const user = await User.findOne({email: req.body.email})
    if(!user) {
        return next(new AppError('there is no user with email Address', 404))
    }

    // 2) Generate the token
    const resetToken = user.createPasswordResetToken()
    await user.save({validateBeforeSave: false})

    // 3) send to user
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`

    // Using try catch block here because the token is already saved to db in line 109 and if the server down or any error the token exists but the mail does not sent 
    try {
        await new Email(user, resetUrl).passwordReset()
        res.status(200).json({
            status: 'success',
            message: 'Token send to email!'
        })
    }catch(err) {
        console.error('EMAIL ERROR:', err);
        user.passwordResetToken = undefined
        user.passwordResetExpires = undefined
        await user.save({validateBeforeSave: false})
        return next(new AppError(' There was an error sending the email. Try again later!',500))
    }
})

const resetPassword = catchAsync(async(req, res, next) => {
    // 1) Get the user based on token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user = await User.findOne({passwordResetToken: hashedToken, passwordResetExpires: {$gt: Date.now()}})

    // 2) Check if the user exists or the token has not expired
    if(!user) {
        return next(new AppError('The token Invalid or has expired', 400))
    }
    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()


    // 3)


    // 4) Log The User in
    createSendToken(user, 200, res)


})

const updatePassword = catchAsync(async(req, res, next) => {
    // The User must be logged in and also ask him for current Password 

    // 1) Get The User
    const user = await User.findById(req.user.id).select('+password')
    // 2) Check if the Current Password is correct
    if(!user || !await user.correctPassword(req.body.passwordCurrent, user.password)) {
    return next(new AppError('The Current Password is Incorrect, Please tyr again', 401))
    }
    // 3) if so, Update the Password
    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    await user.save()
    // 4) Log in again
    createSendToken(user, 201, res)

})

module.exports = {
    signUp,
    logIn,
    logout,
    protectAll,
    restrictTo,
    forgotPassword,
    resetPassword,
    updatePassword,
    isLoggedIn
}