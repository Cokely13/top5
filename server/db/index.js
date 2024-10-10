const db = require('./db')

const Question = require('./models/Question');
const Answer = require('./models/Answer');
const UserScore = require('./models/UserScore')
const UserGuess = require('./models/UserGuess')
const User = require('./models/User')

//associations:

Question.hasMany(Answer, { as: 'answers' });
Answer.belongsTo(Question);

// Associations between User and UserScore
User.hasMany(UserScore);
UserScore.belongsTo(User);

User.belongsToMany(Question, { through: UserGuess });
Question.belongsToMany(User, { through: UserGuess });

UserGuess.belongsTo(User);
UserGuess.belongsTo(Question);


module.exports = {
  db,
  models: {
    User,
    Question,
    Answer,
    UserScore,
    UserGuess
  },
}
