const Sequelize = require('sequelize');
const db = require('../db');

const Guess = db.define('Guess', {
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

module.exports = Guess;
