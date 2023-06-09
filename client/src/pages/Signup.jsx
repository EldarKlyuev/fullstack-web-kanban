import { Box, Button, TextField } from '@mui/material'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LoadingButton from '@mui/lab/LoadingButton'
import authApi from '../api/authApi'

const Signup = () => {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [usernameErrText, setUsernameErrText] = useState('')
  const [passwordErrText, setPasswordErrText] = useState('')
  const [confirmPasswordErrText, setConfirmPasswordErrText] = useState('')
  const [telegramErrText, setTelegramErrText] = useState('')
  const [roleErrText, setRoleErrText] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUsernameErrText('')
    setPasswordErrText('')
    setConfirmPasswordErrText('')
    setTelegramErrText('')
    setRoleErrText('')

    const data = new FormData(e.target)
    const username = data.get('username').trim()
    const password = data.get('password').trim()
    const confirmPassword = data.get('confirmPassword').trim()
    const telegram = data.get('telegram').trim()
    const role = data.get('role').trim()


    let err = false

    if (username === '') {
      err = true
      setUsernameErrText('Введите это поле')
    }
    if (password === '') {
      err = true
      setPasswordErrText('Введите это поле')
    }
    if (confirmPassword === '') {
      err = true
      setConfirmPasswordErrText('Введите это поле')
    }
    if (password !== confirmPassword) {
      err = true
      setConfirmPasswordErrText('Пароли не совпадают')
    }
    if (telegram === '') {
      err = true
      setTelegramErrText('Введите это поле')
    }
    if (role === '') {
      err = true
      setRoleErrText('Введите это поле')
    }

    if (err) return

    setLoading(true)

    try {
      const res = await authApi.signup({
        username, password, confirmPassword, telegram, role
      })
      setLoading(false)
      localStorage.setItem('token', res.token)
      navigate('/')
    } catch (err) {
        const errors = err.data.errors || []
        errors.forEach(e => {
          if (e.param === 'username') {
            setUsernameErrText(e.msg)
          }
          if (e.param === 'password') {
            setPasswordErrText(e.msg)
          }
          if (e.param === 'confirmPassword') {
            setConfirmPasswordErrText(e.msg)
          }
          if (e.param === 'telegram') {
            setTelegramErrText(e.msg)
          }
          if (e.param === 'role') {
            setRoleErrText(e.msg)
          }
        });
        setLoading(false)
    }
  }

  return (
    <>
      <Box
        component='form'
        sx={{ mt: 1 }}
        onSubmit={handleSubmit}
        noValidate
      >
        <TextField
          margin='normal'
          required
          fullWidth
          id='username'
          label='Логин'
          name='username'
          disabled={loading}
          error={usernameErrText !== ''}
          helperText={usernameErrText}
        />
        <TextField
          margin='normal'
          required
          fullWidth
          id='password'
          label='Пароль'
          name='password'
          type='password'
          disabled={loading}
          error={passwordErrText !== ''}
          helperText={passwordErrText}
        />
        <TextField
          margin='normal'
          required
          fullWidth
          id='confirmPassword'
          label='Подтвердите пароль'
          name='confirmPassword'
          type='password'
          disabled={loading}
          error={confirmPasswordErrText !== ''}
          helperText={confirmPasswordErrText}
        />
        <TextField
          margin='normal'
          required
          fullWidth
          id='telegram'
          label='Телеграмм'
          name='telegram'
          type='telegram'
          disabled={loading}
          error={telegramErrText !== ''}
          helperText={telegramErrText}
        />
        <TextField
          margin='normal'
          required
          fullWidth
          id='role'
          label='Роль'
          name='role'
          type='role'
          disabled={loading}
          error={roleErrText !== ''}
          helperText={roleErrText}
        />
        <LoadingButton
          sx={{ mt: 3, mb: 2 }}
          variant='outlined'
          fullWidth
          color='success'
          type='submit'
          loading={loading}
        >
          Регистрация
        </LoadingButton>
      </Box>
      <Button
        component={Link}
        to='/login'
        sx={{ textTransform: 'none' }}
      >
        Уже есть аккаунт? Вход
      </Button>
    </>
  )
}

export default Signup