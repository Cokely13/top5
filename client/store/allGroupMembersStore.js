// import Axios from "axios";

// const SET_GROUPMEMBERS ="SET_GROUPMEMBERS"
// const CREATE_GROUPMEMBER = "CREATE_GROUPMEMBER"
// const DELETE_GROUPMEMBER = "DELETE_GROUPMEMBER"


// export const setGroupMembers = (groupMember) =>{
//   return{
//     type: SET_GROUPMEMBERS,
//     groupMember
//   }
// };

// const _createGroupMember = (groupMember) => {
//   return {
//     type: CREATE_GROUPMEMBER,
//     groupMember,
//   };
// };

// const _deleteGroupMember = (groupMember) => {
//   return {
//     type: DELETE_GROUPMEMBER,
//     groupMember
//   };
// };

// export const fetchGroupMembers = () => {
//   return async (dispatch) => {
//         const {data}= await Axios.get("/api/groupMembers");
//         dispatch(setGroupMembers(data));
//   };
// };

// export const createGroupMember = (groupMember) => {
//   return async (dispatch) => {
//     const { data: created } = await Axios.post("/api/groupMembers", groupMember);
//     dispatch(_createGroupMember(created));
//     // history.push("/groupMembers");
//   };
// };

// export const deleteGroupMember = (id, history) => {
//   return async (dispatch) => {
//     const { data: groupMember } = await Axios.delete(`/api/groupMembers/${id}`);
//     dispatch(_deleteGroupMember(groupMember));
//     history.push("/groupMembers");
//   };
// };


// const initialState = [];
// export default function groupMembersReducer(state = initialState, action) {
//   switch (action.type) {
//     case SET_GROUPMEMBERS:
//       return action.groupMember;
//       case CREATE_GROUPMEMBER:
//         return [...state, action.groupMember];
//         case DELETE_GROUPMEMBER:
//       return state.filter((groupMember) => groupMember.id !== action.groupMember.id)
//       ;
//       default:
//         return state;
//     }
//   }

import Axios from "axios";

// Action Types
const SET_GROUPMEMBERS = "SET_GROUPMEMBERS";
const CREATE_GROUPMEMBER = "CREATE_GROUPMEMBER";
const DELETE_GROUPMEMBER = "DELETE_GROUPMEMBER";

// Action Creators
export const setGroupMembers = (groupMember) => {
  return {
    type: SET_GROUPMEMBERS,
    groupMember,
  };
};

const _createGroupMember = (groupMember) => {
  return {
    type: CREATE_GROUPMEMBER,
    groupMember,
  };
};

const _deleteGroupMember = (groupMember) => {
  return {
    type: DELETE_GROUPMEMBER,
    groupMember,
  };
};

// Thunks
export const fetchGroupMembers = () => {
  return async (dispatch) => {
    const { data } = await Axios.get("/api/groupMembers");
    dispatch(setGroupMembers(data));
  };
};

export const createGroupMember = (groupMember) => {
  return async (dispatch) => {
    try {
      const { data: created } = await Axios.post("/api/groupMembers", groupMember);
      dispatch(_createGroupMember(created));
    } catch (error) {
      console.error("Failed to create group member:", error); // Add debugging info
    }
  };
};

export const deleteGroupMember = (id, history) => {
  return async (dispatch) => {
    const { data: groupMember } = await Axios.delete(`/api/groupMembers/${id}`);
    dispatch(_deleteGroupMember(groupMember));
    history.push("/groupMembers");
  };
};

// Reducer
const initialState = [];
export default function groupMembersReducer(state = initialState, action) {
  switch (action.type) {
    case SET_GROUPMEMBERS:
      return action.groupMember;
    case CREATE_GROUPMEMBER:
      return [...state, action.groupMember];
    case DELETE_GROUPMEMBER:
      return state.filter((groupMember) => groupMember.id !== action.groupMember.id);
    default:
      return state;
  }
}
