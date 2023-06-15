import React, { useState, useEffect } from 'react';
import userApi from '../api/userApi';
import { Card, CardContent, Typography, Box, Button } from '@mui/material';
import { styled } from '@mui/system';
import UserModal from './UserModal';
import { ToastContainer } from 'react-toastify';

const StyledCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: '#000000',
  }));

const AllUser = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userApi.getAllUsers(); // Замените '/users' на ваш URL эндпоинта для получения пользователей
        const usersData = response;
        console.log(response)
        setUsers(usersData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px'
      }}>
        <Typography variant="h2" component="h2">
          Список всех пользователей
        </Typography>
      </Box>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px'
      }}>
        <Button sx={{ fontSize: "1.2rem", padding: '12px'}} onClick={handleOpen}>
          Изменить
        </Button>
      </Box>
      <UserModal open={open} handleClose={() => setOpen(false)} />
      {users.map((user) => (
        <StyledCard key={user._id}>
          <CardContent>
            <Typography variant="h5" component="h2">
              {user.username}
            </Typography>
            <Typography color="textSecondary">Тэг телеграм: <b>{user.telegram}</b></Typography>
            <Typography color="textSecondary">Роль в системе: {user.role}</Typography>
            <Typography color="textSecondary">
              Выполненых задач: {user.completedTasksCount}
            </Typography>
            <Typography color="textSecondary"> Текущие задачи: 
                <ul>
                {user.currentTask.map((task) => (
                    <li key={task}>{task}</li>
                ))}
                </ul>
            </Typography>
            <Typography color="textSecondary">Выполненные задачи:</Typography>
            <ul>
              {user.complitedTasks.map((task) => (
                <li key={task}>{task}</li>
              ))}
            </ul>
          </CardContent>
        </StyledCard>
        
      ))}
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default AllUser;