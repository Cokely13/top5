import axios from "axios";

// Action Types
const SET_SINGLE_GROUPMEMBER = "SET_SINGLE_GROUPMEMBER";
const UPDATE_SINGLE_GROUPMEMBER = "UPDATE_SINGLE_GROUPMEMBER";
const TOKEN = "token";

// Action creators
export const _setSingleGroupMember= (groupMemberdata) => {
  return {
    type: SET_SINGLE_GROUPMEMBER,
    groupMemberdata,
  };
};

const _updateSingleGroupMember = (groupMemberdata) => {
  return {
    type: UPDATE_SINGLE_GROUPMEMBER,
    groupMemberdata,
  };
};

//Thunks
export const fetchGroupMember = (id) => {
  return async (dispatch) => {
    const { data } = await axios.get(`/api/groupMembers/${id}`);
    dispatch(_setSingleGroupMember(data));
  };
};

export const updateSingleGroupMember = (groupMember, history) => {
  return async (dispatch) => {
    try {
        await axios.put(`/api/groupMembers/${groupMember.id}`, groupMember);
        const { data: groupMemberData } = await axios.get(`/api/groupMembers/${groupMember.id}`);
        dispatch(_updateSingleGroupMember(groupMemberData));
        history.push(`/groupMembers/${groupMember.id}`)
      }
     catch (error) {
      console.log("GROUPMEMBER", groupMember)
    }
  };
};

// reducer
const initialState = [];
const singleGroupMemberReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SINGLE_GROUPMEMBER:
      return action.groupMemberdata;
    case UPDATE_SINGLE_GROUPMEMBER:
      return action.groupMemberdata;
    default:
      return state;
  }
};

export default singleGroupMemberReducer;
