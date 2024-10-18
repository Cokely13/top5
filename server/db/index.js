const db = require('./db');

const Question = require('./models/Question');
const Answer = require('./models/Answer');
const UserScore = require('./models/UserScore');
const Guess = require('./models/Guess');
const User = require('./models/User');

// Associations:

Question.hasMany(Answer, { as: 'answers' });
Answer.belongsTo(Question);

// Associations between User and UserScore
User.hasMany(UserScore);
UserScore.belongsTo(User);

// One-to-Many Associations for Guesses
User.hasMany(Guess, { foreignKey: 'userId' });
Guess.belongsTo(User, { foreignKey: 'userId' });

Question.hasMany(Guess, { foreignKey: 'questionId' });
Guess.belongsTo(Question, { foreignKey: 'questionId' });

module.exports = {
  db,
  models: {
    User,
    Question,
    Answer,
    UserScore,
    Guess
  },
};
