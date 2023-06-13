const Section = require('../models/section')
const Task = require('../models/task')

exports.create = async (req, res) => {
  const { user } = req
  const { boardId } = req.params

  try {
    if (!user) {
      throw new Error('User not found');
    }
    if (user.role !== 'Админ') {
      return res.status(403).json({ error: 'У вас нет на это право' });
    }

    const section = await Section.create({ board: boardId })
    section._doc.tasks = []
    res.status(201).json(section)
  } catch (err) {
    res.status(500).josn(err)
  }
}

exports.update = async (req, res) => {
  const { user } = req
  const { sectionId } = req.params

  try {
    if (!user) {
      throw new Error('User not found');
    }
    if (user.role !== 'Админ') {
      return res.status(403).json({ error: 'У вас нет на это право' });
    }

    const section = await Section.findByIdAndUpdate(
      sectionId,
      { $set: req.body }
    )
    section._doc.tasks = []
    res.status(200).json(section)
  } catch (err) {
    res.status(500).josn(err)
  }
}

exports.delete = async (req, res) => {
  const { user } = req
  const { sectionId } = req.params

  try {
    if (!user) {
      throw new Error('User not found');
    }
    if (user.role !== 'Админ') {
      return res.status(403).json({ error: 'У вас нет на это право' });
    }

    await Task.deleteMany({ section: sectionId })
    await Section.deleteOne({ _id: sectionId })
    res.status(200).json('deleted')
  } catch (err) {
    res.status(500).josn(err)
  }
}