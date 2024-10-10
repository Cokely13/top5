const router = require('express').Router()
const { models: { UserResponse, User, Question }} = require('../db')
module.exports = router


router.get('/', async (req, res, next) => {
  try {
    const userResponses = await UserResponse.findAll({
      include: [  { model: User, attributes: ['id', 'username'] }, Question
    ],
    });
    res.json(userResponses);
  } catch (err) {
    next(err);
  }
});

//POST: add a new UserResponse
router.post("/", async (req, res, next) => {
  try {
    res.status(201).send(await UserResponse.create(req.body));
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const userResponse = await UserResponse.findByPk(req.params.id)
    res.send(await userResponse.update(req.body));
  } catch (error) {
    next(error);
  }
});

//Get read all userResponses
router.get('/:id', async (req, res, next) => {
  try {
    const userResponse = await UserResponse.findByPk(req.params.id, {
      include: [  { model: User, attributes: ['id', 'username'] }, Question
      ],
    });
    res.json(userResponse);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const userResponse = await UserResponse.findByPk(req.params.id);
    await userResponse.destroy();
    res.send(userResponse);
  } catch (error) {
    next(error);
  }
});
