import { Backdrop, Fade, IconButton, Modal, Box, TextField, Typography, Divider, Button } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import Moment from 'moment'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import taskApi from '../../api/taskApi'
import userApi from '../../api/userApi'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

import '../../css/custom-editor.css'

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

let timer
const timeout = 500
let isModalClosed = false

const TaskModal = props => {
  const boardId = props.boardId
  const [task, setTask] = useState(props.task)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [username, setUsername] = useState('')
  const [role, setUserRole] = useState('')
  const editorWrapperRef = useRef()

  useEffect(() => {
    setTask(props.task)
    setTitle(props.task !== undefined ? props.task.title : '')
    setContent(props.task !== undefined ? props.task.content : '')
    if (props.task !== undefined) {
      isModalClosed = false

      updateEditorHeight()
    }
  }, [props.task])

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await userApi.getAdmin();
        const role = response.role; // Обновление деструктурирующего присваивания
        console.log(response)

        if (role) {
          setUserRole(role);
        } else {
          console.error('Ошибка запроса: отсутствует свойство role в ответе');
        }
      } catch (error) {
        console.error('Ошибка запроса: ', error);
        }
    };

    fetchUserRole();
  }, []);


  const updateEditorHeight = () => {
    setTimeout(() => {
      if (editorWrapperRef.current) {
        const box = editorWrapperRef.current
        box.querySelector('.ck-editor__editable_inline').style.height = (box.offsetHeight - 50) + 'px'
      }
    }, timeout)
  }
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleFormChangeSubmit = async () => {
    try {
      const taskData = {
        username: username,
      };
      console.log(taskData);
      const response = await taskApi.changeuser(boardId, task.id, taskData);
      console.log(response.data);
      toast.success('Испольнитель задачи изменен!')

    } catch (error) {
      // Обработка ошибки
      toast.error('Что-то пошло не так!');
    }
    
  };

  const handleTaskComplite = async () => {
    try {
      const response = await taskApi.compliteTask(boardId, task.id);
      console.log(response.data);
      toast.success('Вы выполнили эту задачу!')
    } catch (error) {
      toast.warn('Эта задача уже выполнена!');
    }

  }

  const handleFormSubmit = async () => {
    try {
      const response = await taskApi.adduser(boardId, task.id);
      console.log(response.data);
      toast.success('Вы добавили себя в эту задачу!')
    } catch (error) {
      // Обработка ошибки
      toast.warn('Эта задача уже занята другим сотрудником!')
    }
  };

  const onClose = () => {
    isModalClosed = true
    props.onUpdate(task)
    props.onClose()
  }

  const deleteTask = async () => {
    try {
      await taskApi.delete(boardId, task.id)
      props.onDelete(task)
      setTask(undefined)
    } catch (err) {
      toast.error('У вас нет на это прав. Обновите страницу')
    }
  }

  const updateTitle = async (e) => {
    clearTimeout(timer)
    const newTitle = e.target.value
    timer = setTimeout(async () => {
      try {
        await taskApi.update(boardId, task.id, { title: newTitle })
      } catch (err) {
        toast.error('У вас нет на это прав. Обновите страницу')
      }
    }, timeout)

    task.title = newTitle
    setTitle(newTitle)
    props.onUpdate(task)
  }

  const updateContent = async (event, editor) => {
    clearTimeout(timer)
    const data = editor.getData()

    console.log({ isModalClosed })

    if (!isModalClosed) {
      timer = setTimeout(async () => {
        try {
          await taskApi.update(boardId, task.id, { content: data })
        } catch (err) {
          toast.error('У вас нет на это прав. Обновите страницу')
        }
      }, timeout);

      task.content = data
      setContent(data)
      props.onUpdate(task)
    }
  }

  return (
    <Modal
      open={task !== undefined}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <Fade in={task !== undefined}>
        <Box sx={modalStyle}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            width: '100%'
          }}>
            <IconButton variant='outlined' color='error' onClick={deleteTask}>
              <DeleteOutlinedIcon />
            </IconButton>
          </Box>
          <Box sx={{
            display: 'flex',
            height: '100%',
            flexDirection: 'column',
            padding: '2rem 5rem 5rem'
          }}>
            <TextField
              value={title}
              onChange={updateTitle}
              placeholder='Без заголовка'
              variant='outlined'
              fullWidth
              sx={{
                width: '100%',
                '& .MuiOutlinedInput-input': { padding: 0 },
                '& .MuiOutlinedInput-notchedOutline': { border: 'unset ' },
                '& .MuiOutlinedInput-root': { fontSize: '2.5rem', fontWeight: '700' },
                marginBottom: '10px'
              }}
            />
            <Typography variant='body2' fontWeight='700'>
              {task !== undefined ? Moment(task.createdAt).format('YYYY-MM-DD') : ''}
            </Typography>
            <Divider sx={{ margin: '1.5rem 0' }} />
            <Box
              ref={editorWrapperRef}
              sx={{
                position: 'relative',
                height: '80%',
                overflowX: 'hidden',
                overflowY: 'auto'
              }}
            >
              <CKEditor
                editor={ClassicEditor}
                data={content}
                onChange={updateContent}
                onFocus={updateEditorHeight}
                onBlur={updateEditorHeight}
              />
            </Box>
            <Box sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Button onClick={handleFormSubmit}>
                Выбрать задачу
              </Button>
              <Button onClick={handleTaskComplite}>
                Выполнить задачу
              </Button>
            </Box>
            {role === 'Админ' && (
              <Box sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <TextField 
                  margin='normal'
                  id='login'
                  label='login'
                  name='login'
                  onChange={handleUsernameChange}
                />
                <Button variant='contained' onClick={handleFormChangeSubmit}>
                  Изменить исполнителя
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Fade>
    </Modal>
  )
}

export default TaskModal