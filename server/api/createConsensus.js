// createConsensus.js

const { models: { Question, UserResponse, Consensus } } = require('../db');

const createConsensus = async () => {
  console.log('Running scheduled task to create consensus...');
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDateOnly = yesterday.toISOString().split('T')[0];

    console.log("Yesterday's Date:", yesterdayDateOnly);

    const question = await Question.findOne({
      where: {
        dateAsked: yesterdayDateOnly,
        expired: false,
      },
      include: [{ model: UserResponse }],
    });

    if (!question) {
      console.log('No active question for yesterday.');
      return;
    }

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

    const consensusAnswer = optionAVotes > optionBVotes ? 'option_a' : 'option_b';

    await question.update({ expired: true });
    await Consensus.create({
      questionId: question.id,
      consensusAnswer,
      calculatedAt: new Date(),
    });

    console.log('Consensus created successfully.');
  } catch (error) {
    console.error('Error creating consensus:', error);
  } finally {
    process.exit();
  }
};

createConsensus();
