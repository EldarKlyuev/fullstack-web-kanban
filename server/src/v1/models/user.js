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
  completedTasksCount: { type: Number, default: 0 }
}, schemaOptions)

module.exports = mongoose.model('User', userSchema)