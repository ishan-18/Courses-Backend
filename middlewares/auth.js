const jwt = require('jsonwebtoken')
const User = require('../models/User')

exports.protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
        token = req.cookies.refreshToken
    }

    if (!token) {
        return res.status(401).json({ err: 'Not Authorize to access this token' })
    }

    try {
        //Verify token
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        req.user = await User.findById(decoded.id)

        next();

    } catch (err) {
        return res.status(401).json({ err: 'Not Authorize to access this token' })
    }
}

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({err: 'User role ${req.user.role} is not authorized to access this route'})
        }
        next();
    };
};