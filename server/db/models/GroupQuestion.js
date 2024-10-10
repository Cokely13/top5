const Sequelize = require('sequelize');
const db = require('../db');

const GroupQuestion = db.define('group_question', {
  groupId: {
    type: Sequelize.INTEGER,
    allowNull: false,
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
});

module.exports = GroupQuestion;
