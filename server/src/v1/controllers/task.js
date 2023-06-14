const Task = require('../models/task')
const Section = require('../models/section')
const User = require('../models/user')
const task = require('../models/task')

exports.create = async (req, res) => {
  const { user } = req
  const { sectionId } = req.body

  try {
    if (!user) {
      throw new Error('User not found');
    }

    if (user.role !== 'Админ') {
      return res.status(403).json({ error: 'У вас нет на это право' });
    }


    const section = await Section.findById(sectionId)
    const tasksCount = await Task.find({ section: sectionId }).count()
    const task = await Task.create({
      section: sectionId,
      position: tasksCount > 0 ? tasksCount : 0
    })
    task._doc.section = section
    res.status(201).json(task)
  } catch (err) {
    res.status(500).json(err)
  }
}

exports.update = async (req, res) => {
  const { user } = req
  const { taskId } = req.params

  try {
    if (!user) {
      throw new Error('User not found');
    }

    if (user.role !== 'Админ') {
      return res.status(403).json({ error: 'У вас нет на это право' });
    }
    const task = await Task.findByIdAndUpdate(
      taskId,
      { $set: req.body }
    )
    res.status(200).json(task)
  } catch (err) {
    res.status(500).json(err)
  }
}

exports.changeUser = async(req, res) => {
  const { taskId } = req.params
  const { username } = req.body
  const { user } = req

  try {
    if (!user) {
      throw new Error('User not found');
    }

    if (user.role !== 'Админ') {
      return res.status(403).json({ error: 'У вас нет на это право' });
    }
    console.log(username)
    console.log(taskId)

    const currentTask = await Task.findById(taskId)

    if (!currentTask) {
      return res.status(404).json({ error: 'Задача не найдена' })
    }

    const foundUser = await User.findOne({ username: username });
    if (!foundUser) {
      return res.status(404).json({ error: 'Пользователь не найден' })
    }

    currentTask.user = foundUser
    const updatedTask = await currentTask.save()
    console.log(updatedTask)
    res.json(updatedTask)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}

exports.adduser = async (req, res) => {
  const { taskId } = req.params
  const { user } = req

  try {
    // console.log(taskId)
    // console.log(user._id)
    if (!user) {
      throw new Error('User not found');
    }

    const currentTask = await Task.findById(taskId)
    console.log(currentTask.user)

    

    if (!currentTask) {
      return res.status(404).json({ error: 'Задача не найдена' })
    }

    if (currentTask.user) {
      return res.status(400).json({ error: 'Пользователь уже указан' });
    } else {
      currentTask.user = user
    }

    const updatedTask = await currentTask.save()

    const currentUserTask = await User.findById(currentTask.user)

    currentUserTask.currentTask = currentTask.title
    currentUserTask.save()
    console.log(currentUserTask)

    res.json(updatedTask)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}

exports.compliteTask = async (req, res) => {
  const { taskId } = req.params
  const { user } = req

  try {
    // console.log(taskId)
    // console.log(user._id)
    if (!user) {
      throw new Error('User not found');
    }

    const currentTask = await Task.findById(taskId)
    

    if (!currentTask) {
      return res.status(404).json({ error: 'Задача не найдена' })
    }

    if (currentTask.user === 'undefined') {
      return res.status(404).json({ error: 'Пользователь не указан' })
    }

    const currentUserTask = await User.findById(currentTask.user)

    console.log(currentUserTask)

    if (currentTask.completed === true) {
      return res.status(400).json({ error: 'Задача уже выполнена' });
    } else {
      currentTask.completed = true
      console.log(currentTask.completed)

      currentUserTask.completedTasksCount++

      currentUserTask.complitedTasks.push(currentTask.title)
      console.log(currentUserTask.complitedTasks)
      currentUserTask.save()
    }


    const updatedTask = await currentTask.save()

    console.log(updatedTask)

    res.json(updatedTask)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}

exports.getuser = async (req, res) => {
  const { taskId } = req.params

  try {
    const currentTask = await Task.findById(taskId)
    console.log(currentTask.user)

    if (currentTask.user === 'undefined') {
      return res.status(404).json({username: null})
    }

    const user = await User.findById(currentTask.user)
    console.log(user)

    if (user) {
      res.json({ username: user.username })
    } else {
      res.json({username: null})
    }

    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}

exports.delete = async (req, res) => {
  const { user } = req
  const { taskId } = req.params

  try {
    if (!user) {
      throw new Error('User not found');
    }
    if (user.role !== 'Админ') {
      return res.status(403).json({ error: 'У вас нет на это право' });
    }

    const currentTask = await Task.findById(taskId)
    await Task.deleteOne({ _id: taskId })
    const tasks = await Task.find({ section: currentTask.section }).sort('postition')
    for (const key in tasks) {
      await Task.findByIdAndUpdate(
        tasks[key].id,
        { $set: { position: key } }
      )
    }
    res.status(200).json('deleted')
  } catch (err) {
    res.status(500).json(err)
  }
}

exports.updatePosition = async (req, res) => {
  const { user } = req
  const {
    resourceList,
    destinationList,
    resourceSectionId,
    destinationSectionId
  } = req.body
  const resourceListReverse = resourceList.reverse()
  const destinationListReverse = destinationList.reverse()

  try {
    if (!user) {
      throw new Error('User not found');
    }
    if (user.role !== 'Админ') {
      return res.status(403).json({ error: 'У вас нет на это право' });
    }

    if (resourceSectionId !== destinationSectionId) {
      for (const key in resourceListReverse) {
        await Task.findByIdAndUpdate(
          resourceListReverse[key].id,
          {
            $set: {
              section: resourceSectionId,
              position: key
            }
          }
        )
      }
    }
    for (const key in destinationListReverse) {
      await Task.findByIdAndUpdate(
        destinationListReverse[key].id,
        {
          $set: {
            section: destinationSectionId,
            position: key
          }
        }
      )
    }
    res.status(200).json('updated')
  } catch (err) {
    res.status(500).json(err)
  }
}