// server/models/Invite.js
const Sequelize = require('sequelize');
const db = require('../db');

const Invite = db.define('invite', {
  status: {
    type: Sequelize.ENUM('pending', 'accepted', 'rejected'),
    defaultValue: 'pending',
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
});

module.exports = Invite;
