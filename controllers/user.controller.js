const User = require('../models/User')
const jwt = require('jsonwebtoken')

exports.getUsers = async (req,res) => {
    try {
        const user = await User.find();
        res.status(200).json({
            success: true,
            data: user
        })
    } catch (err) {
        return res.status(500).json({err: err.message})
    }
}

exports.registerUser = async (req,res) => {
    try {
        const {name, email, password, phoneNumber} = req.body

        const user = await User.findOne({email})
        if(user){
            return res.status(400).json({err: "User Already Exists"})
        }

        const newUser = new User({
            name, 
            email, 
            password,
            phoneNumber
        })

        await newUser.save();

        const accessToken = newUser.createAccessToken();
        const refreshToken = newUser.createRefreshToken();

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            path: '/api/v1/users/refreshToken'
        })

        res.status(201).json({
            success: true,
            accessToken
        })

    } catch (err) {
        return res.status(500).json({err: err.message})
    }
}

exports.loginUser = async (req,res) => {
    try {
        const {email, password} = req.body

        const user = await User.findOne({email}).select('+password')
        if(!user){
            return res.status(400).json({err: "User with the email doesn't exists"})
        }

        const doMatch = await user.matchPassword(password)
        if(!doMatch){
            return res.status(400).json({err: "Incorrect Email or Password"})
        }else{
            const accessToken = user.createAccessToken();
            const refreshToken = user.createRefreshToken();

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                path: '/api/v1/users/refreshToken'
            })

            res.status(200).json({
                success: true,
                accessToken
            })
        }

    } catch (err) {
        return res.status(500).json({err: err.message})
    }
}

exports.logout = async (req,res) => {
    try {
        res.clearCookie('refreshToken', {path: '/api/v1/users/refreshToken'});
        return res.status(200).json({
            success: true,
            msg: "User logout Successfully"
        })
    } catch (err) {
        return res.status(500).json({err: err.message})
    }
}

exports.getMe = async (req,res) => {
    try {
        const user = await User.findById(req.user.id);
        if(user){
            res.status(200).json({
                success: true,
                data: user
            })
        }
    } catch (err) {
        return res.status(500).json({err: err.message})
    }
}

