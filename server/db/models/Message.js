// server/db/models/Message.js
const Sequelize = require('sequelize');
const db = require('../db');

const Message = db.define('message', {
  content: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
});

module.exports = Message;
