const Sequelize = require('sequelize');
const db = require('../db');

const GroupMember = db.define('group_member', {
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  groupId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'groups',
      key: 'id',
    },
  },
});

module.exports = GroupMember;
