const Sequelize = require('sequelize');
const db = require('../db');

const Answer = db.define('answer', {
  text: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  rank: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = Answer;
