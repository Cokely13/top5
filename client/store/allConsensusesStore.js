import Axios from "axios";

const SET_CONSENSUSES ="SET_CONSENSUSES"
const CREATE_CONSENSUS = "CREATE_CONSENSUS"
const DELETE_CONSENSUS = "DELETE_CONSENSUS"


export const setConsensuses = (consensus) =>{
  return{
    type: SET_CONSENSUSES,
    consensus
  }
};

const _createConsensus = (consensus) => {
  return {
    type: CREATE_CONSENSUS,
    consensus,
  };
};

const _deleteConsensus = (consensus) => {
  return {
    type: DELETE_CONSENSUS,
    consensus
  };
};

export const fetchConsensuses = () => {
  return async (dispatch) => {
        const {data}= await Axios.get("/api/consensuses");
        dispatch(setConsensuses(data));
  };
};

export const createConsensus = (consensus) => {
  return async (dispatch) => {
    console.log("HEYY!!!")
    const { data: created } = await Axios.post("/api/consensuses", consensus);
    dispatch(_createConsensus(created));
    // history.push("/consensuses");
  };
};

export const deleteConsensus = (id, history) => {
  return async (dispatch) => {
    const { data: consensus } = await Axios.delete(`/api/consensuses/${id}`);
    dispatch(_deleteConsensus(consensus));
    history.push("/consensuses");
  };
};


const initialState = [];
export default function consensusesReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CONSENSUSES:
      return action.consensus;
      case CREATE_CONSENSUS:
        return [...state, action.consensus];
        case DELETE_CONSENSUS:
      return state.filter((consensus) => consensus.id !== action.consensus.id)
      ;
      default:
        return state;
    }
  }
