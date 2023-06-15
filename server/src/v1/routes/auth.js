const router = require('express').Router()
const userController = require('../controllers/user')
const { body } = require('express-validator')
const validation = require('../handlers/validation')
const tokenHandler = require('../handlers/tokenHandler')
const User = require('../models/user')

router.post(
  '/signup',
  body('username').isLength({ min: 8 }).withMessage(
    'Username должен содержать не менее 8 символов'
  ),
  body('password').isLength({ min: 8 }).withMessage(
    'Пароль должен содержать не менее 8 символов'
  ),
  body('confirmPassword').isLength({ min: 8 }).withMessage(
    'Пароль должен содержать не менее 8 символов'
  ),
  body('telegram').isLength({ min: 8 }).withMessage(
    'Никнейм телеграм должен содержать не менее 8 символов'
  ),
  body('username').custom(value => {
    return User.findOne({ username: value }).then(user => {
      if (user) {
        return Promise.reject('Логин уже существует')
      }
    })
  }),
  body('telegram').custom(value => {
    return User.findOne({ telegram: value }).then(user => {
      if (user) {
        return Promise.reject('Данный логин уже существует')
      }
    })
  }),
  validation.validate,
  userController.register
)

router.post(
  '/login',
  body('username').isLength({ min: 8 }).withMessage(
    'username must be at least 8 characters'
  ),
  body('password').isLength({ min: 8 }).withMessage(
    'password must be at least 8 characters'
  ),
  validation.validate,
  userController.login
)

router.post(
  '/verify-token',
  tokenHandler.verifyToken,
  (req, res) => {
    res.status(200).json({ user: req.user })
  }
)

module.exports = router