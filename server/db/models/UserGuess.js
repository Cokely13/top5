const Sequelize = require('sequelize');
const db = require('../db');

const UserGuess = db.define('userGuess', {
  strikeCount: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  pointsEarned: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});

module.exports = UserGuess;
