import React from 'react';
import { connect } from 'react-redux';
import QuestionOfTheDay from './QuestionOfTheDay';
import Heading from './Heading';
import TodaysLeaderboard from './TodaysLeaderboard';
import DailyCongrats from './DailyCongrats';


/**
 * COMPONENT
 */
export const Home = (props) => {
  const { username } = props;

  return (
    <div className="home-container">
      <Heading/>
      <DailyCongrats />
      {/* <div className="Todayleaderboard-container">
        <TodaysLeaderboard/>
      </div> */}
      <div className="qotd-container">
        <QuestionOfTheDay />
      </div>
    </div>
  );
};

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    username: state.auth.username,
  };
};

export default connect(mapState)(Home);
