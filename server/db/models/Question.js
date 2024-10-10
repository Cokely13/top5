const Sequelize = require('sequelize');
const db = require('../db');

const Question = db.define('question', {
  text: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  image: {
         type: Sequelize.STRING,
         defaultValue: '/q.jpg',
       },
  dateAsked: {
    type: Sequelize.DATEONLY,
    unique: true,
  },
  expired: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  createdBy: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  status: {
    type: Sequelize.ENUM('waiting', 'accepted', 'rejected'),
    allowNull: false,
    defaultValue: 'waiting',
  },
});

module.exports = Question;
