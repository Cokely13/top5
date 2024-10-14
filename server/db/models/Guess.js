const Sequelize = require('sequelize');
const db = require('../db');

const Guess = db.define('Guess', {
  pointsEarned: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  guess: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  rank: {
    type: Sequelize.INTEGER,
    allowNull: true, // Initially null; set upon correct guess
  },
  strikes: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  questionId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = Guess;
