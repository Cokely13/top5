import axios from "axios";

// Action Types
const SET_SINGLE_USERRESPONSE = "SET_SINGLE_USERRESPONSE";
const UPDATE_SINGLE_USERRESPONSE = "UPDATE_SINGLE_USERRESPONSE";
const TOKEN = "token";

// Action creators
export const _setSingleUserResponse= (userResponsedata) => {
  return {
    type: SET_SINGLE_USERRESPONSE,
    userResponsedata,
  };
};

const _updateSingleUserResponse = (userResponsedata) => {
  return {
    type: UPDATE_SINGLE_USERRESPONSE,
    userResponsedata,
  };
};

//Thunks
export const fetchUserResponse = (id) => {
  return async (dispatch) => {
    const { data } = await axios.get(`/api/userResponses/${id}`);
    dispatch(_setSingleUserResponse(data));
  };
};

export const updateSingleUserResponse = (userResponse, history) => {
  return async (dispatch) => {
    try {
        await axios.put(`/api/userResponses/${userResponse.id}`, userResponse);
        const { data: userResponseData } = await axios.get(`/api/userResponses/${userResponse.id}`);
        dispatch(_updateSingleUserResponse(userResponseData));
        history.push(`/userResponses/${userResponse.id}`)
      }
     catch (error) {
      console.log("USERRESPONSE", userResponse)
    }
  };
};

// reducer
const initialState = [];
const singleUserResponseReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SINGLE_USERRESPONSE:
      return action.userResponsedata;
    case UPDATE_SINGLE_USERRESPONSE:
      return action.userResponsedata;
    default:
      return state;
  }
};

export default singleUserResponseReducer;
