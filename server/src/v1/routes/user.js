const express = require('express')
const router = express.Router()
const validation = require('../handlers/validation')
const tokenHandler = require('../handlers/tokenHandler')
const userController = require('../controllers/user')

router.get(
  '/admin',
  tokenHandler.verifyToken,
  userController.admin
)

module.exports = router