const router = require('express').Router()
const { models: { Guess, User, Question, Answer }} = require('../db')

router.get('/', async (req, res, next) => {
  try {
    const guesses = await Guess.findAll({include: [User, Question, ]})
    res.json(guesses)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const guess = await Guess.findByPk(req.params.id, {include: [User, Question]});
    res.json(guess);
  } catch (err) {
    next(err);
  }
});



// router.post('/', async (req, res, next) => {
//   try {
//     const { guess, userId, questionId } = req.body;

//     if (!guess || !userId || !questionId) {
//       return res.status(400).json({ message: 'Guess, userId, and questionId are required.' });
//     }

//     // Fetch the question along with its answers
//     const question = await Question.findByPk(questionId, {
//       include: [{ model: Answer, as: 'answers' }],
//     });

//     if (!question) {
//       return res.status(404).json({ message: 'Question not found.' });
//     }

//     // Check if the guess matches any answer
//     const matchedAnswer = question.answers.find(
//       (ans) => ans.text.toLowerCase() === guess.trim().toLowerCase()
//     );

//     let rank = null;
//     let pointsEarned = 0;
//     let strikes = 0;

//     if (matchedAnswer) {
//       // Correct guess
//       rank = matchedAnswer.rank;
//       pointsEarned = 10 - matchedAnswer.rank + 1; // Example scoring: higher rank = more points
//     } else {
//       // Incorrect guess
//       strikes = 1; // Increment strikes by 1 for each incorrect guess
//     }

//     // Create the Guess record
//     const newGuess = await Guess.create({
//       guess: guess.trim(),
//       rank,
//       pointsEarned,
//       strikes,
//       userId,
//       questionId,
//     });

//     // Update user's totalPoints if pointsEarned > 0
//     if (pointsEarned > 0) {
//       const user = await User.findByPk(userId);
//       user.totalPoints += pointsEarned;
//       await user.save();
//     }

//     res.status(201).json(newGuess);
//   } catch (error) {
//     next(error);
//   }
// });

router.post('/', async (req, res, next) => {
  try {
    const { guess, userId, questionId } = req.body;

    if (!guess || !userId || !questionId) {
      return res.status(400).json({ message: 'Guess, userId, and questionId are required.' });
    }

    // Fetch the question along with its answers
    const question = await Question.findByPk(questionId, {
      include: [{ model: Answer, as: 'answers' }],
    });

    if (!question) {
      return res.status(404).json({ message: 'Question not found.' });
    }

    // Check if the guess matches any answer
    const matchedAnswer = question.answers.find(
      (ans) => ans.text.toLowerCase() === guess.trim().toLowerCase()
    );

    let rank = null;
    let pointsEarned = 0;
    let strikes = 0;

    if (matchedAnswer) {
      // Correct guess
      rank = matchedAnswer.rank;

      if (matchedAnswer.rank <= 5) {
        // Top 5 answer
        pointsEarned = 10 - matchedAnswer.rank + 1; // Adjust scoring as needed
      } else {
        // Answer rank > 5, no points, no strike
        pointsEarned = 0;
        // No strikes added
      }
    } else {
      // Incorrect guess
      strikes = 1; // Increment strikes by 1 for each incorrect guess
    }

    // Create the Guess record
    const newGuess = await Guess.create({
      guess: guess.trim(),
      rank,
      pointsEarned,
      strikes,
      userId,
      questionId,
    });

    // Update user's totalPoints if pointsEarned > 0
    if (pointsEarned > 0) {
      const user = await User.findByPk(userId);
      user.totalPoints += pointsEarned;
      await user.save();
    }

    res.status(201).json(newGuess);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const guess = await Guess.findByPk(req.params.id);
    res.send(await guess.update(req.body));
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const guess = await Guess.findByPk(req.params.id);
    await guess.destroy();
    res.send(guess);
  } catch (error) {
    next(error);
  }
});







module.exports = router
