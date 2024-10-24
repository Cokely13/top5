const cron = require('node-cron');
const { models: { Question, Guess, User } } = require('../db');

async function updateDailyQuestionAndWinner() {
  console.log('Running scheduled task to update daily question and winner...');

  try {
    // Get yesterday's date in YYYY-MM-DD format
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDateOnly = yesterday.toISOString().split('T')[0];

    // Find the question for yesterday that hasn't expired
    const question = await Question.findOne({
      where: {
        dateAsked: `${yesterdayDateOnly}`,
        expired: false,
      },
      include: [{ model: Guess }],
    });

    if (!question) {
      console.log('No active question for yesterday.');
      return;
    }

    // Calculate the winner based on the highest total points for that question
    const userPointsMap = {};

    question.Guesses.forEach((guess) => {
      if (!userPointsMap[guess.userId]) {
        userPointsMap[guess.userId] = 0;
      }
      userPointsMap[guess.userId] += guess.pointsEarned;
    });

    // Determine the users with the highest points
    let maxPoints = -1;
    let potentialWinners = [];

    Object.keys(userPointsMap).forEach((userId) => {
      if (userPointsMap[userId] > maxPoints) {
        maxPoints = userPointsMap[userId];
        potentialWinners = [userId]; // Reset the list if a higher score is found
      } else if (userPointsMap[userId] === maxPoints) {
        potentialWinners.push(userId); // Add to the list if the score matches maxPoints
      }
    });

    let winnerId = null;

    if (potentialWinners.length === 1) {
      // Only one winner with the highest points
      winnerId = potentialWinners[0];
    } else if (potentialWinners.length > 1) {
      // Multiple users have the same points, choose one randomly
      const randomIndex = Math.floor(Math.random() * potentialWinners.length);
      winnerId = potentialWinners[randomIndex];
    }

    if (winnerId) {
      // Update the question with the daily winner
      await question.update({ dailyWinnerId: winnerId });
      console.log(`Daily winner updated successfully for question ID ${question.id}. Winner ID: ${winnerId}`);

      const winnerUser = await User.findByPk(winnerId);
      if (winnerUser) {
        const currentWins = winnerUser.wins || 0;
        await winnerUser.update({ wins: currentWins + 1 });
        console.log(`User ${winnerUser.username} (ID: ${winnerId}) wins incremented. Total wins: ${currentWins + 1}`);
      } else {
        console.log(`Winner user with ID ${winnerId} not found.`);
      }
    }

    // Mark the question as expired
    await question.update({ expired: true });
    console.log('Question marked as expired successfully.');
  } catch (error) {
    console.error('Error running daily update:', error);
  }
}

// Schedule the task to run every day at midnight (Eastern Time)
cron.schedule('0 0 * * *', updateDailyQuestionAndWinner, {
  timezone: "America/New_York"
});

// Run the function immediately if you execute the script manually
updateDailyQuestionAndWinner();
