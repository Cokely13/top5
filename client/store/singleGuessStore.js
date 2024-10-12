import axios from "axios";

// Action Types
const SET_SINGLE_GUESS = "SET_SINGLE_GUESS";
const UPDATE_SINGLE_GUESS = "UPDATE_SINGLE_GUESS";
const TOKEN = "token";

// Action creators
export const _setSingleGuess= (guessdata) => {
  return {
    type: SET_SINGLE_GUESS,
    guessdata,
  };
};

const _updateSingleGuess = (guessdata) => {
  return {
    type: UPDATE_SINGLE_GUESS,
    guessdata,
  };
};

//Thunks
export const fetchGuess = (id) => {
  return async (dispatch) => {
    const { data } = await axios.get(`/api/guesses/${id}`);
    dispatch(_setSingleGuess(data));
  };
};

// export const updateSingleGuess = (guess) => {
//   return async (dispatch) => {
//     try {
//         await axios.put(`/api/guesses/${guess.id}`, guess);
//         const { data: guessData } = await axios.get(`/api/guesses/${guess.id}`);
//         dispatch(_updateSingleGuess(guessData));
//         history.push(`/guesses/${guess.id}`)
//       }
//      catch (error) {
//       console.log("GUESS", guess)
//     }
//   };
// };

export const updateSingleGuess = (formData) => {
  return async (dispatch) => {
    try {
      // Make sure to pass the formData directly to axios.put
      await axios.put(`/api/guesses/${formData.get('id')}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Fetch the updated guess data
      const { data: guessData } = await axios.get(`/api/guesses/${formData.get('id')}`);
      dispatch(_updateSingleGuess(guessData));
    } catch (error) {
      console.error('Failed to update guess:', error);
    }
  };
};


// reducer
const initialState = [];
const singleGuessReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SINGLE_GUESS:
      return action.guessdata;
    case UPDATE_SINGLE_GUESS:
      return action.guessdata;
    default:
      return state;
  }
};

export default singleGuessReducer;
