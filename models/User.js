const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: [true, 'Please Add Your Name']
    },
    email: {
        type: String,
        required: [true, 'Please Add Your Email'],
        unique: true,
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, "Please Add Your Password"],
        minLength: [5, 'Password must contain atleast 5 characters'],
        maxLength: [20, 'Password must contain atmost 20 characters'],
        select: false
    },
    phoneNumber: {
        type: String,
        required: [true, 'Please Add Your Mobile Number'],
        match: [/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/, "Please Enter a Valid Mobile Number"]
    },
    role: {
        type: String,
        enum: ['user', 'tutoruser'],
        default: 'user'
    }
}, {
    timestamps: true
})

//Encrypt password using bcrypt
UserSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next()
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

//Sign JWT and return
UserSchema.methods.createAccessToken = function(){
    return jwt.sign({id: this._id}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

UserSchema.methods.createRefreshToken = function(){
    return jwt.sign({id: this._id}, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

UserSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model('User', UserSchema)