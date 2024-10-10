import Axios from "axios";

const SET_GROUPQUESTIONS ="SET_GROUPQUESTIONS"
const CREATE_GROUPQUESTION = "CREATE_GROUPQUESTION"
const DELETE_GROUPQUESTION = "DELETE_GROUPQUESTION"


export const setGroupQuestions = (groupQuestion) =>{
  return{
    type: SET_GROUPQUESTIONS,
    groupQuestion
  }
};

const _createGroupQuestion = (groupQuestion) => {
  return {
    type: CREATE_GROUPQUESTION,
    groupQuestion,
  };
};

const _deleteGroupQuestion = (groupQuestion) => {
  return {
    type: DELETE_GROUPQUESTION,
    groupQuestion
  };
};

export const fetchGroupQuestions = () => {
  return async (dispatch) => {
        const {data}= await Axios.get("/api/groupQuestions");
        dispatch(setGroupQuestions(data));
  };
};

export const createGroupQuestion = (groupQuestion) => {
  return async (dispatch) => {
    const { data: created } = await Axios.post("/api/groupQuestions", groupQuestion);
    dispatch(_createGroupQuestion(created));
    // history.push("/groupQuestions");
  };
};

export const deleteGroupQuestion = (id, history) => {
  return async (dispatch) => {
    const { data: groupQuestion } = await Axios.delete(`/api/groupQuestions/${id}`);
    dispatch(_deleteGroupQuestion(groupQuestion));
    history.push("/groupQuestions");
  };
};


const initialState = [];
export default function groupQuestionsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_GROUPQUESTIONS:
      return action.groupQuestion;
      case CREATE_GROUPQUESTION:
        return [...state, action.groupQuestion];
        case DELETE_GROUPQUESTION:
      return state.filter((groupQuestion) => groupQuestion.id !== action.groupQuestion.id)
      ;
      default:
        return state;
    }
  }
