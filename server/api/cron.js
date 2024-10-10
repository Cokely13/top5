const cron = require('node-cron');
const { models:  {Question, UserResponse, Consensus} } = require('../db');

// Schedule a job to run every day at midnight
cron.schedule('0 0 * * *', async () => {
  console.log('Running scheduled task to create consensus at midnight...');
  try {
    // Get today's date in YYYY-MM-DD format

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDateOnly = yesterday.toISOString().split('T')[0];

    console.log("todaySDate", yesterdayDateOnly)


    // Query to find a question with today's date
    const question = await Question.findOne({
      where: {
        dateAsked: yesterdayDateOnly,
        expired: false,
      },
      include: [{ model: UserResponse }],
    });

    if (!question) {
      console.log('No active question for today.');
      return;
    }

    // Calculate votes
    const optionAVotes = question.user_responses.filter(
      (response) => response.response === 'option_a'
    ).length;
    const optionBVotes = question.user_responses.filter(
      (response) => response.response === 'option_b'
    ).length;

    if (optionAVotes === optionBVotes) {
      console.log('No consensus reached, equal votes for both options.');
      return;
    }

    // Determine the consensus answer
    const consensusAnswer = optionAVotes > optionBVotes ? 'option_a' : 'option_b';

    // Mark question as expired and create consensus
    await question.update({ expired: true });
    await Consensus.create({
      questionId: question.id,
      consensusAnswer,
      calculatedAt: new Date(),
    });

    console.log('Consensus created successfully.');
  } catch (error) {
    console.error('Error creating consensus:', error);
  }
});
