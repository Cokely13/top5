const Sequelize = require('sequelize');
const db = require('../db');
const User = require('./User');

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
  category: {
    type: Sequelize.ENUM('Sports','Food', 'Places', 'Entertainment', 'Other'),
    defaultValue: 'Other',
  },
  dailyWinnerId: {
    type: Sequelize.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
    allowNull: true,
  },
});

module.exports = Question;
