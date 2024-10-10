import Axios from "axios";

const SET_USERRESPONSES ="SET_USERRESPONSES"
const CREATE_USERRESPONSE = "CREATE_USERRESPONSE"
const DELETE_USERRESPONSE = "DELETE_USERRESPONSE"


export const setUserResponses = (userResponse) =>{
  return{
    type: SET_USERRESPONSES,
    userResponse
  }
};

const _createUserResponse = (userResponse) => {
  return {
    type: CREATE_USERRESPONSE,
    userResponse,
  };
};

const _deleteUserResponse = (userResponse) => {
  return {
    type: DELETE_USERRESPONSE,
    userResponse
  };
};

export const fetchUserResponses = () => {
  return async (dispatch) => {
        const {data}= await Axios.get("/api/userResponses");
        dispatch(setUserResponses(data));
  };
};

export const createUserResponse = (userResponse) => {
  return async (dispatch) => {
    const { data: created } = await Axios.post("/api/userResponses", userResponse);
    dispatch(_createUserResponse(created));
    // history.push("/userResponses");
  };
};

export const deleteUserResponse = (id, history) => {
  return async (dispatch) => {
    const { data: userResponse } = await Axios.delete(`/api/userResponses/${id}`);
    dispatch(_deleteUserResponse(userResponse));
    history.push("/userResponses");
  };
};


const initialState = [];
export default function userResponsesReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USERRESPONSES:
      return action.userResponse;
      case CREATE_USERRESPONSE:
        return [...state, action.userResponse];
        case DELETE_USERRESPONSE:
      return state.filter((userResponse) => userResponse.id !== action.userResponse.id)
      ;
      default:
        return state;
    }
  }
