// server/api/messages.js

const router = require('express').Router();
const {  models: {Message, User, Group}, } = require('../db');

router.get('/:groupId', async (req, res, next) => {
  try {
    const messages = await Message.findAll({
      where: { groupId: req.params.groupId },
      include: [{ model: User, attributes: ['id', 'username', 'image'] }]
    });
    res.json(messages);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const message = await Message.create(req.body);
    res.status(201).json(message);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const message = await Message.findByPk(req.params.id);
    await message.destroy();
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
