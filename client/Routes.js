import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch, Redirect} from 'react-router-dom'
import { Login, Signup } from './components/AuthForm';
import Home from './components/Home';
import {me} from './store'
import Users from './components/Users'
import UserDetailPage from './components/UserDetailPage';
import Profile from './components/Profile';
import CreateQuestion from './components/CreateQuestion';
import DailyLeaderboard from './components/DailyLeaderboard';
import CareerLeaderboard from './components/CareerLeaderboard';
import Archive from './components/Archive';

/**
 * COMPONENT
 */
class Routes extends Component {
  componentDidMount() {
    this.props.loadInitialData()
  }

  render() {
    const {isLoggedIn} = this.props

    return (
      <div>
        {isLoggedIn ? (
          <Switch>
            <Route exact path="/home" component={Home} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/users" component={Users} />
            <Route exact path="/users/:userId" component={UserDetailPage} />
            <Route exact path="/leaderboard" component={DailyLeaderboard} />
            <Route exact path="/archive" component={Archive} />
            <Route exact path="/career" component={CareerLeaderboard} />
            <Route exact path="/create" component={CreateQuestion} />
            <Redirect to="/home" />
          </Switch>
        ) : (
          <Switch>
            <Route path='/' exact component={ Login } />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
          </Switch>
        )}
      </div>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    // Being 'logged in' for our purposes will be defined has having a state.auth that has a truthy id.
    // Otherwise, state.auth will be an empty object, and state.auth.id will be falsey
    isLoggedIn: !!state.auth.id
  }
}

const mapDispatch = dispatch => {
  return {
    loadInitialData() {
      dispatch(me())
    }
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Routes))
