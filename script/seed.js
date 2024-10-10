// 'use strict'

// const { db, models: { User, Question, Answer } } = require('../server/db')

// /**
//  * seed - this function clears the database, updates tables to
//  *      match the models, and populates the database.
//  */
// async function seed() {
//   await db.sync({ force: true }) // clears db and matches models to tables
//   console.log('db synced!')

//   // Creating Users
//   const users = await Promise.all([
//     User.create({ username: 'Ryan', admin: true, email: "ryan.cokely@gmail.com", password: '123', admin: true }),
//     User.create({ username: 'Matt', email: "mclaise@gmail.com", password: '123' }),
//     User.create({ username: 'Scott', email: "scottlcokely@gmail.com", password: '123' }),
//     User.create({ username: 'Jamal', email: "jamalcoston@gmail.com", password: '123' }),
//   ])

//   // Helper function to add days to a date
//   const addDays = (date, days) => {
//     const result = new Date(date)
//     result.setDate(result.getDate() + days)
//     return result.toISOString().split('T')[0] // Convert to YYYY-MM-DD format
//   }

//   const today = new Date().toISOString().split('T')[0] // Get today's date in YYYY-MM-DD format

//   // Creating Questions with dates
//   // const questions = await Promise.all([
//   //   Question.create({
//   //     text: "Pick a Song",
//   //     optionA: "Wonderwall",
//   //     optionB: "Champagne Supernova",
//   //     dateAsked: addDays(today, -1),
//   //     status: "accepted",
//   //     imageA: '/wonderwall.jpg',
//   //     imageB: '/champagne_supernova.webp'
//   //   }),
//   //   Question.create({
//   //     text: "Pick an Actor",
//   //     optionA: "Al Pacino",
//   //     optionB: "Robert Deniro",
//   //     dateAsked: today,
//   //     status: "accepted",
//   //     imageA: '/pacino.jpeg',
//   //     imageB: '/deniro.jpg'
//   //   }),
//   // ])

//   // Creating a new Question: "What is the most popular color?"
//   const popularColorQuestion = await Question.create({
//     text: "What is the most popular color?",
//     dateAsked: today,
//     status: "accepted"
//   })

//   // Creating 10 Ranked Answers for the "What is the most popular color?" Question
//   const colorAnswers = await Promise.all([
//     Answer.create({ text: 'Blue', rank: 1, questionId: popularColorQuestion.id }),
//     Answer.create({ text: 'Red', rank: 2, questionId: popularColorQuestion.id }),
//     Answer.create({ text: 'Green', rank: 3, questionId: popularColorQuestion.id }),
//     Answer.create({ text: 'Yellow', rank: 4, questionId: popularColorQuestion.id }),
//     Answer.create({ text: 'Purple', rank: 5, questionId: popularColorQuestion.id }),
//     Answer.create({ text: 'Pink', rank: 6, questionId: popularColorQuestion.id }),
//     Answer.create({ text: 'Black', rank: 7, questionId: popularColorQuestion.id }),
//     Answer.create({ text: 'White', rank: 8, questionId: popularColorQuestion.id }),
//     Answer.create({ text: 'Orange', rank: 9, questionId: popularColorQuestion.id }),
//     Answer.create({ text: 'Gray', rank: 10, questionId: popularColorQuestion.id }),
//   ])

//   console.log(`seeded ${users.length} users`)
//   console.log(`seeded ${colorAnswers.length} answers`)
//   console.log(`seeded successfully`)
//   return {
//     users: {
//       ryan: users[0],
//       matt: users[1],
//       scott: users[2],
//       jamal: users[3],
//     },
//     answers: {
//       blue: colorAnswers[0],
//       red: colorAnswers[1],
//       green: colorAnswers[2],
//       yellow: colorAnswers[3],
//       purple: colorAnswers[4],
//       pink: colorAnswers[5],
//       black: colorAnswers[6],
//       white: colorAnswers[7],
//       orange: colorAnswers[8],
//       gray: colorAnswers[9],
//     }
//   }
// }

// /*
//  We've separated the `seed` function from the `runSeed` function.
//  This way we can isolate the error handling and exit trapping.
//  The `seed` function is concerned only with modifying the database.
// */
// async function runSeed() {
//   console.log('seeding...')
//   try {
//     await seed()
//   } catch (err) {
//     console.error(err)
//     process.exitCode = 1
//   } finally {
//     console.log('closing db connection')
//     await db.close()
//     console.log('db connection closed')
//   }
// }

// /*
//   Execute the `seed` function, IF we ran this module directly (`node seed`).
//   `Async` functions always return a promise, so we can use `catch` to handle
//   any errors that might occur inside of `seed`.
// */
// if (module === require.main) {
//   runSeed()
// }

// // we export the seed function for testing purposes (see `./seed.spec.js`)
// module.exports = seed

'use strict'

const { db, models: { User, Question, Answer } } = require('../server/db')

/**
 * seed - this function clears the database, updates tables to
 *      match the models, and populates the database.
 */
async function seed() {
  await db.sync({ force: true }) // clears db and matches models to tables
  console.log('db synced!')

  // Creating Users
  const users = await Promise.all([
    User.create({
      username: 'Ryan',
      admin: true,
      email: "ryan.cokely@gmail.com",
      password: '123'
    }),
    User.create({
      username: 'Matt',
      email: "mclaise@gmail.com",
      password: '123'
    }),
    User.create({
      username: 'Scott',
      email: "scottlcokely@gmail.com",
      password: '123'
    }),
    User.create({
      username: 'Jamal',
      email: "jamalcoston@gmail.com",
      password: '123'
    }),
  ])

  // Helper function to add days to a date
  const addDays = (date, days) => {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result.toISOString().split('T')[0] // Convert to YYYY-MM-DD format
  }

  const today = new Date().toISOString().split('T')[0] // Get today's date in YYYY-MM-DD format

  // Creating a new Question: "What is the most popular color?"
  const popularColorQuestion = await Question.create({
    text: "What is the most popular color?",
    dateAsked: today,
    status: "accepted",
    createdBy: users[0].id // Assigning to a user, e.g., Ryan
  })

  // Creating 10 Ranked Answers for the "What is the most popular color?" Question
  const colorAnswers = await Promise.all([
    Answer.create({ text: 'Blue', rank: 1, questionId: popularColorQuestion.id }),
    Answer.create({ text: 'Red', rank: 2, questionId: popularColorQuestion.id }),
    Answer.create({ text: 'Green', rank: 3, questionId: popularColorQuestion.id }),
    Answer.create({ text: 'Yellow', rank: 4, questionId: popularColorQuestion.id }),
    Answer.create({ text: 'Purple', rank: 5, questionId: popularColorQuestion.id }),
    Answer.create({ text: 'Pink', rank: 6, questionId: popularColorQuestion.id }),
    Answer.create({ text: 'Black', rank: 7, questionId: popularColorQuestion.id }),
    Answer.create({ text: 'White', rank: 8, questionId: popularColorQuestion.id }),
    Answer.create({ text: 'Orange', rank: 9, questionId: popularColorQuestion.id }),
    Answer.create({ text: 'Gray', rank: 10, questionId: popularColorQuestion.id }),
  ])

  console.log(`seeded ${users.length} users`)
  console.log(`seeded ${colorAnswers.length} answers for the question: "${popularColorQuestion.text}"`)
  console.log(`seeded successfully`)
  return {
    users: {
      ryan: users[0],
      matt: users[1],
      scott: users[2],
      jamal: users[3],
    },
    questions: {
      popularColor: popularColorQuestion,
    },
    answers: {
      blue: colorAnswers[0],
      red: colorAnswers[1],
      green: colorAnswers[2],
      yellow: colorAnswers[3],
      purple: colorAnswers[4],
      pink: colorAnswers[5],
      black: colorAnswers[6],
      white: colorAnswers[7],
      orange: colorAnswers[8],
      gray: colorAnswers[9],
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
