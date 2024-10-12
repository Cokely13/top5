import {createStore, combineReducers, applyMiddleware} from 'redux'
import {createLogger} from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import auth from './auth'
import usersReducer from './allUsersStore'
import singleUserReducer from './singleUserStore'
import singleQuestionReducer from './singleQuestionStore'
import questionsReducer from './allQuestionsStore'
import singleGuessReducer from './singleGuessStore'
import guessesReducer from './allGuessesStore'


const reducer = combineReducers({ auth,
  allUsers: usersReducer,
  allQuestions: questionsReducer,
  singleQuestion: singleQuestionReducer,
  singleUser: singleUserReducer,
  singleGuess: singleGuessReducer,
  allGuesses: guessesReducer
 })
const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
)
const store = createStore(reducer, middleware)

export default store
export * from './auth'
