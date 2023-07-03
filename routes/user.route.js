const router = require('express').Router();
const { getUsers, registerUser, loginUser, logout, getMe } = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth');

router.get('/', getUsers)

router.post('/register', registerUser)

router.post('/login', loginUser)

router.get('/logout', logout)

router.get('/getMe', protect, getMe)

module.exports = router