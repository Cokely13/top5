import axios from "axios";

// Action Types
const SET_SINGLE_CONSENSUS = "SET_SINGLE_CONSENSUS";
const UPDATE_SINGLE_CONSENSUS = "UPDATE_SINGLE_CONSENSUS";
const TOKEN = "token";

// Action creators
export const _setSingleConsensus= (consensusdata) => {
  return {
    type: SET_SINGLE_CONSENSUS,
    consensusdata,
  };
};

const _updateSingleConsensus = (consensusdata) => {
  return {
    type: UPDATE_SINGLE_CONSENSUS,
    consensusdata,
  };
};

//Thunks
export const fetchConsensus = (id) => {
  return async (dispatch) => {
    const { data } = await axios.get(`/api/consensuss/${id}`);
    dispatch(_setSingleConsensus(data));
  };
};

export const updateSingleConsensus = (consensus, history) => {
  return async (dispatch) => {
    try {
        await axios.put(`/api/consensuss/${consensus.id}`, consensus);
        const { data: consensusData } = await axios.get(`/api/consensuss/${consensus.id}`);
        dispatch(_updateSingleConsensus(consensusData));
        history.push(`/consensuss/${consensus.id}`)
      }
     catch (error) {
      console.log("CONSENSUS", consensus)
    }
  };
};

// reducer
const initialState = [];
const singleConsensusReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SINGLE_CONSENSUS:
      return action.consensusdata;
    case UPDATE_SINGLE_CONSENSUS:
      return action.consensusdata;
    default:
      return state;
  }
};

export default singleConsensusReducer;
