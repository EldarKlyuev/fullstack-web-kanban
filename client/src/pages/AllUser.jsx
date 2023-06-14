import React, { useState, useEffect } from 'react';
import userApi from '../api/userApi';
import { Card, CardContent, Typography } from '@mui/material';
import { styled } from '@mui/system';

const StyledCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: '#000000',
  }));

const AllUser = () => {
  const [users, setUsers] = useState([]);

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

  return (
    <div>
      <h1>Список всех пользователей</h1>
      {users.map((user) => (
        <StyledCard key={user._id}>
          <CardContent>
            <Typography variant="h5" component="h2">
              {user.username}
            </Typography>
            <Typography color="textSecondary">Тэг телеграм: {user.telegram}</Typography>
            <Typography color="textSecondary">Роль в системе: {user.role}</Typography>
            <Typography color="textSecondary">
              Выполненых задач: {user.completedTasksCount}
            </Typography>
            <Typography color="textSecondary">Текущая задача: {user.currentTask}</Typography>
            <Typography color="textSecondary">Выполненные задачи:</Typography>
            <ul>
              {user.complitedTasks.map((task) => (
                <li key={task}>{task}</li>
              ))}
            </ul>
          </CardContent>
        </StyledCard>
      ))}
    </div>
  );
};

export default AllUser;