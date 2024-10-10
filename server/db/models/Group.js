const Sequelize = require('sequelize');
const db = require('../db');

const Group = db.define('group', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  leaderId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  image: {
    type: Sequelize.STRING,
    defaultValue: '/group.jpg' // Provide a default image if needed
  },
});

module.exports = Group;
