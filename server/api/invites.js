const router = require('express').Router();
const {
  models: { Invite, User, Group, GroupMember },
} = require('../db');

module.exports = router;

// GET: Get all invites with details of users and groups
router.get('/', async (req, res, next) => {
  try {
    const invites = await Invite.findAll({
      include: [
        { model: User, as: 'inviter', attributes: ['id', 'username'] }, // Inviter details
        { model: User, as: 'invitee', attributes: ['id', 'username'] }, // Invitee details
        { model: Group, attributes: ['id', 'name'] }, // Group details
      ],
    });
    res.json(invites);
  } catch (err) {
    next(err);
  }
});

// POST: Add a new Invite
router.post('/', async (req, res, next) => {
  try {
    const newInvite = await Invite.create(req.body);
    res.status(201).send(newInvite);
  } catch (error) {
    next(error);
  }
});

// PUT: Update an Invite status (accept/reject)
router.put('/:id', async (req, res, next) => {
  try {
    const invite = await Invite.findByPk(req.params.id);
    if (!invite) {
      return res.status(404).send('Invite not found');
    }

    // Update the invite status
    const updatedInvite = await invite.update(req.body);

    // If the invite is accepted, add the user to the group as a member
    if (updatedInvite.status === 'accepted') {
      const groupId = updatedInvite.groupId;
      const userId = updatedInvite.inviteeId;

      // Check if the user is already a member of the group
      const existingMember = await GroupMember.findOne({ where: { groupId, userId } });

      // Add the user to the group if they are not already a member
      if (!existingMember) {
        await GroupMember.create({ groupId, userId });
      }
    }

    res.send(updatedInvite);
  } catch (error) {
    next(error);
  }
});

// GET: Get a specific Invite by ID
router.get('/:id', async (req, res, next) => {
  try {
    const invite = await Invite.findByPk(req.params.id, {
      include: [
        { model: User, as: 'inviter', attributes: ['id', 'username'] },
        { model: User, as: 'invitee', attributes: ['id', 'username'] },
        { model: Group, attributes: ['id', 'name'] },
      ],
    });
    if (!invite) {
      return res.status(404).send('Invite not found');
    }
    res.json(invite);
  } catch (err) {
    next(err);
  }
});

// DELETE: Delete an Invite
router.delete('/:id', async (req, res, next) => {
  try {
    const invite = await Invite.findByPk(req.params.id);
    if (!invite) {
      return res.status(404).send('Invite not found');
    }
    await invite.destroy();
    res.send(invite);
  } catch (error) {
    next(error);
  }
});
