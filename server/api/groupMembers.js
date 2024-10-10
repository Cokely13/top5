

const router = require('express').Router();
const { models: { GroupMember, User, Group } } = require('../db');
module.exports = router;

// GET: Get all group members with associated user and group details
router.get('/', async (req, res, next) => {
  try {
    const groupMembers = await GroupMember.findAll({
      include: [
        { model: User, attributes: ['id', 'username'] }, // Include user details
        { model: Group, attributes: ['id', 'name'] },    // Include group details
      ],
    });
    res.json(groupMembers);
  } catch (err) {
    next(err);
  }
});

// POST: Add a new GroupMember
router.post('/', async (req, res, next) => {
  try {
    const newGroupMember = await GroupMember.create(req.body);
    res.status(201).send(newGroupMember);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).send('User is already a member of this group.');
    } else {
      next(error);
    }
  }
});

// PUT: Update an existing GroupMember
router.put('/:id', async (req, res, next) => {
  try {
    const groupMember = await GroupMember.findByPk(req.params.id);
    if (!groupMember) {
      return res.status(404).send('Group member not found');
    }
    const updatedGroupMember = await groupMember.update(req.body);
    res.send(updatedGroupMember);
  } catch (error) {
    next(error);
  }
});

// GET: Get a specific GroupMember by ID with associated user and group details
router.get('/:id', async (req, res, next) => {
  try {
    const groupMember = await GroupMember.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['id', 'username'] }, // Include user details
        { model: Group, attributes: ['id', 'name'] },    // Include group details
      ],
    });
    if (!groupMember) {
      return res.status(404).send('Group member not found');
    }
    res.json(groupMember);
  } catch (err) {
    next(err);
  }
});

// DELETE: Delete a GroupMember
router.delete('/:id', async (req, res, next) => {
  try {
    const groupMember = await GroupMember.findByPk(req.params.id);
    if (!groupMember) {
      return res.status(404).send('Group member not found');
    }
    await groupMember.destroy();
    res.send(groupMember);
  } catch (error) {
    next(error);
  }
});
