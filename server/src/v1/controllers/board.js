const Board = require('../models/board')
const Section = require('../models/section')
const Task = require('../models/task')
const User = require('../models/user')

exports.create = async (req, res) => {
  const { user } = req
  try {
    if (!user) {
      throw new Error('User not found');
    }

    if (user.role !== 'Админ') {
      return res.status(403).json({ error: 'У вас нет на это право' });
    }


    const boardsCount = await Board.find().count()
    const board = await Board.create({
      user: req.user._id,
      position: boardsCount > 0 ? boardsCount : 0
    })
    res.status(201).json(board)
  } catch (err) {
    res.status(500).json(err)
  }
}

exports.getAll = async (req, res) => {
  try {
    const boards = await Board.find({ user: req.user._id }).sort('-position')
    res.status(200).json(boards)
  } catch (err) {
    res.status(500).json(err)
  }
}

exports.updatePosition = async (req, res) => {
  const { boards } = req.body
  try {
    for (const key in boards.reverse()) {
      const board = boards[key]
      await Board.findByIdAndUpdate(
        board.id,
        { $set: { position: key } }
      )
    }
    res.status(200).json('updated')
  } catch (err) {
    res.status(500).json(err)
  }
}

exports.getOne = async (req, res) => {
  const { boardId } = req.params
  try {
    const board = await Board.findOne({ user: req.user._id, _id: boardId })
    if (!board) return res.status(404).json('Board not found')
    const sections = await Section.find({ board: boardId })
    for (const section of sections) {
      const tasks = await Task.find({ section: section.id }).populate('section').sort('-position')
      section._doc.tasks = tasks
    }
    board._doc.sections = sections
    res.status(200).json(board)
  } catch (err) {
    res.status(500).json(err)
  }
}

exports.update = async (req, res) => {
  const { user } = req
  const { boardId } = req.params
  const { title, description, favourite } = req.body

  try {
    if (!user) {
      throw new Error('User not found');
    }

    if (user.role !== 'Админ') {
      return res.status(403).json({ error: 'У вас нет на это право' });
    }

    
    if (title === '') req.body.title = 'Untitled'
    if (description === '') req.body.description = 'Add description here'
    const currentBoard = await Board.findById(boardId)
    if (!currentBoard) return res.status(404).json('Board not found')

    if (favourite !== undefined && currentBoard.favourite !== favourite) {
      const favourites = await Board.find({
        user: currentBoard.user,
        favourite: true,
        _id: { $ne: boardId }
      }).sort('favouritePosition')
      if (favourite) {
        req.body.favouritePosition = favourites.length > 0 ? favourites.length : 0
      } else {
        for (const key in favourites) {
          const element = favourites[key]
          await Board.findByIdAndUpdate(
            element.id,
            { $set: { favouritePosition: key } }
          )
        }
      }
    }

    const board = await Board.findByIdAndUpdate(
      boardId,
      { $set: req.body }
    )
    res.status(200).json(board)
  } catch (err) {
    res.status(500).json(err)
  }
}

exports.getFavourites = async (req, res) => {
  try {
    const favourites = await Board.find({
      user: req.user._id,
      favourite: true
    }).sort('-favouritePosition')
    res.status(200).json(favourites)
  } catch (err) {
    res.status(500).json(err)
  }
}

exports.updateFavouritePosition = async (req, res) => {
  const { boards } = req.body
  try {
    for (const key in boards.reverse()) {
      const board = boards[key]
      await Board.findByIdAndUpdate(
        board.id,
        { $set: { favouritePosition: key } }
      )
    }
    res.status(200).json('updated')
  } catch (err) {
    res.status(500).json(err)
  }
}

exports.delete = async (req, res) => {
  const { user } = req
  const { boardId } = req.params
  try {
    console.log(user.role)
    if (!user) {
      throw new Error('User not found');
    }

    if (user.role !== 'Админ') {
      return res.status(403).json({ error: 'У вас нет на это право' });
    }
    const sections = await Section.find({ board: boardId })
    for (const section of sections) {
      await Task.deleteMany({ section: section.id })
    }
    await Section.deleteMany({ board: boardId })

    const currentBoard = await Board.findById(boardId)

    if (currentBoard.favourite) {
      const favourites = await Board.find({
        user: currentBoard.user,
        favourite: true,
        _id: { $ne: boardId }
      }).sort('favouritePosition')

      for (const key in favourites) {
        const element = favourites[key]
        await Board.findByIdAndUpdate(
          element.id,
          { $set: { favouritePosition: key } }
        )
      }
    }

    await Board.deleteOne({ _id: boardId })

    const boards = await Board.find().sort('position')
    for (const key in boards) {
      const board = boards[key]
      await Board.findByIdAndUpdate(
        board.id,
        { $set: { position: key } }
      )
    }

    res.status(200).json('deleted')
  } catch (err) {
    res.status(500).json(err)
  }
}

exports.pushUser = async (req, res) => {
  const { boardId } = req.params;
  const { username } = req.body;

  try {
    console.log(boardId)
    console.log(username)


    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ error: 'Доска не найдена' });
    }

    const foundUser = await User.findOne({ username: username });
    if (!foundUser) {
      return res.status(404).json({ error: 'Пользователь не найден' })
    }

    board.user.push(foundUser); // Добавление нового ID пользователя в поле user

    const updatedBoard = await board.save();

    res.json(updatedBoard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}
