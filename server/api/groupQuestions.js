const router = require('express').Router()
const { models: { GroupQuestion }} = require('../db')
module.exports = router


router.get('/', async (req, res, next) => {
  try {
    const groupQuestions = await GroupQuestion.findAll();
    res.json(groupQuestions);
  } catch (err) {
    next(err);
  }
});

//POST: add a new GroupQuestion
router.post("/", async (req, res, next) => {
  try {
    res.status(201).send(await GroupQuestion.create(req.body));
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const groupQuestion = await GroupQuestion.findByPk(req.params.id)
    res.send(await groupQuestion.update(req.body));
  } catch (error) {
    next(error);
  }
});

//Get read all groupQuestions
router.get('/:id', async (req, res, next) => {
  try {
    const groupQuestion = await GroupQuestion.findByPk(req.params.id,);
    res.json(groupQuestion);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const groupQuestion = await GroupQuestion.findByPk(req.params.id);
    await groupQuestion.destroy();
    res.send(groupQuestion);
  } catch (error) {
    next(error);
  }
});
