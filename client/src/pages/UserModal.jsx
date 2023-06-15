import React from 'react';
import Modal from '@mui/material/Modal';
import { Box, Button, TextField, Typography } from '@mui/material';
import userApi from '../api/userApi';
import { useState } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const modalStyle = {
  outline: 'none',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  bgcolor: 'background.paper',
  border: '0px solid #000',
  boxShadow: 24,
  p: 1,
  height: '80%'
}

const MyModal = ({ open, handleClose }) => {
  const [username, setUsername] = useState('');
  const [telegram, setTelegram] = useState('');
  const [role, setRole] = useState('');

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleTelegramChange = (event) => {
    setTelegram(event.target.value)
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleFormChangeSubmit = async () => {
    try {
      const taskData = {
        username: username,
        telegram: telegram,
        role: role
      };
      console.log(taskData);
      const response = await userApi.changeUser(taskData);
      console.log(response.data);
      toast.success('Данные пользователя изменены!')

    } catch (error) {
      // Обработка ошибки
      toast.error('Что-то пошло не так!');
    }
    
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Box sx={{
          marginTop: 8,
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column'
        }}>
          <Typography variant="h5" component="h5">
            Изменить пользователя
          </Typography>
          <TextField
            margin='normal'
            required
            id='username'
            label='Логин'
            name='username'
            value={username}
            onChange={handleUsernameChange}
          />
          <TextField
            margin='normal'
            id='telegram'
            label='Телеграм'
            name='telegram'
            type='telegram'
            value={telegram}
            onChange={handleTelegramChange}
          />
          <TextField
            margin='normal'
            id='role'
            label='Роль'
            name='role'
            type='role'
            value={role}
            onChange={handleRoleChange}
          />
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px'
          }}>
            <Button sx={{ fontSize: "1rem", padding: '12px'}}
              onClick={handleFormChangeSubmit}>
              Изменить
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default MyModal;