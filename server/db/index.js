const db = require('./db')

const Question = require('./models/Question');
const Answer = require('./models/Answer');
const UserScore = require('./models/UserScore')
const Guess = require('./models/Guess')
const User = require('./models/User')

// Associations:

Question.hasMany(Answer, { as: 'answers' });
Answer.belongsTo(Question);

// Associations between User and UserScore
User.hasMany(UserScore);
UserScore.belongsTo(User);

User.belongsToMany(Question, { through: Guess });
Question.belongsToMany(User, { through: Guess });

Guess.belongsTo(User);
Guess.belongsTo(Question);

module.exports = {
  db,
  models: {
    User,
    Question,
    Answer,
    UserScore,
    Guess
  },
}
