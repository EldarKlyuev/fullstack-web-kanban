const User = require('../models/user')
const CryptoJS = require('crypto-js')
const jsonwebtoken = require('jsonwebtoken')

exports.register = async (req, res) => {
  const { password } = req.body
  try {
    req.body.password = CryptoJS.AES.encrypt(
      password,
      process.env.PASSWORD_SECRET_KEY
    )

    const user = await User.create(req.body)
    const token = jsonwebtoken.sign(
      { id: user._id },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: '24h' }
    )
    res.status(201).json({ user, token })
  } catch (err) {
    res.status(500).json(err)
  }
}

exports.changeUser = async (req, res) => {
  const { username, telegram, role } = req.body;

  try {
    const userchange = await User.findOne({ username })
    console.log(telegram)
    console.log(role)
    console.log(userchange.username)

    if (!userchange) {
      return res.status(401).json({
        errors: [
          {
            param: 'username',
            msg: 'Invalid username'
          }
        ]
      })
    }

    const user = await User.findByIdAndUpdate(
      userchange._id,
      { telegram, role },
      {new: true}
    );
    console.log(user)


    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}

exports.admin = async (req, res) => {
  try {
    const user = req.user; // Получаем пользователя из предыдущего middleware

    // Проверяем, что пользователь существует
    if (!user) {
      throw new Error('User not found');
    }

    // Возвращаем значение поля "role" пользователя
    res.json({ role: user.role });
    console.log(user.role)
  } catch (error) {
    res.status(401).json({ error: 'Authentication error' });
  }
}

exports.login = async (req, res) => {
  const { username, password } = req.body
  try {
    console.log(username)
    const user = await User.findOne({ username }).select('password username')
    if (!user) {
      return res.status(401).json({
        errors: [
          {
            param: 'username',
            msg: 'Invalid username or password'
          }
        ]
      })
    }

    const decryptedPass = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASSWORD_SECRET_KEY
    ).toString(CryptoJS.enc.Utf8)

    if (decryptedPass !== password) {
      return res.status(401).json({
        errors: [
          {
            param: 'username',
            msg: 'Invalid username or password'
          }
        ]
      })
    }

    user.password = undefined

    const token = jsonwebtoken.sign(
      { id: user._id },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: '24h' }
    )

    res.status(200).json({ user, token })

  } catch (err) {
    res.status(500).json(err)
  }
}