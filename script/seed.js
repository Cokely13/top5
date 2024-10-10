'use strict'

const {db, models: {User, Question, Consensus, UserResponse} } = require('../server/db')

/**
 * seed - this function clears the database, updates tables to
 *      match the models, and populates the database.
 */
async function seed() {
  await db.sync({ force: true }) // clears db and matches models to tables
  console.log('db synced!')

  // Creating Users
  const users = await Promise.all([
    User.create({ username: 'Ryan', admin: true, email: "ryan.cokely@gmail.com",  password: '123', admin: true }),
    User.create({ username: 'Matt', email: "mclaise@gmail.com",  password: '123'}),
    User.create({ username: 'Scott', email: "scottlcokely@gmail.com",  password: '123'}),
    User.create({ username: 'Jamal', email: "jamalcoston@gmail.com",  password: '123'}),
  ])




  // Helper function to add days to a date
  const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toISOString().split('T')[0]; // Convert to YYYY-MM-DD format
  };

  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

  // Creating Questions with dates
  const questions = await Promise.all([
    Question.create({ text: "Pick a Song", optionA: "Wonderwall", optionB: "Champagne Supernova", dateAsked: addDays(today, -1), status: "accepted", imageA: '/wonderwall.jpg', imageB: '/champagne supernova.webp' }),
    Question.create({ text: "Pick an Actor", optionA: "Al Pacino", optionB: "Robert Deniro", dateAsked: today, status: "accepted", imageA: '/pacino.jpeg', imageB: '/deniro.jpg' }),
    Question.create({ text: "Pick an Actor", optionA: "Ben Affleck", optionB: "Matt Damon", dateAsked: addDays(today, 1), status: "accepted", imageA: '/affleck.webp', imageB: '/damon.jpg' }),
    Question.create({ text: "Pick a Food", optionA: "Cheez Itz", optionB: "Goldfish", dateAsked: addDays(today, 2), status: "accepted", imageA: '/Cheez-It-Crackers.jpg', imageB: '/goldfish.jpeg' }),
    Question.create({ text: "Pick a Food", optionA: "Hot Dog", optionB: "Burger", dateAsked: addDays(today, 3), status: "accepted", imageA: '/burger.jpeg', imageB: '/hotdog.jpeg' }),
    Question.create({ text: "Pick a Food", optionA: "PeanutButter", optionB: "Jelly", dateAsked: addDays(today, 4), status: "accepted", imageA: '/peanut-butter-healthy.jpg', imageB: '/jelly.jpg' }),
    Question.create({ text: "Pick a Singer", optionA: "Billy Joel", optionB: "Bruce Springsteen", dateAsked: addDays(today, 5), status: "accepted", imageA: '/billy.webp', imageB: '/bruce.jpg' }),
    Question.create({ text: "Pick a Singer", optionA: "Whitney Houston", optionB: "Mariah Carey", dateAsked: addDays(today, 6), status: "accepted", imageA: '/whitney.jpg', imageB: '/mariah.jpg'  }),
  ]);


  // const consensuses = await Promise.all([
  // //  Consensus.create({ questionId: 2, consensusAnswer: "option_a", calculatedAt: today }),
  //  Consensus.create({ questionId: 1, consensusAnswer: "option_a", calculatedAt: today })
  // ])

  const userResponses = await Promise.all([
    UserResponse.create({ userId: 1, questionId: 2, response: "option_a" }),
    UserResponse.create({ userId: 1, questionId: 1, response: "option_a" }),
    UserResponse.create({ userId: 2, questionId: 2, response: "option_a" }),
    UserResponse.create({ userId: 2, questionId: 1, response: "option_a" }),
    UserResponse.create({ userId: 4, questionId: 1, response: "option_b" }),
    // UserResponse.create({ userId: 3, questionId: 2, response: "option_a" }),
    UserResponse.create({ userId: 4, questionId: 2, response: "option_b" }),
    // UserResponse.create({ userId: 1, questionId: 2, response: "option_a" }),
   ])

  console.log(`seeded ${users.length} users`)
  console.log(`seeded successfully`)
  return {
    users: {
      cody: users[0],
      murphy: users[1]
    }
  }
}

/*
 We've separated the `seed` function from the `runSeed` function.
 This way we can isolate the error handling and exit trapping.
 The `seed` function is concerned only with modifying the database.
*/
async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

/*
  Execute the `seed` function, IF we ran this module directly (`node seed`).
  `Async` functions always return a promise, so we can use `catch` to handle
  any errors that might occur inside of `seed`.
*/
if (module === require.main) {
  runSeed()
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed
