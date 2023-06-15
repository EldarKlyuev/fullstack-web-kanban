const express = require('express')
const router = express.Router()
const { body } = require('express-validator')
const validation = require('../handlers/validation')
const tokenHandler = require('../handlers/tokenHandler')
const userController = require('../controllers/user')

router.get(
  '/admin',
  tokenHandler.verifyToken,
  userController.admin
)

router.get(
  '/allusers',
  tokenHandler.verifyToken,
  userController.getAllUsers
)

router.put(
  '/allusers/change',
  body('telegram').isLength({ min: 8 }).withMessage(
    'Никнейм телеграм должен содержать не менее 8 символов'
  ),
  tokenHandler.verifyToken,
  userController.changeUser
)

module.exports = router