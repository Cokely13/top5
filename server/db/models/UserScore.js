const Sequelize = require('sequelize');
const db = require('../db');

const UserScore = db.define('userScore', {
  date: {
    type: Sequelize.DATEONLY,
    allowNull: false,
  },
  dailyScore: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  totalScore: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});

module.exports = UserScore;
