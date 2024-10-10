const Sequelize = require('sequelize');
const db = require('../db');

const Consensus = db.define('consensus', {
  groupId: {
    type: Sequelize.INTEGER,
    references: {
      model: 'groups',
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
  consensusAnswer: {
    type: Sequelize.ENUM('option_a', 'option_b'),
    allowNull: false,
  },
  calculatedAt: {
    type: Sequelize.DATE,
    allowNull: false,
  },
});

module.exports = Consensus;
