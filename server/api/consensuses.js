const router = require('express').Router()
const { models: { Consensus, Question }} = require('../db')
module.exports = router


router.get('/', async (req, res, next) => {
  try {
    const consensuses = await Consensus.findAll({ include: [ Question
    ]});
    res.json(consensuses);
  } catch (err) {
    next(err);
  }
});

//POST: add a new Consensus
router.post("/", async (req, res, next) => {
  try {
    res.status(201).send(await Consensus.create(req.body));
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const consensus = await Consensus.findByPk(req.params.id)
    res.send(await consensus.update(req.body));
  } catch (error) {
    next(error);
  }
});

//Get read all consensuses
router.get('/:id', async (req, res, next) => {
  try {
    const consensus = await Consensus.findByPk(req.params.id, { include: [ Question
    ]});
    res.json(consensus);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const consensus = await Consensus.findByPk(req.params.id);
    await consensus.destroy();
    res.send(consensus);
  } catch (error) {
    next(error);
  }
});
