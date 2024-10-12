const router = require('express').Router()
const { models: { Guess, User, Question }} = require('../db')

router.get('/', async (req, res, next) => {
  try {
    const guesses = await Guess.findAll({include: [User, Question, ]})
    res.json(guesses)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const guess = await Guess.findByPk(req.params.id, {include: [User, Question]});
    res.json(guess);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    res.status(201).send(await Guess.create(req.body));
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const guess = await Guess.findByPk(req.params.id);
    res.send(await guess.update(req.body));
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const guess = await Guess.findByPk(req.params.id);
    await guess.destroy();
    res.send(guess);
  } catch (error) {
    next(error);
  }
});







module.exports = router
