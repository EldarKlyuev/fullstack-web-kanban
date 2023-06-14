const mongoose = require('mongoose')
const { schemaOptions } = require('./modelOptions')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  completedTasksCount: { 
    type: Number, 
    default: 0 
  },
  telegram: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    require: true,
    default: 'Пользователь'
  },
  currentTask: {
    type: String,
    require: true,
    default: 'Без задачи'
  },
  complitedTasks: [{
    type: String,
    require: true,
    default: 'Ещё не было выполненных задач'
  }]
}, schemaOptions)

module.exports = mongoose.model('User', userSchema)