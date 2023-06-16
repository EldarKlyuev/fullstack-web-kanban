import React, { useState, useEffect } from 'react';
import userApi from '../api/userApi';
import { Card, CardContent, Typography, Box, Button } from '@mui/material';
import { styled } from '@mui/system';
import UserModal from './UserModal';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const StyledCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: '#000000',
  }));

const AllUser = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [pdfData, setPdfData] = useState('');

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

  const generatePDF = () => {
    console.log(users)
    // Создание JSON-объекта для генерации PDF
    const jsonData = users.map(user => ({
      username: user.username,
      completedTasksCount: user.completedTasksCount,
      telegram: user.telegram,
      role: user.role,
      currentTask: user.currentTask,
      complitedTasks: user.complitedTasks
    }));
      
      // ... другие объекты пользователей
    console.log(jsonData)

    // Определение шаблонов для PDF

    const docDefinition = {
      content: [
        { text: 'Пользователи', style: 'header' },
        {
          ul: jsonData.flatMap(user => ([
            { text: `Username: ${user.username}`, margin: [0, 0, 0, 5] },
            { text: `Completed Tasks Count: ${user.completedTasksCount}`, margin: [0, 0, 0, 5] },
            { text: `Telegram: ${user.telegram}`, margin: [0, 0, 0, 5] },
            { text: `Role: ${user.role}`, margin: [0, 0, 0, 5] },
            { text: `Current Tasks: ${user.currentTask.join(', ')}`, margin: [0, 0, 0, 5] },
            { text: `Completed Tasks: ${user.complitedTasks.join(', ')}`, margin: [0, 0, 0, 20] }
          ]))
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        }
      }
    };
    

    console.log(docDefinition)

    // Создание PDF-документа
    const pdfDocGenerator = pdfMake.createPdf(docDefinition);

    // Сохранение PDF-файла
    pdfDocGenerator.getBlob((blob) => {
      setPdfData(blob);
    });
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
        <Button sx={{ fontSize: "1.2rem", padding: '12px'}} onClick={() => {
          try {
            generatePDF();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(pdfData);
            link.download = 'users.pdf';
            link.click();
            toast.success('Файл сохранен')
          } catch (error) {
            toast.error('Что-то пошло не так! Попробуйте ещё раз!');
          }
        }}>
          Скачать отчёт
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