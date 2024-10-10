const Sequelize = require('sequelize');
const db = require('../db');

const UserResponse = db.define('user_response', {
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  questionId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'questions',
      key: 'id',
    },
  },
  response: {
    type: Sequelize.ENUM('option_a', 'option_b'),
    allowNull: false,
  },
});

module.exports = UserResponse;
