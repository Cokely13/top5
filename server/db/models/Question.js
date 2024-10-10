const Sequelize = require('sequelize');
const db = require('../db');

const Question = db.define('question', {
  text: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  optionA: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  imageA: {
    type: Sequelize.STRING,
    defaultValue: '/q.jpg', // Provide a default image if needed
  },
  imageB: {
    type: Sequelize.STRING,
    defaultValue: '/q.jpg', // Provide a default image if needed
  },
  optionB: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  dateAsked: {
    type: Sequelize.DATEONLY,
    unique: true
  },
  expired: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  createdBy: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  status: {
    type: Sequelize.ENUM('waiting', 'accepted', 'rejected'),
    allowNull: false,
    defaultValue: 'waiting'
  }
});

module.exports = Question;
