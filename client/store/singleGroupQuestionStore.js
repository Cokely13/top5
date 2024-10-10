import axios from "axios";

// Action Types
const SET_SINGLE_GROUPQUESTION = "SET_SINGLE_GROUPQUESTION";
const UPDATE_SINGLE_GROUPQUESTION = "UPDATE_SINGLE_GROUPQUESTION";
const TOKEN = "token";

// Action creators
export const _setSingleGroupQuestion= (groupQuestiondata) => {
  return {
    type: SET_SINGLE_GROUPQUESTION,
    groupQuestiondata,
  };
};

const _updateSingleGroupQuestion = (groupQuestiondata) => {
  return {
    type: UPDATE_SINGLE_GROUPQUESTION,
    groupQuestiondata,
  };
};

//Thunks
export const fetchGroupQuestion = (id) => {
  return async (dispatch) => {
    const { data } = await axios.get(`/api/groupQuestions/${id}`);
    dispatch(_setSingleGroupQuestion(data));
  };
};

export const updateSingleGroupQuestion = (groupQuestion, history) => {
  return async (dispatch) => {
    try {
        await axios.put(`/api/groupQuestions/${groupQuestion.id}`, groupQuestion);
        const { data: groupQuestionData } = await axios.get(`/api/groupQuestions/${groupQuestion.id}`);
        dispatch(_updateSingleGroupQuestion(groupQuestionData));
        history.push(`/groupQuestions/${groupQuestion.id}`)
      }
     catch (error) {
      console.log("GROUPQUESTION", groupQuestion)
    }
  };
};

// reducer
const initialState = [];
const singleGroupQuestionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SINGLE_GROUPQUESTION:
      return action.groupQuestiondata;
    case UPDATE_SINGLE_GROUPQUESTION:
      return action.groupQuestiondata;
    default:
      return state;
  }
};

export default singleGroupQuestionReducer;
