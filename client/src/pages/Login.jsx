import { Box, Button, TextField } from '@mui/material'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LoadingButton from '@mui/lab/LoadingButton'
import authApi from '../api/authApi'

const Login = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [usernameErrText, setUsernameErrText] = useState('')
  const [passwordErrText, setPasswordErrText] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUsernameErrText('')
    setPasswordErrText('')

    const data = new FormData(e.target)
    const username = data.get('username').trim()
    const password = data.get('password').trim()

    let err = false

    if (username === '') {
      err = true
      setUsernameErrText('Введите это поле')
    }
    if (password === '') {
      err = true
      setPasswordErrText('Введите это поле')
    }

    if (err) return

    setLoading(true)

    try {
      const res = await authApi.login({ username, password })
      setLoading(false)
      localStorage.setItem('token', res.token)
      navigate('/')
    } catch (err) {
      const errors = err.data.errors
      errors.forEach(e => {
        if (e.param === 'username') {
          setUsernameErrText(e.msg)
        }
        if (e.param === 'password') {
          setPasswordErrText(e.msg)
        }
      })
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
        <LoadingButton
          sx={{ mt: 3, mb: 2 }}
          variant='outlined'
          fullWidth
          color='success'
          type='submit'
          loading={loading}
        >
          Вход
        </LoadingButton>
      </Box>
      <Button
        component={Link}
        to='/signup'
        sx={{ textTransform: 'none' }}
      >
        У вас нет аккаунта? Регистрация
      </Button>
    </>
  )
}

export default Login