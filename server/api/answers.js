const router = require('express').Router()
const { models: { Answer, Question }} = require('../db')

router.get('/', async (req, res, next) => {
  try {
    const answers = await Answer.findAll({include: [Question]})
    res.json(answers)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const answer = await Answer.findByPk(req.params.id, {include: [Question]});
    res.json(answer);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    res.status(201).send(await Answer.create(req.body));
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const answer = await Answer.findByPk(req.params.id);
    res.send(await answer.update(req.body));
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const answer = await Answer.findByPk(req.params.id);
    await answer.destroy();
    res.send(answer);
  } catch (error) {
    next(error);
  }
});







module.exports = router
