import Axios from "axios";

const SET_GUESSES ="SET_GUESSES"
const CREATE_GUESS = "CREATE_GUESS"
const DELETE_GUESS = "DELETE_GUESS"


export const setGuesses = (guess) =>{
  return{
    type: SET_GUESSES,
    guess
  }
};

const _createGuess = (guess) => {
  return {
    type: CREATE_GUESS,
    guess,
  };
};

const _deleteGuess = (guess) => {
  return {
    type: DELETE_GUESS,
    guess
  };
};

export const fetchGuesses = () => {
  return async (dispatch) => {
        const {data}= await Axios.get("/api/guesses");
        dispatch(setGuesses(data));
  };
};

export const createGuess = (guess) => {
  return async (dispatch) => {
    const { data: created } = await Axios.post("/api/guesses", guess);
    dispatch(_createGuess(created));
    // history.push("/guesses");
  };
};

export const deleteGuess = (id, history) => {
  return async (dispatch) => {
    const { data: guess } = await Axios.delete(`/api/guesses/${id}`);
    dispatch(_deleteGuess(guess));
    history.push("/guesses");
  };
};


const initialState = [];
export default function guessesReducer(state = initialState, action) {
  switch (action.type) {
    case SET_GUESSES:
      return action.guess;
      case CREATE_GUESS:
        return [...state, action.guess];
        case DELETE_GUESS:
      return state.filter((guess) => guess.id !== action.guess.id)
      ;
      default:
        return state;
    }
  }
