'use strict';
const axios = require('axios');
const {
  db,
  models: { User, Question, Answer, Guess },
} = require('../server/db');

async function getHighestGrossingMovies(year) {
  try {
    const response = await axios.get('https://api.themoviedb.org/3/discover/movie', {
      params: {
        api_key: '46bc0d05e584bfed1df9ee4d1ae6c6a6',
        primary_release_year: year,
        sort_by: 'revenue.desc',
        page: 1,
      },
    });
    // Limit to top 10 movies
    return response.data.results.slice(0, 10).map((movie) => movie.title);
  } catch (error) {
    console.error(`Error fetching data for year ${year}:`, error);
    return [];
  }
}

async function getHighestRatedMovies(year) {
  try {
    const response = await axios.get('https://api.themoviedb.org/3/discover/movie', {
      params: {
        api_key: '46bc0d05e584bfed1df9ee4d1ae6c6a6', // Replace with your TMDb API key
        primary_release_year: year,
        sort_by: 'vote_average.desc',
        page: 1,
        vote_count_gte: 100, // Ensure a reasonable number of votes
      },
    });
    // Limit to top 10 movies
    return response.data.results.slice(0, 10).map((movie) => movie.title);
  } catch (error) {
    console.error(`Error fetching highest rated movies for year ${year}:`, error);
    return [];
  }
}

async function getHighestRatedTVShows(year) {
  try {
    const response = await axios.get('https://api.themoviedb.org/3/discover/tv', {
      params: {
        api_key: '46bc0d05e584bfed1df9ee4d1ae6c6a6', // Replace with your TMDb API key
        first_air_date_year: year,
        sort_by: 'vote_average.desc',
        page: 1,
        vote_count_gte: 100, // Ensure a reasonable number of votes
      },
    });
    // Limit to top 10 TV shows
    return response.data.results.slice(0, 10).map((show) => show.name);
  } catch (error) {
    console.error(`Error fetching highest rated TV shows for year ${year}:`, error);
    return [];
  }
}

async function seed() {
  await db.sync({ force: true }); // Clears db and matches models to tables
  console.log('db synced!');

  // Creating Users
  const users = await Promise.all([
    User.create({
      username: 'Ryan',
      admin: true,
      email: 'ryan.cokely@gmail.com',
      password: '123',
    }),
    User.create({
      username: 'Matt',
      email: 'mclaise@gmail.com',
      password: '123',
    }),
    User.create({
      username: 'Scott',
      email: 'scottlcokely@gmail.com',
      password: '123',
    }),
    User.create({
      username: 'Jamal',
      email: 'jamalcoston@gmail.com',
      password: '123',
    }),
  ]);

  // Helper functions
  const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toISOString().split('T')[0]; // Convert to YYYY-MM-DD format
  };

  const adjustDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toISOString().split('T')[0];
  };

  const today = new Date().toISOString().split('T')[0];

  // Existing questionData
  const questionData = [
    {
      text: 'What is the most popular color?',
      dateAsked: today,
      createdBy: users[0].id,
      category: 'Other',
      answers: [
        'Blue',
        'Red',
        'Green',
        'Yellow',
        'Purple',
        'Pink',
        'Black',
        'White',
        'Orange',
        'Gray',
      ],
    },
    {
      text: 'What are the most popular board games?',
      dateAsked: addDays(today, 1),
      createdBy: users[0].id,
      category: 'Entertainment',
      answers: [
        'Chess',
        'Monopoly',
        'Scrabble',
        'Catan',
        'Risk',
        'Clue',
        'Ticket to Ride',
        'Pandemic',
        'Carcassonne',
        'Uno',
      ],
    },
    {
      text: 'What are the most popular sneaker brands?',
      dateAsked: addDays(today, 2),
      createdBy: users[0].id,
      category: 'Other',
      answers: [
        'Nike',
        'Adidas',
        'Jordan',
        'Converse',
        'Vans',
        'Puma',
        'Reebok',
        'New Balance',
        'Asics',
        'Under Armour',
      ],
    },
    {
      text: 'What are the best-selling car brands?',
      dateAsked: addDays(today, 3),
      createdBy: users[0].id,
      category: 'Other',
      answers: [
        'Toyota',
        'Volkswagen',
        'Ford',
        'Honda',
        'Nissan',
        'Hyundai',
        'Chevrolet',
        'Kia',
        'Mercedes-Benz',
        'BMW',
      ],
    },
    {
      text: 'What are the most popular fast food restaurants?',
      dateAsked: addDays(today, 4),
      createdBy: users[0].id,
      category: 'Food',
      answers: [
        "McDonald's",
        'Starbucks',
        'Subway',
        'KFC',
        'Burger King',
        "Taco Bell",
        "Wendy's",
        "Dunkin'",
        "Domino's Pizza",
        'Pizza Hut',
      ],
    },
    {
      text: 'What are the most popular kinds of soup?',
      dateAsked: addDays(today, 5),
      createdBy: users[0].id,
      category: 'Food',
      answers: [
        'Chicken Noodle',
        'Tomato',
        'Minestrone',
        'Clam Chowder',
        'French Onion',
        'Broccoli Cheddar',
        'Lentil',
        'Beef Stew',
        'Pumpkin',
        'Miso',
      ],
    },
    {
      text: 'What are the most popular kinds of sandwiches?',
      dateAsked: addDays(today, 6),
      createdBy: users[0].id,
      category: 'Food',
      answers: [
        'Hamburger',
        'Club Sandwich',
        'BLT',
        'Grilled Cheese',
        'Turkey Sandwich',
        'Ham and Cheese',
        'Reuben',
        'Philly Cheesesteak',
        'Tuna Sandwich',
        'Pulled Pork',
      ],
    },
    {
      text: 'What are the most popular sodas?',
      dateAsked: addDays(today, 7),
      createdBy: users[0].id,
      category: 'Food',
      answers: [
        'Coca-Cola',
        'Pepsi',
        'Sprite',
        'Dr Pepper',
        'Mountain Dew',
        'Fanta',
        '7 Up',
        'Diet Coke',
        'Root Beer',
        'Diet Pepsi',
      ],
    },
    {
      text: 'What are the most popular brands of chips?',
      dateAsked: addDays(today, 8),
      createdBy: users[0].id,
      category: 'Food',
      answers: [
        "Lay's",
        'Doritos',
        'Pringles',
        'Cheetos',
        'Ruffles',
        'Tostitos',
        'Fritos',
        'Sun Chips',
        'Cape Cod',
        'Kettle Brand',
      ],
    },
    {
      text: 'What are the most popular candy bars?',
      dateAsked: addDays(today, 9),
      createdBy: users[0].id,
      category: 'Food',
      answers: [
        'Snickers',
        "M&M's",
        'Kit Kat',
        'Twix',
        "Reese's Peanut Butter Cups",
        "Hershey's Milk Chocolate",
        'Milky Way',
        '3 Musketeers',
        'Butterfinger',
        'Baby Ruth',
      ],
    },
    {
      text: 'What are the most popular sports?',
      dateAsked: addDays(today, 10),
      createdBy: users[0].id,
      category: 'Sports',
      answers: [
        'Soccer',
        'Cricket',
        'Basketball',
        'Baseball',
        'American Football',
        'Tennis',
        'Volleyball',
        'Table Tennis',
        'Rugby',
        'Golf',
      ],
    },
    {
      text: 'What are the most populous U.S. states?',
      dateAsked: addDays(today, 11),
      createdBy: users[0].id,
      category: 'Places',
      answers: [
        'California',
        'Texas',
        'Florida',
        'New York',
        'Pennsylvania',
        'Illinois',
        'Ohio',
        'Georgia',
        'North Carolina',
        'Michigan',
      ],
    },
    {
      text: 'What are the most populous countries?',
      dateAsked: addDays(today, 12),
      createdBy: users[0].id,
      category: 'Places',
      answers: [
        'China',
        'India',
        'United States',
        'Indonesia',
        'Pakistan',
        'Brazil',
        'Nigeria',
        'Bangladesh',
        'Russia',
        'Mexico',
      ],
    },
    {
      text: 'What are the most popular tourist sites in the USA?',
      dateAsked: addDays(today, 13),
      createdBy: users[0].id,
      category: 'Places',
      answers: [
        'Times Square',
        'Central Park',
        'Las Vegas Strip',
        'Golden Gate Bridge',
        'Walt Disney World',
        'Grand Canyon',
        'Niagara Falls',
        'Statue of Liberty',
        'Yellowstone National Park',
        'Disneyland',
      ],
    },
    {
      text: 'What are the best bachelor party cities?',
      dateAsked: addDays(today, 14),
      createdBy: users[0].id,
      category: 'Places',
      answers: [
        'Las Vegas',
        'Miami',
        'New Orleans',
        'New York City',
        'Chicago',
        'Austin',
        'Nashville',
        'Los Angeles',
        'Atlantic City',
        'Scottsdale',
      ],
    },
    {
      text: 'What are the top college football programs?',
      dateAsked: addDays(today, 15),
      createdBy: users[0].id,
      category: 'Sports',
      answers: [
        'Alabama',
        'Ohio State',
        'Clemson',
        'Notre Dame',
        'Oklahoma',
        'LSU',
        'Georgia',
        'Michigan',
        'Texas',
        'Florida',
      ],
    },
    {
      text: 'What are the most popular flowers?',
      dateAsked: addDays(today, 16),
      createdBy: users[0].id,
      category: 'Other',
      answers: [
        'Rose',
        'Tulip',
        'Sunflower',
        'Daisy',
        'Lily',
        'Orchid',
        'Daffodil',
        'Chrysanthemum',
        'Lavender',
        'Carnation',
      ],
    },
  ];

  let dateOffset = questionData.length + 1;

  // Fetching the highest grossing movies for each year from 2013 to 2023
  for (let year = 2013; year <= 2023; year++) {
    const topMovies = await getHighestGrossingMovies(year);
    if (topMovies.length > 0) {
      questionData.push({
        text: `What is the highest grossing movie of ${year}?`,
        dateAsked: addDays(today, dateOffset++),
        createdBy: users[0].id,
        category: 'Entertainment',
        answers: topMovies,
      });
    }
  }

  // Fetching the highest rated movies for each year from 2013 to 2023
  for (let year = 2013; year <= 2023; year++) {
    const highestRatedMovies = await getHighestRatedMovies(year);
    if (highestRatedMovies.length > 0) {
      questionData.push({
        text: `What is the highest rated movie of ${year}?`,
        dateAsked: addDays(today, dateOffset++),
        createdBy: users[0].id,
        category: 'Entertainment',
        answers: highestRatedMovies,
      });
    }
  }

  // Fetching the highest rated TV shows for each year from 2013 to 2023
  for (let year = 2013; year <= 2023; year++) {
    const highestRatedTVShows = await getHighestRatedTVShows(year);
    if (highestRatedTVShows.length > 0) {
      questionData.push({
        text: `What is the highest rated TV show of ${year}?`,
        dateAsked: addDays(today, dateOffset++),
        createdBy: users[0].id,
        category: 'Entertainment',
        answers: highestRatedTVShows,
      });
    }
  }

  // ==========================
  // ADDING DUMMY EXPIRED DATA
  // ==========================

  // Expired Questions Data
  const expiredQuestionData = [
    {
      text: 'Who won the FIFA World Cup in 2018?',
      dateAsked: adjustDays(today, -1),
      createdBy: users[0].id,
      category: 'Sports',
      expired: true,
      dailyWinnerId: users[0].id, // Ryan
      answers: [
        'France',
        'Croatia',
        'Belgium',
        'England',
        'Russia',
        'Brazil',
        'Sweden',
        'Uruguay',
        'Colombia',
        'Switzerland',
      ],
    },
    {
      text: 'What are the top-grossing movies of 2019?',
      dateAsked: adjustDays(today, -2),
      createdBy: users[0].id,
      category: 'Entertainment',
      expired: true,
      dailyWinnerId: users[1].id, // Matt
      answers: [
        'Avengers: Endgame',
        'The Lion King',
        'Frozen II',
        'Spider-Man: Far From Home',
        'Captain Marvel',
        'Joker',
        'Star Wars: The Rise of Skywalker',
        'Toy Story 4',
        'Aladdin',
        'Jumanji: The Next Level',
      ],
    },
    {
      text: 'What are the most popular pizza toppings?',
      dateAsked: adjustDays(today, -3),
      createdBy: users[0].id,
      category: 'Food',
      expired: true,
      dailyWinnerId: users[3].id, // Jamal
      answers: [
        'Pepperoni',
        'Mushrooms',
        'Onions',
        'Sausage',
        'Bacon',
        'Extra cheese',
        'Black olives',
        'Green peppers',
        'Pineapple',
        'Spinach',
      ],
    },
    {
      text: 'Who are the highest-paid athletes of 2020?',
      dateAsked: adjustDays(today, -4),
      createdBy: users[0].id,
      category: 'Sports',
      expired: true,
      dailyWinnerId: users[1].id, // Matt
      answers: [
        'Roger Federer',
        'Cristiano Ronaldo',
        'Lionel Messi',
        'Neymar',
        'LeBron James',
        'Stephen Curry',
        'Kevin Durant',
        'Tiger Woods',
        'Kirk Cousins',
        'Carson Wentz',
      ],
    },
    {
      text: 'What are the most common programming languages?',
      dateAsked: adjustDays(today, -5),
      createdBy: users[0].id,
      category: 'Other',
      expired: true,
      dailyWinnerId: users[0].id, // Ryan
      answers: [
        'JavaScript',
        'Python',
        'Java',
        'C#',
        'PHP',
        'C++',
        'TypeScript',
        'Ruby',
        'Swift',
        'Go',
      ],
    },
  ];

  // Initialize a user stats object to keep track of points and wins
  const userStats = {};

  // Create Expired Questions, Answers, and Guesses
  for (const qData of expiredQuestionData) {
    const question = await Question.create({
      text: qData.text,
      dateAsked: qData.dateAsked,
      status: 'accepted',
      createdBy: qData.createdBy,
      category: qData.category,
      expired: qData.expired,
      dailyWinnerId: qData.dailyWinnerId,
    });

    // Create Answers
    for (let i = 0; i < qData.answers.length; i++) {
      await Answer.create({
        text: qData.answers[i],
        rank: i + 1, // Ranks from 1 to 10
        questionId: question.id,
      });
    }

    // Initialize user stats for this question
    for (const user of users) {
      if (!userStats[user.id]) {
        userStats[user.id] = {
          totalPoints: 0,
          wins: 0,
          categories: {}, // To track points and wins per category
        };
      }
      if (!userStats[user.id].categories[qData.category]) {
        userStats[user.id].categories[qData.category] = {
          points: 0,
          wins: 0,
        };
      }
    }

    // Create Guesses for users
    for (const user of users) {
      let guessedAnswers;
      if (user.id === qData.dailyWinnerId) {
        // Daily winner guessed more correct answers
        guessedAnswers = qData.answers.slice(0, 5); // Top 5 answers
      } else {
        // Other users guessed fewer answers
        guessedAnswers = qData.answers.slice(5, 7); // Next 2 answers
      }

      let userTotalPoints = 0;

      for (const guessText of guessedAnswers) {
        // Assign points based on rank
        const answerRank = qData.answers.indexOf(guessText) + 1;
        const pointsEarned = 11 - answerRank; // Higher rank, more points
        userTotalPoints += pointsEarned;

        await Guess.create({
          guess: guessText,
          pointsEarned: pointsEarned,
          userId: user.id,
          questionId: question.id,
        });
      }

      // Incorrect guess (adds a strike but no points)
      await Guess.create({
        guess: 'Incorrect Guess',
        pointsEarned: 0,
        userId: user.id,
        questionId: question.id,
      });

      // Update userStats with points earned for this question
      userStats[user.id].totalPoints += userTotalPoints;
      userStats[user.id].categories[qData.category].points += userTotalPoints;
    }

    // Update wins for the daily winner
    const winnerId = qData.dailyWinnerId;
    userStats[winnerId].wins += 1;
    userStats[winnerId].categories[qData.category].wins += 1;
  }

  // Update users with totalPoints and wins
  for (const user of users) {
    const stats = userStats[user.id];
    await user.update({
      totalPoints: stats.totalPoints,
      wins: stats.wins,
    });
  }

  // Create Future Questions and Answers
  for (const qData of questionData) {
    const question = await Question.create({
      text: qData.text,
      dateAsked: qData.dateAsked,
      status: 'accepted',
      createdBy: qData.createdBy,
      category: qData.category,
    });

    // Create Answers
    for (let i = 0; i < qData.answers.length; i++) {
      await Answer.create({
        text: qData.answers[i],
        rank: i + 1,
        questionId: question.id,
      });
    }
  }

  console.log(`seeded ${users.length} users`);
  console.log(`seeded ${questionData.length} future questions with answers`);
  console.log(`seeded ${expiredQuestionData.length} expired questions with answers`);
  console.log('seeded successfully');

  return {
    users: {
      ryan: users[0],
      matt: users[1],
      scott: users[2],
      jamal: users[3],
    },
    // You can return questions and answers if needed
  };
}

async function runSeed() {
  console.log('seeding...');
  try {
    await seed();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    console.log('closing db connection');
    await db.close();
    console.log('db connection closed');
  }
}

if (module === require.main) {
  runSeed();
}

module.exports = seed;
